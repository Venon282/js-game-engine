export class SceneManager {
    constructor(engine) {
        this.engine = engine

        this.current = null
        this.previous = null

        this._is_loading = false
    }

    /* ------------------------------------------------------------------ */
    /* Scene control                                                       */
    /* ------------------------------------------------------------------ */

    async load(scene) {
        if (!scene) {
            throw new Error('Cannot load null scene')
        }

        if (this._is_loading) {
            console.warn('Scene load already in progress')
            return
        }

        this._is_loading = true

        // Exit current scene
        if (this.current) {
            this.current._exit()
            this.previous = this.current
        }

        // Load new scene
        await scene._load(this.engine)
        scene._enter()

        this.current = scene
        this._is_loading = false
    }

    async reload() {
        if (!this.current) return

        const scene = this.current

        scene._exit()
        scene._unload()

        await scene._load(this.engine)
        scene._enter()
    }

    clear() {
        if (!this.current) return

        this.current._exit()
        this.current._unload()

        this.current = null
        this.previous = null
    }

    /* ------------------------------------------------------------------ */
    /* Helpers                                                             */
    /* ------------------------------------------------------------------ */

    isLoading() {
        return this._is_loading
    }

    hasScene() {
        return this.current !== null
    }
}

/*
import { Scene } from '../../engine/core/Scene.js'

export class MainScene extends Scene {
    constructor() {
        super('MainScene')
    }

    async onLoad() {
        this.world.registerComponent('Position')
        this.world.registerComponent('Velocity')

        const player = this.world.createEntity()
        this.world.addComponent(player, 'Position', { x: 0, y: 0 })
        this.world.addComponent(player, 'Velocity', { x: 50, y: 0 })

        this.world.addSystem({
            update: (dt) => {
                for (const e of this.world.query(['Position', 'Velocity'])) {
                    const p = this.world.getComponent(e, 'Position')
                    const v = this.world.getComponent(e, 'Velocity')
                    p.x += v.x * dt
                }
            }
        })
    }

    onUpdate(dt) {
        // Game logic
    }

    onRender(dt) {
        // Rendering
    }
}
*/
