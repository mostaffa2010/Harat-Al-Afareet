/**
 * حارة العفاريت — Harat El Afareet
 * Character Registry
 */

import { apprentice } from './apprentice.js';
import { fireMage } from './fireMage.js';
import { amuletKeeper } from './amuletKeeper.js';

export class CharacterRegistry {
    constructor() {
        this.characters = new Map();
        this.register(apprentice);
        this.register(fireMage);
        this.register(amuletKeeper);
    }

    register(characterConfig) {
        this.characters.set(characterConfig.id, characterConfig);
    }

    get(characterId) {
        return this.characters.get(characterId) || this.characters.get('apprentice');
    }

    getAll() {
        return Array.from(this.characters.values());
    }
}

export const characterRegistry = new CharacterRegistry();
