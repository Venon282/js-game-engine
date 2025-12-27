export class RenderSystem {
    constructor(renderer) {
        this.renderer = renderer
        this.world = null
    }

    init(world) {
        this.renderer.init()
        this.world = world
    }

    update(dt){
        this.render(dt)
    }

    render(dt) {
        if (!this.world) return

        const camera_data = this._getActiveCamera()
        if (!camera_data) return

        const { camera, transform } = camera_data

        this.renderer.begin(camera, transform)

        for (const e of this.world.query(['Transform', 'Sprite'])) {
            const sprite = this.world.getComponent(e, 'Sprite')
            if (sprite.visible === false) continue

            this.renderer.drawSprite(
                this.world.getComponent(e, 'Transform'),
                sprite
            )
        }

        this.renderer.end()
    }

    /* ------------------------------------------------------------ */

    _getActiveCamera() {
        for (const e of this.world.query(['Camera', 'Transform'])) {
            const camera = this.world.getComponent(e, 'Camera')
            if (camera.active) {
                return {
                    camera,
                    transform: this.world.getComponent(e, 'Transform')
                }
            }
        }
        return null
    }
}
