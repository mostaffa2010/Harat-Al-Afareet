/**
 * حارة العفاريت — Harat El Afareet
 * Weapon: Magical Talisman (تمائم الحماية / حجاب عين حورس)
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';

export class MagicalTalisman extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'magicalTalisman',
            name: 'تمائم الحماية (حجاب عين حورس)',
            description: 'تمائم بتلف وتدور حواليك زي الخلاط تفرم أي عفريت يقرب منك.',
            icon: '🧿',
            damage: 22,
            cooldown: 0.1,
            projectileCount: 2,
            damageType: DAMAGE_TYPES.ARCANE
        });
        this.orbitRadius = 80;
        this.orbitSpeed = 3.5;
        this.activeTalismans = [];
    }

    applyLevelStats(level) {
        switch (level) {
            case 2:
                this.projectileCount += 1;
                break;
            case 3:
                this.damage += 8;
                this.orbitSpeed += 0.6;
                break;
            case 4:
                this.orbitRadius += 15;
                this.projectileCount += 1;
                break;
            case 5:
                this.damage += 12;
                break;
            case 6:
                this.projectileCount += 1;
                this.orbitSpeed += 0.8;
                break;
            case 7:
                this.damage += 16;
                this.orbitRadius += 15;
                break;
            case 8:
                this.projectileCount += 1;
                this.damage += 25;
                this.orbitSpeed += 1.0;
                break;
        }
    }

    update(dt, enemies, projectiles) {
        this.syncTalismans(projectiles);
    }

    syncTalismans(projectiles) {
        this.activeTalismans = this.activeTalismans.filter(p => p.alive && projectiles.includes(p));

        const targetCount = this.projectileCount;
        if (this.activeTalismans.length !== targetCount) {
            for (let i = 0; i < this.activeTalismans.length; i++) {
                this.activeTalismans[i].alive = false;
            }
            this.activeTalismans = [];

            const angleStep = (Math.PI * 2) / targetCount;
            for (let i = 0; i < targetCount; i++) {
                const tal = new Projectile({
                    x: this.player.x,
                    y: this.player.y,
                    damage: this.damage,
                    damageType: this.damageType,
                    radius: 13,
                    weaponId: this.id,
                    spriteKey: 'magicalTalismanShield',
                    isOrbiting: true,
                    orbitRadius: this.orbitRadius * (this.player.areaMultiplier || 1.0),
                    orbitSpeed: this.orbitSpeed,
                    orbitAngle: i * angleStep
                });
                this.activeTalismans.push(tal);
                projectiles.push(tal);
            }
        } else {
            for (let i = 0; i < this.activeTalismans.length; i++) {
                const tal = this.activeTalismans[i];
                tal.damage = this.damage;
                tal.orbitRadius = this.orbitRadius * (this.player.areaMultiplier || 1.0);
                tal.orbitSpeed = this.orbitSpeed;
            }
        }
    }
}
