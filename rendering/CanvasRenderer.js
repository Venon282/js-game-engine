import { Renderer } from './Renderer.js'

export class CanvasRenderer extends Renderer {
    constructor(options = {}) {
        super(options)
        this.ctx = null
        this._onResize = this._handleResize.bind(this)
    }

    init() {
        this.ctx = this.canvas.getContext('2d', {
            alpha: false,
            desynchronized: true
        })
        console.log(this.ctx)

        if (!this.ctx) {
            throw new Error('Failed to get 2D context')
        }

        this.context = this.ctx
        this.resize(
            this.width ?? this.canvas.parentElement.clientWidth,
            this.height ?? this.canvas.parentElement.clientHeight
        )
        window.addEventListener('resize', this._onResize)
    }

    destroy() {
        window.removeEventListener('resize', this._onResize)
    }

    /* ------------------------------------------------------------ */
    /* Render lifecycle                                             */
    /* ------------------------------------------------------------ */

    begin(camera, camera_transform) {
        const ctx = this.ctx

        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)

        ctx.fillStyle = this.clear_color
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        ctx.scale(this.pixel_ratio, this.pixel_ratio)

        if (camera && camera_transform) {
            ctx.translate(
                this.width * 0.5,
                this.height * 0.5
            )
            ctx.scale(camera.zoom ?? 1, camera.zoom ?? 1)
            ctx.translate(
                -camera_transform.x,
                -camera_transform.y
            )
        }
    }

    drawSprite(transform, sprite) {
        if (!sprite.image) return

        const ctx = this.ctx

        ctx.save()
        this._applyTransformToContext(ctx, transform)

        ctx.globalAlpha = sprite.opacity ?? 1

        const w = sprite.width || sprite.image.width
        const h = sprite.height || sprite.image.height

        if(typeof sprite.image === 'function'){
            sprite.image(ctx, w, h)
        }else{
            ctx.drawImage(
                sprite.image,
                -w / 2,
                -h / 2,
                w,
                h
            )
        }

        ctx.restore()
    }

    end() {
        this.ctx.restore()
    }

    beginUI() {
        const ctx = this.ctx

        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)

        ctx.scale(this.pixel_ratio, this.pixel_ratio)
    }

    drawText(transform, text){
        console.log('Draw ', text)
        if (!text.value) return

        const ctx = this.ctx

        ctx.save()
        ctx.fillStyle = text.color
        ctx.font = text.font
        ctx.textAlign = text.align
        ctx.textBaseline = text.baseline

        ctx.fillText(
            text.value,
            transform.x,
            transform.y
        )

        ctx.restore()
    }

    drawProgress(transform, progress){
        if (!progress.value) return

        const ctx = this.ctx

        ctx.save()

        // Background
        ctx.fillStyle = progress.background
        ctx.fillRect(transform.x, transform.y, progress.width, progress.height)

        // Fill
        ctx.fillStyle = progress.color
        const ratio = Math.max(0, Math.min(1, progress.value / progress.max))
        ctx.fillRect(
            transform.x,
            transform.y,
            progress.width * ratio,
            progress.height
        )

        // Border
        if (progress.border) {
            ctx.strokeStyle = progress.border
            ctx.strokeRect(transform.x, transform.y, progress.width, progress.height)
        }

        ctx.restore()
    }

    /* ------------------------------------------------------------ */

    _handleResize() {
        const parent = this.canvas.parentElement
        if (!parent) return

        const rect = parent.getBoundingClientRect()
        this.resize(rect.width, rect.height)
    }

    _applyTransformToContext(ctx, transform){
        ctx.translate(transform.x, transform.y)
        ctx.rotate(transform.rotation ?? 0)
        ctx.scale(
            transform.scale_x ?? 1,
            transform.scale_y ?? 1
        )
    }
}
