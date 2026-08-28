/**
 * حارة العفاريت — Harat El Afareet
 * Spatial Partitioning Collision Engine & Full Combat Damage Resolver
 */

import { damageSystem } from './damageSystem.js';
import { particleSystem } from './particleSystem.js';
import { audioSystem } from './audioSystem.js';

export class CollisionSystem {
    constructor(cellSize = 128) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    clear() {
        this.grid.clear();
    }

    getCellKey(col, row) {
        return `${col},${row}`;
    }

    insert(entity) {
        if (!entity || !entity.alive) return;
        const col = Math.floor(entity.x / this.cellSize);
        const row = Math.floor(entity.y / this.cellSize);
        const key = this.getCellKey(col, row);

        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key).push(entity);
    }

    /**
     * Get all potential candidate entities within a bounding radius
     */
    queryRadius(x, y, radius) {
        const candidates = [];
        const minCol = Math.floor((x - radius) / this.cellSize);
        const maxCol = Math.floor((x + radius) / this.cellSize);
        const minRow = Math.floor((y - radius) / this.cellSize);
        const maxRow = Math.floor((y + radius) / this.cellSize);

        for (let c = minCol; c <= maxCol; c++) {
            for (let r = minRow; r <= maxRow; r++) {
                const key = this.getCellKey(c, r);
                const cell = this.grid.get(key);
                if (cell) {
                    for (let i = 0; i < cell.length; i++) {
                        candidates.push(cell[i]);
                    }
                }
            }
        }
        return candidates;
    }

    /**
     * Circle-Circle intersection check
     */
    checkCircleOverlap(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distSq = dx * dx + dy * dy;
        const radSum = r1 + r2;
        return distSq <= radSum * radSum;
    }

    /**
     * Get distance between two points
     */
    getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Batch Collision Resolver with Full Combat Damage Calculation
     */
    checkAll(player, hostiles = [], projectiles = [], pickups = []) {
        if (!player || !player.alive) return;

        // 1. Build Spatial Grid for Hostiles
        this.clear();
        for (let i = 0; i < hostiles.length; i++) {
            this.insert(hostiles[i]);
        }

        // 2. Player vs Hostiles (Melee / Contact Damage)
        const pRadius = player.radius || 18;
        const nearbyHostiles = this.queryRadius(player.x, player.y, pRadius + 48);
        for (let i = 0; i < nearbyHostiles.length; i++) {
            const h = nearbyHostiles[i];
            if (!h || !h.alive) continue;
            const hRadius = h.radius || 16;
            if (this.checkCircleOverlap(player.x, player.y, pRadius, h.x, h.y, hRadius)) {
                if (typeof h.onCollideWithPlayer === 'function') {
                    h.onCollideWithPlayer(player);
                } else {
                    player.takeDamage(h.damage || 10);
                }
            }
        }

        // 3. Projectiles vs Hostiles / Player
        for (let i = 0; i < projectiles.length; i++) {
            const proj = projectiles[i];
            if (!proj || !proj.alive) continue;

            const projRad = proj.radius || 10;

            // 3A. Enemy Projectiles hitting the Player
            if (proj.isEnemy) {
                if (this.checkCircleOverlap(proj.x, proj.y, projRad, player.x, player.y, pRadius)) {
                    player.takeDamage(proj.damage || 8);
                    particleSystem.emitHitSparks(player.x, player.y, '#ef4444', 6);
                    proj.alive = false;
                }
                continue;
            }

            // 3B. Player Projectiles hitting Hostiles
            const targets = this.queryRadius(proj.x, proj.y, projRad + 40);

            for (let j = 0; j < targets.length; j++) {
                const target = targets[j];
                if (!target || !target.alive) continue;

                const tRad = target.radius || 16;
                if (this.checkCircleOverlap(proj.x, proj.y, projRad, target.x, target.y, tRad)) {
                    if (typeof proj.canHit === 'function' && !proj.canHit(target)) {
                        continue;
                    }

                    // Compute Damage
                    const dmgResult = damageSystem.calculateDamage(
                        proj.damage,
                        player,
                        target,
                        proj.damageType
                    );

                    // Compute Knockback Vector
                    let kbForce = proj.knockback || 150;
                    let kbx = 0;
                    let kby = 0;
                    if (proj.vx !== 0 || proj.vy !== 0) {
                        const spd = Math.sqrt(proj.vx * proj.vx + proj.vy * proj.vy);
                        if (spd > 0) {
                            kbx = proj.vx / spd;
                            kby = proj.vy / spd;
                        }
                    } else {
                        const dx = target.x - player.x;
                        const dy = target.y - player.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist > 0) {
                            kbx = dx / dist;
                            kby = dy / dist;
                        }
                    }

                    // Deal Direct Damage to Enemy
                    target.takeDamage(dmgResult.damage, player, true, {
                        x: kbx,
                        y: kby,
                        force: kbForce
                    });

                    // Visual Floating Damage Number & Sparks
                    damageSystem.spawnText(
                        target.x,
                        target.y,
                        dmgResult.damage,
                        dmgResult.isCrit,
                        dmgResult.isCrit ? '#fde047' : (proj.color || '#ffffff')
                    );
                    particleSystem.emitHitSparks(
                        target.x,
                        target.y,
                        proj.color || '#ffffff',
                        dmgResult.isCrit ? 12 : 6
                    );
                    audioSystem.playHit();

                    // Apply Status Effects (e.g. Fire Burn)
                    if (proj.appliesBurn && typeof target.applyBurn === 'function') {
                        target.applyBurn(proj.burnDamage || 8, proj.burnDuration || 3.0, player);
                    }

                    // Handle Explosive Area Projectiles (Splash Damage)
                    if (proj.explodeOnHit) {
                        const expRadius = proj.explosionRadius || 50;
                        const splashTargets = this.queryRadius(proj.x, proj.y, expRadius);
                        for (let k = 0; k < splashTargets.length; k++) {
                            const splashT = splashTargets[k];
                            if (!splashT || !splashT.alive || splashT === target) continue;
                            if (this.checkCircleOverlap(proj.x, proj.y, expRadius, splashT.x, splashT.y, splashT.radius || 16)) {
                                const splashDmg = Math.max(1, Math.round(dmgResult.damage * 0.75));
                                const sDx = splashT.x - proj.x;
                                const sDy = splashT.y - proj.y;
                                const sDist = Math.sqrt(sDx * sDx + sDy * sDy) || 1;
                                splashT.takeDamage(splashDmg, player, true, {
                                    x: sDx / sDist,
                                    y: sDy / sDist,
                                    force: kbForce * 0.8
                                });
                                damageSystem.spawnText(splashT.x, splashT.y, splashDmg, false, proj.color || '#f97316');
                                if (proj.appliesBurn && typeof splashT.applyBurn === 'function') {
                                    splashT.applyBurn(proj.burnDamage || 8, proj.burnDuration || 3.0, player);
                                }
                            }
                        }
                    }

                    // Notify projectile of hit (reduces pierce, explodes, etc.)
                    if (typeof proj.onHit === 'function') {
                        proj.onHit(target);
                    }

                    if (!proj.alive) break;
                }
            }
        }

        // 4. Player vs Pickups
        for (let i = 0; i < pickups.length; i++) {
            const pickup = pickups[i];
            if (!pickup || !pickup.alive) continue;

            const pickupRad = pickup.radius || 12;
            if (this.checkCircleOverlap(player.x, player.y, pRadius + 12, pickup.x, pickup.y, pickupRad)) {
                if (typeof pickup.onCollect === 'function') {
                    pickup.onCollect(player);
                }
            }
        }
    }
}

export const collisionSystem = new CollisionSystem(128);
