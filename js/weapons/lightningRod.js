/**
 * حارة العفاريت — Harat El Afareet
 * Weapon: Lightning Rod (كهربا الحارة) — Zero Camera Shake, Clean Vertical Lightning Beam
 */

import { BaseWeapon } from './baseWeapon.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';
import { particleSystem } from '../systems/particleSystem.js';
import { damageSystem } from '../systems/damageSystem.js';

export class LightningRod extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'lightningRod',
            name: 'كهربا الحارة',
            description: 'بتنزل صواعق ورعود تكهرب وتفرتك عفاريت كتيرة في ثانية واحدة.',
            icon: '⚡',
            damage: 48,
            cooldown: 1.6,
            projectileCount: 2,
            range: 560,
            critChance: 0.18,
            damageType: DAMAGE_TYPES.LIGHTNING
        });
        this.strikeRadius = 45;
    }

    applyLevelStats(level) {
        switch (level) {
            case 2:
                this.projectileCount += 1;
                break;
            case 3:
                this.damage += 18;
                break;
            case 4:
                this.cooldown *= 0.82;
                break;
            case 5:
                this.projectileCount += 1;
                this.strikeRadius += 12;
                break;
            case 6:
                this.damage += 25;
                this.critChance += 0.12;
                break;
            case 7:
                this.cooldown *= 0.78;
                break;
            case 8:
                this.projectileCount += 2;
                this.damage += 35;
                this.strikeRadius += 20;
                break;
        }
    }

    fire(enemies, projectiles) {
        const targets = this.findRandomEnemies(enemies, this.projectileCount, this.range);
        if (targets.length === 0) return;

        this.player.triggerCastAnimation();
        audioSystem.playLightning();

        // NO CAMERA SHAKE on lightning strike!

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            if (!target.alive) continue;

            const result = damageSystem.calculateDamage(this.damage, this.player, target, this.damageType);
            target.takeDamage(result.damage, this.player, true);
            damageSystem.spawnText(target.x, target.y, result.damage, result.isCrit, '#67e8f9');

            // 1. Vertical Lightning Beam Impact Particle
            particleSystem.emit({
                x: target.x,
                y: target.y - 120,
                vx: 0,
                vy: 500,
                color: '#ffffff',
                size: 4,
                life: 0.16,
                shape: 'circle'
            });

            // 2. Ground Shockwave Ring
            particleSystem.emit({
                x: target.x,
                y: target.y,
                color: '#67e8f9',
                size: this.strikeRadius * (this.player.areaMultiplier || 1.0),
                life: 0.20,
                shape: 'ring',
                lineWidth: 3
            });
            particleSystem.emitHitSparks(target.x, target.y, '#ffffff', 10);

            const splashRadius = this.strikeRadius * (this.player.areaMultiplier || 1.0);
            for (let j = 0; j < enemies.length; j++) {
                const other = enemies[j];
                if (other === target || !other.alive) continue;
                const dx = other.x - target.x;
                const dy = other.y - target.y;
                if (Math.sqrt(dx * dx + dy * dy) <= splashRadius) {
                    const splashDmg = Math.round(result.damage * 0.55);
                    other.takeDamage(splashDmg, this.player, true);
                    damageSystem.spawnText(other.x, other.y, splashDmg, false, '#67e8f9');
                }
            }
        }
    }
}
