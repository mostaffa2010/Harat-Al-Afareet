/**
 * حارة العفاريت — Harat El Afareet
 * Pickup Entity (XP Gems, Coins, Elixirs, Magnets)
 */

import { PICKUP_TYPES } from '../data/constants.js';

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
        this.attractSpeed = 120;
        this.maxAttractSpeed = 650;
        this.acceleration = 900;
    }

    update(dt, player) {
        if (!this.alive || !player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Check if within player pickup/magnet range
        if (!this.isAttracted && dist <= player.pickupRadius) {
            this.isAttracted = true;
        }

        // If attracted, fly toward player
        if (this.isAttracted) {
            this.attractSpeed = Math.min(this.maxAttractSpeed, this.attractSpeed + this.acceleration * dt);
            if (dist > 0.1) {
                this.x += (dx / dist) * this.attractSpeed * dt;
                this.y += (dy / dist) * this.attractSpeed * dt;
            }

            // Collection check
            if (dist <= player.radius + this.radius) {
                this.collect(player);
            }
        }
    }

    collect(player) {
        this.alive = false;
        // Effect applied in xpSystem or game engine on collect
    }
}
