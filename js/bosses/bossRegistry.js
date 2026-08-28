/**
 * حارة العفاريت — Harat El Afareet
 * Boss & Mini-Boss Registry
 */

import { AfreetKing } from './afreetKing.js';
import { RockBruteBoss } from './rockBruteBoss.js';
import { NecroShamanBoss } from './necroShamanBoss.js';
import { InfernalBruteBoss } from './infernalBruteBoss.js';

export class BossRegistry {
    constructor() {
        this.bosses = new Map();
        this.register('afreetKing', AfreetKing);
        this.register('rockBruteBoss', RockBruteBoss);
        this.register('necroShamanBoss', NecroShamanBoss);
        this.register('infernalBruteBoss', InfernalBruteBoss);
    }

    register(id, bossClass) {
        this.bosses.set(id, bossClass);
    }

    create(id, x, y, difficultyMultiplier = 1.0) {
        const BossClass = this.bosses.get(id);
        if (BossClass) {
            return new BossClass(x, y, difficultyMultiplier);
        }
        return new AfreetKing(x, y, difficultyMultiplier);
    }
}

export const bossRegistry = new BossRegistry();
