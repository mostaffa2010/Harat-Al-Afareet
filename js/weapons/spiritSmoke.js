/**
 * حارة العفاريت — Harat El Afareet
 * Secondary Weapon 3: بخور طرد الشياطين (Holy Incense Smoke)
 * Max 5 Levels
 */

import { BaseWeapon } from './baseWeapon.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { particleSystem } from '../systems/particleSystem.js';
import { damageSystem } from '../systems/damageSystem.js';

export class SpiritSmoke extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'spiritSmoke',
            name: 'بخور طرد الشياطين',
            description: 'سحابة بخور عطرية حارقة حول البطل تذيب وتبعد العفاريت وتسممها.',
            icon: '🪔',
            damage: 20,
            cooldown: 1.4,
            range: 160,
            critChance: 0.08,
            damageType: DAMAGE_TYPES.POISON
        });
        this.isPrimary = false;
        this.isSecondary = true;
        this.isEvolved = false;
        this.smokeRadius = 135;
    }

    applyLevelStats(level) {
        if (level === 2) {
            // Level 2: شغل معلمين
            this.damage = 30;
            this.smokeRadius = 160;
        } else if (level === 3) {
            // Level 3: سحر الفراعنة
            this.damage = 45;
            this.cooldown = 1.2;
            this.smokeRadius = 190;
        } else if (level === 4) {
            // Level 4: بركة الأوليا
            this.damage = 68;
            this.smokeRadius = 225;
            this.critChance = 0.20;
        } else if (level >= 5) {
            // Level 5: أسطورة الحارة (Max)
            this.isEvolved = true;
            this.name = 'سحابة البخور الملكية (أسطورة الحارة)';
            this.icon = '🟣🪔';
            this.damage = 110;
            this.smokeRadius = 270;
            this.cooldown = 0.75;
            this.critChance = 0.32;
        }
    }

    fire(enemies, projectiles) {
        if (!enemies) return;

        particleSystem.emit({
            x: this.player.x + (Math.random() * 40 - 20),
            y: this.player.y + (Math.random() * 40 - 20),
            color: this.isEvolved ? '#a855f7' : '#94a3b8',
            size: this.smokeRadius * 0.8,
            life: 0.6,
            shape: 'circle',
            alpha: 0.35
        });

        const radiusSq = this.smokeRadius * this.smokeRadius;
        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if (!e || !e.alive) continue;
            const dx = e.x - this.player.x;
            const dy = e.y - this.player.y;
            if (dx * dx + dy * dy <= radiusSq) {
                const dmgResult = damageSystem.calculateDamage(this.damage, this.player, e, this.damageType);
                e.takeDamage(dmgResult.damage, this.player, true);
                damageSystem.spawnText(e.x, e.y, dmgResult.damage, dmgResult.isCrit, this.isEvolved ? '#a855f7' : '#10b981');
                if (e.speed) {
                    e.speed = Math.max(25, e.speed * (this.isEvolved ? 0.55 : 0.75));
                }
            }
        }
    }
}
