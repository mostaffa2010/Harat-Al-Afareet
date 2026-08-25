/**
 * حارة العفاريت — Harat El Afareet
 * High-Performance Game Loop with Capped Delta Time
 */

export class GameLoop {
    constructor(updateFn, renderFn) {
        this.updateFn = updateFn;
        this.renderFn = renderFn;
        this.lastTime = 0;
        this.isRunning = false;
        this.animationFrameId = null;
        this.maxDeltaTime = 0.1; // 100ms cap to avoid spiral of death
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop = this.loop.bind(this);
        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    loop(currentTime) {
        if (!this.isRunning) return;

        let dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Cap dt to prevent huge jumps if tab was backgrounded
        if (dt > this.maxDeltaTime) {
            dt = this.maxDeltaTime;
        }

        // Call update and render
        this.updateFn(dt);
        this.renderFn();

        this.animationFrameId = requestAnimationFrame(this.loop);
    }
}
