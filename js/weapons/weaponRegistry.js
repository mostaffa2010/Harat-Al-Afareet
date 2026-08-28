/**
 * حارة العفاريت — Harat El Afareet
 * Weapon Registry
 */

import { MagicStaff } from './magicStaff.js';
import { FireWand } from './fireWand.js';
import { LightningRod } from './lightningRod.js';
import { MagicalTalisman } from './magicalTalisman.js';

export class WeaponRegistry {
    constructor() {
        this.weapons = new Map();
        this.register('magicStaff', MagicStaff);
        this.register('fireWand', FireWand);
        this.register('lightningRod', LightningRod);
        this.register('magicalTalisman', MagicalTalisman);
    }

    register(id, weaponClass) {
        this.weapons.set(id, weaponClass);
    }

    get(id) {
        return this.weapons.get(id) || null;
    }

    getAllIds() {
        return Array.from(this.weapons.keys());
    }
}

export const weaponRegistry = new WeaponRegistry();
