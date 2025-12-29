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

        this._renderSprites("drawSprite", "Transform", "Sprite")

        this.renderer.end()

        // Related to the view and not the camera
        this.renderer.beginUI()
        this._renderSprites("drawSprite", "UITransform", "Sprite")
        this._renderSprites("drawText", "UITransform", "UIText")
        this._renderSprites("drawProgress", "UITransform", "UIProgress")
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

    _renderSprites(method_name, transform_name, other_element_name){
        for(const e of this.world.query([transform_name, other_element_name])){
            const other_element = this.world.getComponent(e, other_element_name)
            if (other_element.visible === false) continue

            this.renderer[method_name](
                this.world.getComponent(e, transform_name),
                other_element
            )
        }
    }
}
