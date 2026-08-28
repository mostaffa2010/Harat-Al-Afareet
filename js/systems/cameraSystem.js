/**
 * حارة العفاريت — Harat El Afareet
 * Smooth Following Camera System with Screen Shake
 */

import { WORLD_CONFIG } from '../data/constants.js';

export class CameraSystem {
    constructor() {
        this.x = WORLD_CONFIG.MAP_WIDTH / 2;
        this.y = WORLD_CONFIG.MAP_HEIGHT / 2;
        this.targetX = this.x;
        this.targetY = this.y;
        this.viewportWidth = 800;
        this.viewportHeight = 600;
        this.lerpSpeed = 8.0; // Higher = faster follow

        // Screen Shake
        this.shakeIntensity = 0;
        this.shakeDecay = 12.0; // Rapid decay
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
    }

    setViewport(width, height) {
        this.viewportWidth = width;
        this.viewportHeight = height;
    }

    follow(targetX, targetY) {
        this.targetX = targetX;
        this.targetY = targetY;
    }

    triggerShake(intensity = 8) {
        this.shakeIntensity = Math.min(25, this.shakeIntensity + intensity);
    }

    update(dt) {
        // Smooth lerp towards target
        this.x += (this.targetX - this.x) * Math.min(1.0, this.lerpSpeed * dt);
        this.y += (this.targetY - this.y) * Math.min(1.0, this.lerpSpeed * dt);

        // Clamp camera within map bounds
        const halfW = this.viewportWidth / 2;
        const halfH = this.viewportHeight / 2;

        this.x = Math.max(halfW, Math.min(WORLD_CONFIG.MAP_WIDTH - halfW, this.x));
        this.y = Math.max(halfH, Math.min(WORLD_CONFIG.MAP_HEIGHT - halfH, this.y));

        // Screen shake decay and offset calculation
        if (this.shakeIntensity > 0.05) {
            this.shakeOffsetX = (Math.random() * 2 - 1) * this.shakeIntensity;
            this.shakeOffsetY = (Math.random() * 2 - 1) * this.shakeIntensity;
            this.shakeIntensity = Math.max(0, this.shakeIntensity - this.shakeDecay * dt);
        } else {
            this.shakeIntensity = 0;
            this.shakeOffsetX = 0;
            this.shakeOffsetY = 0;
        }
    }

    /**
     * Convert world coords to screen coords
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x + this.viewportWidth / 2 + this.shakeOffsetX,
            y: worldY - this.y + this.viewportHeight / 2 + this.shakeOffsetY
        };
    }

    /**
     * Check if a bounding box or circle in world coordinates is visible in the viewport
     */
    isVisible(worldX, worldY, radius = 64) {
        const screen = this.worldToScreen(worldX, worldY);
        return (
            screen.x + radius >= 0 &&
            screen.x - radius <= this.viewportWidth &&
            screen.y + radius >= 0 &&
            screen.y - radius <= this.viewportHeight
        );
    }
}

export const cameraSystem = new CameraSystem();
