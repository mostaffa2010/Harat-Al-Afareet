/**
 * حارة العفاريت — Harat El Afareet
 * Smooth Following Camera System (Zero Shake)
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
        this.lerpSpeed = 8.0;

        // Screen Shake permanently disabled for smooth, stable gameplay
        this.shakeIntensity = 0;
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

    reset(targetX, targetY) {
        this.x = targetX !== undefined ? targetX : WORLD_CONFIG.MAP_WIDTH / 2;
        this.y = targetY !== undefined ? targetY : WORLD_CONFIG.MAP_HEIGHT / 2;
        this.targetX = this.x;
        this.targetY = this.y;
        this.shakeIntensity = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
    }

    triggerShake(intensity = 0) {
        // Permanently disabled per design request
        this.shakeIntensity = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
    }

    update(targetXOrDt, targetY, dt) {
        let actualDt = dt;
        if (targetY !== undefined && dt !== undefined) {
            this.targetX = targetXOrDt;
            this.targetY = targetY;
            actualDt = dt;
        } else {
            actualDt = targetXOrDt;
        }
        actualDt = actualDt || 0.016;

        this.x += (this.targetX - this.x) * Math.min(1.0, this.lerpSpeed * actualDt);
        this.y += (this.targetY - this.y) * Math.min(1.0, this.lerpSpeed * actualDt);

        const halfW = this.viewportWidth / 2;
        const halfH = this.viewportHeight / 2;

        this.x = Math.max(halfW, Math.min(WORLD_CONFIG.MAP_WIDTH - halfW, this.x));
        this.y = Math.max(halfH, Math.min(WORLD_CONFIG.MAP_HEIGHT - halfH, this.y));

        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
    }

    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x + this.viewportWidth / 2,
            y: worldY - this.y + this.viewportHeight / 2
        };
    }

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
