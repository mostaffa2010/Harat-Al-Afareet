/**
 * حارة العفاريت — Harat El Afareet
 * Procedural Web Audio API Sound Synthesizer (Bullet-Proof & Zero-Crash)
 */

export class AudioSystem {
    constructor() {
        this.ctx = null;
        this.soundEnabled = true;
        this.masterVolume = 0.8;
        this.sfxVolume = 0.9;
        this.initialized = false;
    }

    init() {
        if (this.initialized && this.ctx) return;
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                this.initialized = true;
            }
        } catch (e) {
            console.warn('Web Audio API not supported or blocked:', e);
        }
    }

    resume() {
        try {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        } catch (e) {}
    }

    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }

    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    // Safe execution helper
    safePlay(soundFn) {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            this.resume();
            soundFn(this.ctx, this.ctx.currentTime, this.sfxVolume * this.masterVolume);
        } catch (e) {
            // Audio glitch shouldn't ever interrupt the game loop
        }
    }

    // ==========================================
    // SOUND EFFECTS
    // ==========================================

    playMagicBolt() {
        this.playCast();
    }

    playCast() {
        this.safePlay((ctx, now, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(480, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

            gain.gain.setValueAtTime(0.2 * vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.15);
        });
    }

    playFireball() {
        this.safePlay((ctx, now, vol) => {
            const bufferSize = Math.max(256, Math.floor(ctx.sampleRate * 0.18));
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(850, now);
            filter.frequency.exponentialRampToValueAtTime(140, now + 0.18);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.32 * vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(now);
            noise.stop(now + 0.18);
        });
    }

    playLightning() {
        this.safePlay((ctx, now, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1100, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

            gain.gain.setValueAtTime(0.28 * vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.22);
        });
    }

    playTalismanHit() {
        this.safePlay((ctx, now, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1050, now);
            osc.frequency.exponentialRampToValueAtTime(520, now + 0.16);

            gain.gain.setValueAtTime(0.24 * vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.16);
        });
    }

    playHit() {
        this.safePlay((ctx, now, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

            gain.gain.setValueAtTime(0.2 * vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
        });
    }

    playEnemyDeath() {
        this.safePlay((ctx, now, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

            gain.gain.setValueAtTime(0.18 * vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.15);
        });
    }

    playPickupXp() {
        this.safePlay((ctx, now, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const notes = [659.25, 783.99, 987.77, 1318.51];
            const note = notes[Math.floor(Math.random() * notes.length)];

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note, now);
            osc.frequency.exponentialRampToValueAtTime(note * 1.25, now + 0.08);

            gain.gain.setValueAtTime(0.18 * vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.09);
        });
    }

    playPickupCoin() {
        this.safePlay((ctx, now, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1480, now);
            osc.frequency.setValueAtTime(1960, now + 0.05);

            gain.gain.setValueAtTime(0.24 * vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.14);
        });
    }

    playLevelUp() {
        this.safePlay((ctx, now, vol) => {
            const notes = [440, 554.37, 659.25, 880];
            notes.forEach((freq, index) => {
                const noteTime = now + index * 0.08;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0.28 * vol, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.32);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.32);
            });
        });
    }

    playBossRoar() {
        this.safePlay((ctx, now, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(70, now);
            osc.frequency.linearRampToValueAtTime(120, now + 0.28);
            osc.frequency.exponentialRampToValueAtTime(35, now + 0.85);

            gain.gain.setValueAtTime(0.38 * vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.85);
        });
    }

    playDash() {
        this.safePlay((ctx, now, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(580, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.16);

            gain.gain.setValueAtTime(0.22 * vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.16);
        });
    }

    playClick() {
        this.safePlay((ctx, now, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);

            gain.gain.setValueAtTime(0.15 * vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.04);
        });
    }
}

export const audioSystem = new AudioSystem();
