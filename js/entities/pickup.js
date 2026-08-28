/**
 * حارة العفاريت — Harat El Afareet
 * Pickup Entity (XP Gems, Coins, Elixirs, Magnets)
 */

import { PICKUP_TYPES } from '../data/constants.js';
import { xpSystem } from '../systems/xpSystem.js';

export class Pickup {
    constructor(x, y, type = PICKUP_TYPES.XP_SMALL, value = 5) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.value = value;
        this.radius = 12;
        this.alive = true;

        // Magnet attraction physics
        this.isAttracted = false;
        this.attractSpeed = 150;
        this.maxAttractSpeed = 800;
        this.acceleration = 1200;
    }

    update(dt, player, allPickups = null) {
        if (!this.alive || !player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Check if within player pickup range
        const pRadius = player.pickupRadius || 110;
        if (!this.isAttracted && dist <= pRadius) {
            this.isAttracted = true;
        }

        // If attracted, fly smoothly toward player
        if (this.isAttracted) {
            this.attractSpeed = Math.min(this.maxAttractSpeed, this.attractSpeed + this.acceleration * dt);
            if (dist > 0.1) {
                this.x += (dx / dist) * this.attractSpeed * dt;
                this.y += (dy / dist) * this.attractSpeed * dt;
            }

            // Direct Collection check
            if (dist <= (player.radius || 18) + this.radius + 8) {
                this.collect(player, allPickups);
            }
        }
    }

    collect(player, allPickups = null) {
        if (!this.alive) return;
        this.alive = false;
        xpSystem.handlePickupCollection(this, player, allPickups);
    }

    onCollect(player, allPickups = null) {
        this.collect(player, allPickups);
    }
}
