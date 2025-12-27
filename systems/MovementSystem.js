export class MovementSystem {
    constructor() {
        this.world = null
        this.enabled = true
    }

    /* ------------------------------------------------------------ */
    /* Lifecycle                                                    */
    /* ------------------------------------------------------------ */

    init(world) {
        this.world = world
    }

    update(dt) {
        if (!this.enabled || !this.world) return
        if (dt <= 0) return

        // Query only entities that can move
        for (const e of this.world.query(['Transform', 'Velocity'])) {
            const transform = this.world.getComponent(e, 'Transform')
            const velocity  = this.world.getComponent(e, 'Velocity')

            this._integrate(transform, velocity, dt)
        }
    }

    /* ------------------------------------------------------------ */
    /* Integration                                                  */
    /* ------------------------------------------------------------ */

    _integrate(transform, velocity, dt) {
        // Linear movement
        if (velocity.vx !== 0 || velocity.vy !== 0) {
            transform.x += velocity.vx * dt
            transform.y += velocity.vy * dt
        }

        // angular velocity
        if (velocity.angular !== undefined && velocity.angular !== 0) {
            transform.rotation =
                (transform.rotation || 0) + velocity.angular * dt
        }
    }

    /* ------------------------------------------------------------ */
    /* Controls                                                     */
    /* ------------------------------------------------------------ */

    setEnabled(value) {
        this.enabled = !!value
    }
}
