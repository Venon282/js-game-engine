import { GameLoop } from './GameLoop.js'
import { Time } from './Time.js'
import { SceneManager } from './SceneManager.js'
import { InputManager } from '../input/InputManager.js'
import { AssetManager } from '../assets/AssetManager.js'

export class Engine {
    static instance = null

    constructor({
        canvas = null,
        fixed_delta = 1 / 60,
        max_delta = 0.25,
        auto_start = true,
        prevent_inputs = [],
        debug = false
    } = {}) {
        if (Engine.instance) {
            throw new Error('Engine already created (singleton)')
        }
        Engine.instance = this

        this.debug = debug
        this.running = false
        this.paused = false

        // Core subsystems
        this.time = new Time({ fixed_delta, max_delta })
        this.loop = new GameLoop(this._update.bind(this))
        this.scenes = new SceneManager(this)
        this.input = new InputManager(canvas ?? window, prevent_inputs)
        this.assets = new AssetManager()

        // Hooks
        this._on_before_update = []
        this._on_after_update = []

        if (auto_start) {
            this.start()
        }
    }

    /* ------------------------------------------------------------------ */
    /* Lifecycle                                                          */
    /* ------------------------------------------------------------------ */

    start() {
        if (this.running) return
        this.running = true
        this.loop.start()
        this._log('Engine started')
    }

    stop() {
        if (!this.running) return
        this.running = false
        this.loop.stop()
        this._log('Engine stopped')
    }

    pause() {
        if (this.paused) return
        this.paused = true
        this._log('Engine paused')
    }

    resume() {
        if (!this.paused) return
        this.paused = false
        this._log('Engine resumed')
    }

    destroy() {
        this.stop()
        this.scenes.clear()
        this.input.destroy()
        Engine.instance = null
        this._log('Engine destroyed')
    }

    /* ------------------------------------------------------------------ */
    /* Main Loop                                                           */
    /* ------------------------------------------------------------------ */

    _update(timestamp) {
        this.time.update(timestamp)

        if (this.paused) return

        // Hooks (profiling, editor, etc.)
        for (const fn of this._on_before_update) {
            fn(this.time)
        }

        // Fixed update (physics, deterministic systems)
        while (this.time.shouldFixedUpdate()) {
            this._fixedUpdate(this.time.fixed_delta)
            this.time.consumeFixedStep()
        }

        // Input first (edge detection)
        this.input.update()

        // Variable update (render, animation)
        this._variableUpdate(this.time.delta)

        for (const fn of this._on_after_update) {
            fn(this.time)
        }
    }

    _fixedUpdate(dt) {
        const scene = this.scenes.current
        if (!scene) return

        scene.onFixedUpdate?.(dt)
        scene.world?.update(dt)
    }

    _variableUpdate(dt) {
        const scene = this.scenes.current
        if (!scene) return

        scene.onUpdate?.(dt)
        scene.onRender?.(dt)
    }

    /* ------------------------------------------------------------------ */
    /* Scene helpers                                                       */
    /* ------------------------------------------------------------------ */

    loadScene(scene) {
        this.scenes.load(scene)
    }

    reloadScene() {
        this.scenes.reload()
    }

    /* ------------------------------------------------------------------ */
    /* Hooks & extensions                                                   */
    /* ------------------------------------------------------------------ */

    onBeforeUpdate(fn) {
        this._on_before_update.push(fn)
    }

    onAfterUpdate(fn) {
        this._on_after_update.push(fn)
    }

    /* ------------------------------------------------------------------ */
    /* Utilities                                                           */
    /* ------------------------------------------------------------------ */

    getFPS() {
        return this.time.fps
    }

    isRunning() {
        return this.running
    }

    isPaused() {
        return this.paused
    }

    _log(...args) {
        if (this.debug) {
            console.log('[Engine]', ...args)
        }
    }
}
