/**
 * حارة العفاريت — Harat El Afareet
 * Touch Virtual Joystick & Keyboard Input System
 * (Fixed: Zero interference with HUD Buttons / Top Pause Area)
 */

export class InputSystem {
    constructor() {
        this.movementVector = { x: 0, y: 0 };
        this.isDashing = false;
        this.dashTriggered = false;
        this.pauseTriggered = false;

        // Virtual Joystick state
        this.touchActive = false;
        this.touchId = null;
        this.touchOrigin = { x: 0, y: 0 };
        this.touchCurrent = { x: 0, y: 0 };
        this.maxRadius = 65; // Max joystick radius in px

        // Keyboard state
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            space: false
        };

        this.initialized = false;
    }

    init(canvasElement) {
        if (this.initialized) return;
        this.canvas = canvasElement;

        // Bind keyboard listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Bind touch / pointer listeners on container
        this.bindTouchControls();

        this.initialized = true;
    }

    bindTouchControls() {
        const target = window;

        target.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        target.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        target.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        target.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: false });

        // Mouse drag fallback for desktop
        let mouseDown = false;
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                // If top UI area, ignore
                if (e.clientY < 75 || e.target.closest('#hud-btn-pause, .hud-btn, button, .interactive')) {
                    return;
                }
                mouseDown = true;
                this.touchActive = true;
                this.touchOrigin = { x: e.clientX, y: e.clientY };
                this.touchCurrent = { x: e.clientX, y: e.clientY };
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (mouseDown) {
                this.touchCurrent = { x: e.clientX, y: e.clientY };
                this.updateJoystickVector();
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (mouseDown) {
                mouseDown = false;
                this.touchActive = false;
                this.touchOrigin = { x: 0, y: 0 };
                this.touchCurrent = { x: 0, y: 0 };
                this.movementVector = { x: 0, y: 0 };
            }
        });
    }

    handleKeyDown(e) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.up = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.down = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = true;
                break;
            case 'Space':
                if (!this.keys.space) {
                    this.dashTriggered = true;
                }
                this.keys.space = true;
                break;
            case 'Escape':
            case 'KeyP':
                this.pauseTriggered = true;
                break;
        }
    }

    handleKeyUp(e) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.up = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.down = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = false;
                break;
            case 'Space':
                this.keys.space = false;
                break;
        }
    }

    handleTouchStart(e) {
        // Strictly ignore if touching interactive UI elements or the top HUD area (< 75px from top)
        if (e.target.closest('button, .hud-btn, #hud-btn-pause, .interactive, .upgrade-card, .menu-card, .modal-overlay')) {
            return;
        }

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];

            // If touch is in top bar area, do not start joystick
            if (touch.clientY < 75) {
                continue;
            }

            // Primary touch for movement joystick
            if (!this.touchActive) {
                this.touchActive = true;
                this.touchId = touch.identifier;
                this.touchOrigin = { x: touch.clientX, y: touch.clientY };
                this.touchCurrent = { x: touch.clientX, y: touch.clientY };
                this.movementVector = { x: 0, y: 0 };
                break;
            }
        }
    }

    handleTouchMove(e) {
        if (!this.touchActive) return;

        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            if (touch.identifier === this.touchId) {
                this.touchCurrent = { x: touch.clientX, y: touch.clientY };
                this.updateJoystickVector();
                break;
            }
        }
    }

    handleTouchEnd(e) {
        if (!this.touchActive) return;

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === this.touchId) {
                this.touchActive = false;
                this.touchId = null;
                this.touchOrigin = { x: 0, y: 0 };
                this.touchCurrent = { x: 0, y: 0 };
                this.movementVector = { x: 0, y: 0 };
                break;
            }
        }
    }

    updateJoystickVector() {
        const dx = this.touchCurrent.x - this.touchOrigin.x;
        const dy = this.touchCurrent.y - this.touchOrigin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 6) {
            this.movementVector = { x: 0, y: 0 };
            return;
        }

        const clampedDist = Math.min(dist, this.maxRadius);
        const normalized = clampedDist / this.maxRadius;

        this.movementVector = {
            x: (dx / dist) * normalized,
            y: (dy / dist) * normalized
        };
    }

    triggerDash() {
        this.dashTriggered = true;
    }

    getMovement() {
        let x = 0;
        let y = 0;

        if (this.keys.left) x -= 1;
        if (this.keys.right) x += 1;
        if (this.keys.up) y -= 1;
        if (this.keys.down) y += 1;

        if (x !== 0 || y !== 0) {
            const length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
            return { x, y };
        }

        if (this.touchActive) {
            return { x: this.movementVector.x, y: this.movementVector.y };
        }

        return { x: 0, y: 0 };
    }

    consumeDash() {
        const dash = this.dashTriggered;
        this.dashTriggered = false;
        return dash;
    }

    consumePause() {
        const pause = this.pauseTriggered;
        this.pauseTriggered = false;
        return pause;
    }

    reset() {
        this.movementVector = { x: 0, y: 0 };
        this.touchActive = false;
        this.touchId = null;
        this.dashTriggered = false;
        this.pauseTriggered = false;
        for (const k in this.keys) {
            this.keys[k] = false;
        }
    }
}

export const inputSystem = new InputSystem();
