export class Renderer {
    constructor({
        canvas = null,
        width = 800,
        height = 600,
        pixel_ratio = window.devicePixelRatio || 1,
        clear_color = '#000000'
    } = {}) {
        if (new.target === Renderer) {
            throw new Error('Renderer is abstract')
        }

        this.canvas = canvas || document.createElement('canvas')
        this.width = width
        this.height = height
        this.pixel_ratio = pixel_ratio
        this.clear_color = clear_color

        this.context = null
    }

    init() {
        throw new Error('Renderer.init() must be implemented')
    }

    resize(width, height) {
        this.width = width
        this.height = height

        this.canvas.width = width * this.pixel_ratio
        this.canvas.height = height * this.pixel_ratio
        this.canvas.style.width = width + 'px'
        this.canvas.style.height = height + 'px'
    }

    begin(camera, camera_transform) {
        throw new Error('Renderer.begin() must be implemented')
    }

    drawSprite(transform, sprite) {
        throw new Error('Renderer.drawSprite() must be implemented')
    }

    end() {
        throw new Error('Renderer.end() must be implemented')
    }

    destroy() {}
}
