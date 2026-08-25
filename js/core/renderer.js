/**
 * حارة العفاريت — Harat El Afareet
 * Canvas 2D Renderer & Atmospheric Lighting Engine
 */

import { WORLD_CONFIG } from '../data/constants.js';
import { cameraSystem } from '../systems/cameraSystem.js';
import { assetManager } from './assetManager.js';
import { inputSystem } from '../systems/inputSystem.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false });
        this.ctx.imageSmoothingEnabled = false;

        this.width = canvas.width;
        this.height = canvas.height;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.imageSmoothingEnabled = false;
        cameraSystem.setViewport(width, height);
    }

    render(gameState) {
        const { player, enemies, boss, projectiles, pickups, particles, damageNumbers, warnings } = gameState;

        // Clear canvas
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 1. Render Environment & Ground Tiles
        this.renderEnvironment();

        // 2. Render Boss Warning Indicators / Telegraphs
        if (warnings && warnings.length > 0) {
            this.renderWarningTelegraphs(warnings);
        }

        // 3. Render Pickups (XP gems, Coins, Elixirs)
        this.renderPickups(pickups);

        // 4. Depth-Sorted Entity Rendering (Y-Sorting)
        const renderableEntities = [];

        if (player && player.alive) {
            renderableEntities.push({ type: 'player', entity: player, y: player.y });
        }

        if (enemies) {
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i];
                if (enemy.alive && cameraSystem.isVisible(enemy.x, enemy.y, enemy.radius + 32)) {
                    renderableEntities.push({ type: 'enemy', entity: enemy, y: enemy.y });
                }
            }
        }

        if (boss && boss.alive && cameraSystem.isVisible(boss.x, boss.y, boss.radius + 64)) {
            renderableEntities.push({ type: 'boss', entity: boss, y: boss.y });
        }

        renderableEntities.sort((a, b) => a.y - b.y);

        for (let i = 0; i < renderableEntities.length; i++) {
            const item = renderableEntities[i];
            if (item.type === 'player') {
                this.renderPlayer(item.entity);
            } else if (item.type === 'enemy') {
                this.renderEnemy(item.entity);
            } else if (item.type === 'boss') {
                this.renderBoss(item.entity);
            }
        }

        // 5. Render Projectiles & Weapon Visuals
        this.renderProjectiles(projectiles);

        // 6. Render Particle Effects
        if (particles) {
            this.renderParticles(particles);
        }

        // 7. Render Floating Damage Numbers
        if (damageNumbers) {
            this.renderDamageNumbers(damageNumbers);
        }

        // 8. Render Atmospheric Night Lighting & Glows
        this.renderAtmosphericLighting(player, enemies, boss, pickups);

        // 9. Render Virtual Touch Joystick (if active)
        this.renderVirtualJoystick();
    }

    renderEnvironment() {
        const cobbleTile = assetManager.tiles['ground_cobble'];
        if (!cobbleTile) return;

        const tileSize = 64;
        const startCol = Math.max(0, Math.floor((cameraSystem.x - this.width / 2) / tileSize));
        const endCol = Math.min(WORLD_CONFIG.MAP_WIDTH / tileSize, Math.ceil((cameraSystem.x + this.width / 2) / tileSize));
        const startRow = Math.max(0, Math.floor((cameraSystem.y - this.height / 2) / tileSize));
        const endRow = Math.min(WORLD_CONFIG.MAP_HEIGHT / tileSize, Math.ceil((cameraSystem.y + this.height / 2) / tileSize));

        for (let r = startRow; r < endRow; r++) {
            for (let c = startCol; c < endCol; c++) {
                const worldX = c * tileSize;
                const worldY = r * tileSize;
                const screen = cameraSystem.worldToScreen(worldX, worldY);

                if ((r % 7 === 0 && c % 7 === 0) || (r === 20 && c === 20)) {
                    this.ctx.drawImage(assetManager.tiles['ground_rune'], screen.x, screen.y);
                } else {
                    this.ctx.drawImage(cobbleTile, screen.x, screen.y);
                }
            }
        }

        this.renderMapBorders();
    }

    renderMapBorders() {
        const topLeft = cameraSystem.worldToScreen(0, 0);
        const bottomRight = cameraSystem.worldToScreen(WORLD_CONFIG.MAP_WIDTH, WORLD_CONFIG.MAP_HEIGHT);

        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    }

    renderPickups(pickups) {
        if (!pickups) return;
        const now = performance.now() * 0.004;

        for (let i = 0; i < pickups.length; i++) {
            const p = pickups[i];
            if (!p.alive || !cameraSystem.isVisible(p.x, p.y, 24)) continue;

            const screen = cameraSystem.worldToScreen(p.x, p.y);
            const sprite = assetManager.sprites.pickups[p.type];
            const floatOffset = Math.sin(now + p.x) * 3;

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.beginPath();
            this.ctx.ellipse(screen.x, screen.y + 8, 8, 4, 0, 0, Math.PI * 2);
            this.ctx.fill();

            if (sprite) {
                this.ctx.drawImage(
                    sprite,
                    screen.x - sprite.width / 2,
                    screen.y - sprite.height / 2 + floatOffset
                );
            }
        }
    }

    renderPlayer(player) {
        const screen = cameraSystem.worldToScreen(player.x, player.y);

        // Player Drop Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        this.ctx.beginPath();
        this.ctx.ellipse(screen.x, screen.y + 14, 18, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Casting Flare Aura on Attack
        if (player.castAnimationTimer > 0) {
            this.ctx.save();
            this.ctx.strokeStyle = player.themePrimary;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, 26, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.fillStyle = player.themePrimary + '22';
            this.ctx.fill();
            this.ctx.restore();
        }

        // Protective Shield Effect
        if (player.shieldHp > 0) {
            this.ctx.save();
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, 30, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
            this.ctx.fill();
            this.ctx.restore();
        }

        // Invulnerability Blink Flash
        if (player.isInvulnerable && !player.isDashing) {
            if (Math.floor(performance.now() * 0.02) % 2 === 0) {
                this.ctx.save();
                this.ctx.strokeStyle = '#fbbf24';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(screen.x, screen.y, 24, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }

        // Magnet Aura indicator on dash
        if (player.isDashing) {
            this.ctx.save();
            this.ctx.strokeStyle = player.themePrimary || '#06b6d4';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, 24, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();
        }

        // Determine Sprite Animation Frame
        let animName = 'idle';
        if (player.hurtTimer > 0) {
            animName = 'hurt';
        } else if (player.castAnimationTimer > 0) {
            animName = 'attack';
        } else if (player.isMoving) {
            animName = (Math.floor(performance.now() * 0.008) % 2 === 0) ? 'walk1' : 'walk2';
        }

        const sprite = assetManager.get('characters', player.characterId, animName);
        if (sprite) {
            this.ctx.save();
            if (player.facingDirection === -1) {
                this.ctx.translate(screen.x, screen.y);
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
            } else {
                this.ctx.drawImage(sprite, screen.x - sprite.width / 2, screen.y - sprite.height / 2);
            }
            this.ctx.restore();
        }
    }

    renderEnemy(enemy) {
        const screen = cameraSystem.worldToScreen(enemy.x, enemy.y);

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.beginPath();
        this.ctx.ellipse(screen.x, screen.y + enemy.radius * 0.75, enemy.radius * 0.8, enemy.radius * 0.4, 0, 0, Math.PI * 2);
        this.ctx.fill();

        if (enemy.burnTimer > 0) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, enemy.radius + 6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        let animName = 'idle';
        if (enemy.hurtTimer > 0) {
            animName = 'hurt';
        } else {
            animName = (Math.floor(performance.now() * 0.007 + enemy.id * 10) % 2 === 0) ? 'walk1' : 'walk2';
        }

        const sprite = assetManager.get('enemies', enemy.enemyType, animName);
        if (sprite) {
            this.ctx.save();
            if (enemy.facingDirection === -1) {
                this.ctx.translate(screen.x, screen.y);
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
            } else {
                this.ctx.drawImage(sprite, screen.x - sprite.width / 2, screen.y - sprite.height / 2);
            }
            this.ctx.restore();
        }

        if (enemy.hp < enemy.maxHp) {
            const barW = Math.max(24, enemy.radius * 1.6);
            const barH = 4;
            const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);

            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            this.ctx.fillRect(screen.x - barW / 2, screen.y - enemy.radius - 8, barW, barH);
            this.ctx.fillStyle = '#ef4444';
            this.ctx.fillRect(screen.x - barW / 2, screen.y - enemy.radius - 8, barW * hpRatio, barH);
        }
    }

    renderBoss(boss) {
        const screen = cameraSystem.worldToScreen(boss.x, boss.y);

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.beginPath();
        this.ctx.ellipse(screen.x, screen.y + boss.radius * 0.8, boss.radius * 1.1, boss.radius * 0.5, 0, 0, Math.PI * 2);
        this.ctx.fill();

        if (boss.isEnraged) {
            this.ctx.save();
            this.ctx.strokeStyle = '#dc2626';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, boss.radius + 14, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();
        }

        let animName = 'idle';
        if (boss.hurtTimer > 0) {
            animName = 'hurt';
        } else {
            animName = (Math.floor(performance.now() * 0.005) % 2 === 0) ? 'walk1' : 'walk2';
        }

        const sprite = assetManager.get('bosses', boss.bossId, animName);
        if (sprite) {
            this.ctx.save();
            if (boss.facingDirection === -1) {
                this.ctx.translate(screen.x, screen.y);
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
            } else {
                this.ctx.drawImage(sprite, screen.x - sprite.width / 2, screen.y - sprite.height / 2);
            }
            this.ctx.restore();
        }
    }

    renderWarningTelegraphs(warnings) {
        for (let i = 0; i < warnings.length; i++) {
            const w = warnings[i];
            if (!cameraSystem.isVisible(w.x, w.y, w.radius)) continue;

            const screen = cameraSystem.worldToScreen(w.x, w.y);
            const progress = Math.min(1.0, (w.duration - w.timeLeft) / w.duration);

            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, w.radius, 0, Math.PI * 2);
            this.ctx.stroke();

            this.ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, w.radius * progress, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    renderProjectiles(projectiles) {
        if (!projectiles) return;

        for (let i = 0; i < projectiles.length; i++) {
            const p = projectiles[i];
            if (!p.alive || !cameraSystem.isVisible(p.x, p.y, p.radius + 16)) continue;

            const screen = cameraSystem.worldToScreen(p.x, p.y);
            const sprite = assetManager.sprites.projectiles[p.spriteKey || p.weaponId];

            if (sprite) {
                this.ctx.save();
                this.ctx.translate(screen.x, screen.y);
                if (p.rotation !== undefined) {
                    this.ctx.rotate(p.rotation);
                }
                this.ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
                this.ctx.restore();
            } else {
                this.ctx.save();
                this.ctx.fillStyle = p.color || '#06b6d4';
                this.ctx.beginPath();
                this.ctx.arc(screen.x, screen.y, p.radius || 6, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        }
    }

    renderParticles(particles) {
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (!p.alive || !cameraSystem.isVisible(p.x, p.y, p.size + 4)) continue;

            const screen = cameraSystem.worldToScreen(p.x, p.y);
            const alpha = Math.max(0, p.life / p.maxLife);

            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = p.color;

            if (p.shape === 'ring') {
                this.ctx.strokeStyle = p.color;
                this.ctx.lineWidth = p.lineWidth || 2;
                this.ctx.beginPath();
                this.ctx.arc(screen.x, screen.y, p.size, 0, Math.PI * 2);
                this.ctx.stroke();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(screen.x, screen.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }
    }

    renderDamageNumbers(numbers) {
        this.ctx.save();
        this.ctx.font = 'bold 16px "Cairo", "Tajawal", monospace, sans-serif';
        this.ctx.textAlign = 'center';

        for (let i = 0; i < numbers.length; i++) {
            const dn = numbers[i];
            if (!dn.alive || !cameraSystem.isVisible(dn.x, dn.y, 40)) continue;

            const screen = cameraSystem.worldToScreen(dn.x, dn.y);
            const alpha = Math.max(0, dn.life / dn.maxLife);

            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = '#000000';
            this.ctx.fillText(dn.text, screen.x + 1, screen.y + 1);

            this.ctx.fillStyle = dn.isCrit ? '#fbbf24' : dn.color || '#ffffff';
            this.ctx.fillText(dn.text, screen.x, screen.y);
        }
        this.ctx.restore();
    }

    renderAtmosphericLighting(player, enemies, boss, pickups) {
        if (!player || !player.alive) return;
        const pScreen = cameraSystem.worldToScreen(player.x, player.y);

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'destination-out';

        const lightGrad = this.ctx.createRadialGradient(
            pScreen.x, pScreen.y, 50,
            pScreen.x, pScreen.y, 300
        );
        lightGrad.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
        lightGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.45)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = lightGrad;
        this.ctx.beginPath();
        this.ctx.arc(pScreen.x, pScreen.y, 300, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    renderVirtualJoystick() {
        if (!inputSystem.touchActive) return;

        const origin = inputSystem.touchOrigin;
        const current = inputSystem.touchCurrent;

        this.ctx.save();
        this.ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.arc(origin.x, origin.y, inputSystem.maxRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        const stickGrad = this.ctx.createRadialGradient(current.x, current.y, 2, current.x, current.y, 24);
        stickGrad.addColorStop(0, '#fbbf24');
        stickGrad.addColorStop(1, '#d97706');
        this.ctx.fillStyle = stickGrad;
        this.ctx.beginPath();
        this.ctx.arc(current.x, current.y, 22, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }
}
