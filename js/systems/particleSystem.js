/**
 * حارة العفاريت — Harat El Afareet
 * High-Performance Particle Engine
 */

export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 600;
    }

    emit(config) {
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift(); // Drop oldest particle if pool is saturated
        }

        this.particles.push({
            x: config.x,
            y: config.y,
            vx: config.vx || (Math.random() * 2 - 1) * (config.speed || 50),
            vy: config.vy || (Math.random() * 2 - 1) * (config.speed || 50),
            color: config.color || '#f59e0b',
            size: config.size || 3,
            life: config.life || 0.4,
            maxLife: config.life || 0.4,
            shape: config.shape || 'circle',
            lineWidth: config.lineWidth || 2,
            drag: config.drag || 0.95,
            alive: true
        });
    }

    /**
     * Preset Particle Emitters
     */
    emitHitSparks(x, y, color = '#f59e0b', count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 60 + Math.random() * 140;
            this.emit({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                size: 2 + Math.random() * 3,
                life: 0.25 + Math.random() * 0.2,
                drag: 0.92
            });
        }
    }

    emitDeathExplosion(x, y, color = '#7e22ce', count = 18) {
        // Shockwave ring
        this.emit({
            x, y,
            vx: 0, vy: 0,
            color,
            size: 8,
            life: 0.35,
            shape: 'ring',
            lineWidth: 3
        });

        // Scatter particles
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 200;
            this.emit({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: (i % 2 === 0) ? color : '#fde047',
                size: 3 + Math.random() * 4,
                life: 0.35 + Math.random() * 0.3,
                drag: 0.9
            });
        }
    }

    emitFireExplosion(x, y, radius = 40) {
        // Shockwave ring
        this.emit({
            x, y,
            vx: 0, vy: 0,
            color: '#dc2626',
            size: radius * 0.5,
            life: 0.3,
            shape: 'ring',
            lineWidth: 4
        });

        const colors = ['#dc2626', '#f97316', '#fde047', '#ffffff'];
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 70 + Math.random() * 160;
            this.emit({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 3 + Math.random() * 4,
                life: 0.3 + Math.random() * 0.3,
                drag: 0.88
            });
        }
    }

    emitLevelUp(x, y) {
        // Grand radiant golden ring
        this.emit({
            x, y,
            vx: 0, vy: 0,
            color: '#f59e0b',
            size: 20,
            life: 0.6,
            shape: 'ring',
            lineWidth: 6
        });

        // Ascending celestial stars
        const colors = ['#06b6d4', '#f59e0b', '#fef08a', '#ffffff'];
        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 180;
            this.emit({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 60, // upward bias
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 3 + Math.random() * 4,
                life: 0.5 + Math.random() * 0.4,
                drag: 0.94
            });
        }
    }

    emitDashTrail(x, y, color = '#06b6d4') {
        for (let i = 0; i < 5; i++) {
            this.emit({
                x: x + (Math.random() * 16 - 8),
                y: y + (Math.random() * 16 - 8),
                vx: (Math.random() * 2 - 1) * 30,
                vy: (Math.random() * 2 - 1) * 30,
                color,
                size: 2 + Math.random() * 3,
                life: 0.2 + Math.random() * 0.15,
                drag: 0.9
            });
        }
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= p.drag;
            p.vy *= p.drag;

            if (p.shape === 'ring') {
                p.size += 70 * dt; // Expanding ring
            }
        }
    }

    clear() {
        this.particles.length = 0;
    }
}

export const particleSystem = new ParticleSystem();
