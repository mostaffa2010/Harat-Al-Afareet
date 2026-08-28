/**
 * حارة العفاريت — Harat El Afareet
 * Spatial Partitioning Collision Engine & Batch Collision Resolver
 */

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
     * Batch Collision Resolver
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

        // 3. Projectiles vs Hostiles
        for (let i = 0; i < projectiles.length; i++) {
            const proj = projectiles[i];
            if (!proj || !proj.alive) continue;

            const projRad = proj.radius || 10;
            const targets = this.queryRadius(proj.x, proj.y, projRad + 32);

            for (let j = 0; j < targets.length; j++) {
                const target = targets[j];
                if (!target || !target.alive) continue;

                const tRad = target.radius || 16;
                if (this.checkCircleOverlap(proj.x, proj.y, projRad, target.x, target.y, tRad)) {
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
