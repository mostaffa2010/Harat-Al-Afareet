/**
 * حارة العفاريت — Harat El Afareet
 * Enemy Registry
 */

import { SmallAfreet } from './smallAfreet.js';
import { FastAfreet } from './fastAfreet.js';
import { RangedAfreet } from './rangedAfreet.js';
import { GiantAfreet } from './giantAfreet.js';

export class EnemyRegistry {
    constructor() {
        this.enemies = new Map();
        this.register('smallAfreet', SmallAfreet);
        this.register('fastAfreet', FastAfreet);
        this.register('rangedAfreet', RangedAfreet);
        this.register('giantAfreet', GiantAfreet);
    }

    register(id, enemyClass) {
        this.enemies.set(id, enemyClass);
    }

    create(id, x, y, difficultyMultiplier = 1.0) {
        const EnemyClass = this.enemies.get(id);
        if (EnemyClass) {
            return new EnemyClass(x, y, difficultyMultiplier);
        }
        return new SmallAfreet(x, y, difficultyMultiplier);
    }
}

export const enemyRegistry = new EnemyRegistry();
