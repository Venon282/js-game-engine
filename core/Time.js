export class Time {
    constructor({
        fixed_delta = 1 / 60,
        max_delta = 0.25
    } = {}) {
        this.fixed_delta = fixed_delta
        this.max_delta = max_delta

        this.delta = 0
        this.elapsed = 0

        this._accumulator = 0
        this._last_timestamp = 0

        // FPS tracking
        this.fps = 0
        this._fps_frame_count = 0
        this._fps_time = 0
    }

    update(timestamp) {
        if (this._last_timestamp === 0) {
            this._last_timestamp = timestamp
            return
        }

        let delta = (timestamp - this._last_timestamp) / 1000
        this._last_timestamp = timestamp

        // Clamp delta to avoid spiral of death
        delta = Math.min(delta, this.max_delta)

        this.delta = delta
        this.elapsed += delta
        this._accumulator += delta

        this._updateFPS(delta)
    }

    /* ------------------------------------------------------------------ */
    /* Fixed timestep helpers                                              */
    /* ------------------------------------------------------------------ */

    shouldFixedUpdate() {
        return this._accumulator >= this.fixed_delta
    }

    consumeFixedStep() {
        this._accumulator -= this.fixed_delta
    }

    resetAccumulator() {
        this._accumulator = 0
    }

    /* ------------------------------------------------------------------ */
    /* FPS                                                                 */
    /* ------------------------------------------------------------------ */

    _updateFPS(delta) {
        this._fps_frame_count++
        this._fps_time += delta

        if (this._fps_time >= 1) {
            this.fps = this._fps_frame_count
            this._fps_frame_count = 0
            this._fps_time = 0
        }
    }
}
