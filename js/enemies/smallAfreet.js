/**
 * حارة العفاريت — Harat El Afareet
 * Enemy: Small Afreet (عفريت الشعلة)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';

export class SmallAfreet extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 14,
            enemyType: 'smallAfreet',
            enemyName: 'عفريت الشعلة',
            hp: Math.round(18 * difficultyMultiplier),
            speed: 120 + Math.random() * 20,
            damage: Math.round(5 * difficultyMultiplier), // Gentle early damage
            xpValue: 5,
            coinDropChance: 0.18,
            coinValue: 6,
            attackCooldown: 0.9
        });
    }
}
