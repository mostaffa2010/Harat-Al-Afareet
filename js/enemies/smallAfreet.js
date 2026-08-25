/**
 * حارة العفاريت — Harat El Afareet
 * Enemy: Small Afreet (عفريت الشعلة / Shadow Wisp)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';

export class SmallAfreet extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 14,
            enemyType: 'smallAfreet',
            enemyName: 'عفريت الشعلة',
            hp: Math.round(22 * difficultyMultiplier),
            speed: 125 + Math.random() * 20,
            damage: Math.round(8 * difficultyMultiplier),
            xpValue: 5,
            coinDropChance: 0.12,
            coinValue: 5,
            attackCooldown: 0.8
        });
    }
}
