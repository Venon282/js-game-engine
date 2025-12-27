import { World } from '../ecs/World.js'

export class Scene {
    constructor(name) {
        this.name = name

        // Each scene has its own ECS world
        this.world = new World()

        this.engine = null
        this.loaded = false
        this.active = false
    }

    /* ------------------------------------------------------------------ */
    /* Internal engine hooks (do not override directly)                    */
    /* ------------------------------------------------------------------ */

    async _load(engine) {
        this.engine = engine

        if (!this.loaded) {
            await this.onLoad?.()
            this.loaded = true
        }
    }

    _enter() {
        this.active = true
        this.onEnter?.()
    }

    _exit() {
        this.active = false
        this.onExit?.()
    }

    _unload() {
        this.onUnload?.()
        this.loaded = false
    }

    /* ------------------------------------------------------------------ */
    /* User overridable lifecycle hooks                                    */
    /* ------------------------------------------------------------------ */

    /** Called once before first enter (async allowed) */
    async onLoad() {}

    /** Called every time the scene becomes active */
    onEnter() {}

    /** Called every time the scene stops being active */
    onExit() {}

    /** Called when scene is destroyed or replaced */
    onUnload() {}

    /** Fixed timestep update (physics, AI) */
    onFixedUpdate(dt) {}

    /** Variable timestep update (logic) */
    onUpdate(dt) {}

    /** Rendering hook */
    onRender(dt) {}
}
