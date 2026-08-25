/**
 * حارة العفاريت — Harat El Afareet
 * Weapon: Lightning Rod (صاعقة السماء)
 */

import { BaseWeapon } from './baseWeapon.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';
import { particleSystem } from '../systems/particleSystem.js';
import { damageSystem } from '../systems/damageSystem.js';
import { cameraSystem } from '../systems/cameraSystem.js';

export class LightningRod extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'lightningRod',
            name: 'صاعقة السماء (Lightning Rod)',
            description: 'تسقط صواعق كهربائية خارقة من السماء على الأعداء العشوائيين.',
            icon: '⚡',
            damage: 36,
            cooldown: 1.8,
            projectileCount: 2,
            range: 520,
            critChance: 0.15,
            damageType: DAMAGE_TYPES.LIGHTNING
        });
        this.strikeRadius = 38;
    }

    applyLevelStats(level) {
        switch (level) {
            case 2:
                this.projectileCount += 1;
                break;
            case 3:
                this.damage += 14;
                break;
            case 4:
                this.cooldown *= 0.85;
                break;
            case 5:
                this.projectileCount += 1;
                this.strikeRadius += 10;
                break;
            case 6:
                this.damage += 20;
                this.critChance += 0.10;
                break;
            case 7:
                this.cooldown *= 0.80;
                break;
            case 8:
                this.projectileCount += 2;
                this.damage += 30;
                this.strikeRadius += 15;
                break;
        }
    }

    fire(enemies, projectiles) {
        const targets = this.findRandomEnemies(enemies, this.projectileCount, this.range);
        if (targets.length === 0) return;

        audioSystem.playLightning();
        cameraSystem.triggerShake(5);

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            if (!target.alive) continue;

            // Compute hit damage
            const result = damageSystem.calculateDamage(this.damage, this.player, target, this.damageType);
            target.takeDamage(result.damage, this.player, true);
            damageSystem.spawnText(target.x, target.y, result.damage, result.isCrit, '#67e8f9');

            // Lightning visual fx
            particleSystem.emit({
                x: target.x,
                y: target.y,
                color: '#67e8f9',
                size: this.strikeRadius * (this.player.areaMultiplier || 1.0),
                life: 0.22,
                shape: 'ring',
                lineWidth: 4
            });
            particleSystem.emitHitSparks(target.x, target.y, '#ffffff', 10);

            // Splash damage to nearby surrounding enemies
            const splashRadius = this.strikeRadius * (this.player.areaMultiplier || 1.0);
            for (let j = 0; j < enemies.length; j++) {
                const other = enemies[j];
                if (other === target || !other.alive) continue;
                const dx = other.x - target.x;
                const dy = other.y - target.y;
                if (Math.sqrt(dx * dx + dy * dy) <= splashRadius) {
                    const splashDmg = Math.round(result.damage * 0.5);
                    other.takeDamage(splashDmg, this.player, true);
                    damageSystem.spawnText(other.x, other.y, splashDmg, false, '#67e8f9');
                }
            }
        }
    }
}
