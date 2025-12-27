export class GameLoop {
    constructor(callback) {
        if (typeof callback !== 'function') {
            throw new Error('GameLoop requires a callback')
        }

        this.callback = callback
        this.running = false
        this._boundLoop = this._loop.bind(this)

        this._last_timestamp = 0
        this._raf_id = null

        // Auto-pause when tab is hidden
        this._onVisibilityChange = () => {
            if (document.hidden) {
                this._last_timestamp = 0
            }
        }

        document.addEventListener(
            'visibilitychange',
            this._onVisibilityChange
        )
    }

    start() {
        if (this.running) return
        this.running = true
        this._last_timestamp = 0
        this._raf_id = requestAnimationFrame(this._boundLoop)
    }

    stop() {
        if (!this.running) return
        this.running = false

        if (this._raf_id !== null) {
            cancelAnimationFrame(this._raf_id)
            this._raf_id = null
        }
    }

    destroy() {
        this.stop()
        document.removeEventListener(
            'visibilitychange',
            this._onVisibilityChange
        )
    }

    _loop(timestamp) {
        if (!this.running) return

        // First frame or after tab restore
        if (this._last_timestamp === 0) {
            this._last_timestamp = timestamp
        }

        this.callback(timestamp)
        this._last_timestamp = timestamp

        this._raf_id = requestAnimationFrame(this._boundLoop)
    }
}
