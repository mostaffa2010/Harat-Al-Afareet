/**
 * حارة العفاريت — Harat El Afareet
 * High-Performance Particle Engine (Vertical Lightning, Radial Grace Pulses & Spells)
 */

export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 600;
    }

    reset() {
        this.particles = [];
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
        this.emit({
            x, y,
            vx: 0, vy: 0,
            color,
            size: 8,
            life: 0.35,
            shape: 'ring',
            lineWidth: 3
        });

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

    emitLightningStrike(x, y, color = '#38bdf8') {
        // Vertical lightning beam straight down from sky with zero screen shake
        for (let i = 0; i < 12; i++) {
            const py = y - 450 + (i * 38);
            this.emit({
                x: x + (Math.random() * 6 - 3),
                y: py,
                vx: (Math.random() * 2 - 1) * 8,
                vy: 25,
                color: (i % 2 === 0) ? '#ffffff' : color,
                size: 4 + Math.random() * 4,
                life: 0.18,
                drag: 0.95
            });
        }

        // Ground electrical impact
        this.emit({
            x, y,
            vx: 0, vy: 0,
            color,
            size: 18,
            life: 0.25,
            shape: 'ring',
            lineWidth: 4
        });
        this.emitHitSparks(x, y, color, 14);
    }

    emitLevelUpPulse(x, y) {
        this.emit({
            x, y,
            vx: 0, vy: 0,
            color: '#fbbf24',
            size: 25,
            life: 0.5,
            shape: 'ring',
            lineWidth: 6
        });
        this.emit({
            x, y,
            vx: 0, vy: 0,
            color: '#38bdf8',
            size: 15,
            life: 0.4,
            shape: 'ring',
            lineWidth: 4
        });
    }

    emitShockwave(x, y, radius = 60, color = '#f59e0b') {
        this.emit({
            x, y,
            vx: 0, vy: 0,
            color,
            size: radius * 0.4,
            life: 0.35,
            shape: 'ring',
            lineWidth: 4
        });
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
                p.size += 75 * dt; // Expanding ring
            }
        }
    }

    clear() {
        this.particles.length = 0;
    }
}

export const particleSystem = new ParticleSystem();
