/**
 * حارة العفاريت — Harat El Afareet
 * Weapon Registry (3 Dedicated Primaries + 5 Universal Secondaries)
 */

import { MagicStaff } from './magicStaff.js';
import { FireWand } from './fireWand.js';
import { MagicalTalisman } from './magicalTalisman.js';
import { LightningRod } from './lightningRod.js';
import { FlyingClog } from './flyingClog.js';
import { AcidFlask } from './acidFlask.js';
import { HunterShotgun } from './hunterShotgun.js';
import { SpiritSmoke } from './spiritSmoke.js';

export class WeaponRegistry {
    constructor() {
        this.weapons = new Map();
        
        // 3 Dedicated Primaries
        this.register('magicStaff', MagicStaff);
        this.register('fireWand', FireWand);
        this.register('magicalTalisman', MagicalTalisman);

        // 5 Universal Secondaries
        this.register('lightningRod', LightningRod);
        this.register('flyingClog', FlyingClog);
        this.register('acidFlask', AcidFlask);
        this.register('hunterShotgun', HunterShotgun);
        this.register('spiritSmoke', SpiritSmoke);
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

    getSecondaryWeaponIds() {
        return ['lightningRod', 'flyingClog', 'acidFlask', 'hunterShotgun', 'spiritSmoke'];
    }

    getPrimaryWeaponIds() {
        return ['magicStaff', 'fireWand', 'magicalTalisman'];
    }
}

export const weaponRegistry = new WeaponRegistry();
