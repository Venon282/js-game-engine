export class DebugDraw {
    constructor({
        draw_bounds = true,
        draw_colliders = true,
        draw_velocity = true,
        draw_camera = true,

        bounds_color = '#00ff00',
        trigger_color = '#00ffff',
        collider_color = '#ff0000',
        velocity_color = '#ffff00',
        camera_color = '#ffffff'
    } = {}) {
        this.enabled = true

        this.draw_bounds = draw_bounds
        this.draw_colliders = draw_colliders
        this.draw_velocity = draw_velocity
        this.draw_camera = draw_camera

        this.colors = {
            bounds: bounds_color,
            trigger: trigger_color,
            collider: collider_color,
            velocity: velocity_color,
            camera: camera_color
        }

        this.world = null
        this.ctx = null
    }

    /* ------------------------------------------------------------ */
    /* Lifecycle                                                    */
    /* ------------------------------------------------------------ */

    init(world, renderer) {
        this.world = world
        this.ctx = renderer.context
        this.renderer = renderer

        const originalEnd = renderer.end.bind(renderer)
        const debug = this

        renderer.end = function (...args) {
            debug.render()
            originalEnd(...args)
        }
    }

    setEnabled(value) {
        this.enabled = value
    }

    /* ------------------------------------------------------------ */
    /* Render hook                                                  */
    /* ------------------------------------------------------------ */

    render() {
        if (!this.enabled || !this.world || !this.ctx) return

        const ctx = this.ctx
        ctx.save()

        this._draw_bounds(ctx)
        this._draw_velocity(ctx)
        this._draw_camera(ctx)

        ctx.restore()
    }

    /* ------------------------------------------------------------ */
    /* Bounds & Colliders                                           */
    /* ------------------------------------------------------------ */

    _draw_bounds(ctx) {
        if (!this.draw_bounds && !this.draw_colliders) return

        for (const e of this.world.query(['Transform', 'Bounds'])) {
            const t = this.world.getComponent(e, 'Transform')
            const b = this.world.getComponent(e, 'Bounds')
            const c = this.world.getComponent(e, 'Collider')
            const x = t.x + (b.offset_x ?? 0)
            const y = t.y + (b.offset_y ?? 0)

            ctx.strokeStyle = c?.is_trigger
                ? this.colors.trigger
                : this.colors.collider

            ctx.lineWidth = 1
            ctx.strokeRect(
                x,
                y,
                b.width,
                b.height,
            )

            if (this.draw_bounds) {
                ctx.fillStyle = this.colors.bounds
                ctx.globalAlpha = 0.15
                ctx.fillRect(
                    x,
                    y,
                    b.width,
                    b.height,
                )
                ctx.globalAlpha = 1
            }
        }
    }

    /* ------------------------------------------------------------ */
    /* Velocity                                                     */
    /* ------------------------------------------------------------ */

    _draw_velocity(ctx) {
        if (!this.draw_velocity) return

        for (const e of this.world.query(['Transform', 'Velocity'])) {
            const t = this.world.getComponent(e, 'Transform')
            const v = this.world.getComponent(e, 'Velocity')

            const scale = 10

            ctx.strokeStyle = this.colors.velocity
            ctx.beginPath()
            ctx.moveTo(t.x, t.y)
            ctx.lineTo(
                t.x + v.vx * scale,
                t.y + v.vy * scale
            )
            ctx.stroke()
        }
    }

    /* ------------------------------------------------------------ */
    /* Camera                                                       */
    /* ------------------------------------------------------------ */

    _draw_camera(ctx) {
        if (!this.draw_camera) return

        for (const e of this.world.query(['Camera', 'Transform'])) {
            const cam = this.world.getComponent(e, 'Camera')
            if (!cam.active) continue

            const t = this.world.getComponent(e, 'Transform')

            const w = cam.width
            const h = cam.height

            ctx.strokeStyle = this.colors.camera
            ctx.setLineDash([6, 4])

            ctx.strokeRect(
                t.x - w / 2,
                t.y - h / 2,
                w,
                h
            )

            ctx.setLineDash([])
        }
    }
}
