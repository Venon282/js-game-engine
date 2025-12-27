export class CollisionResolver {
    constructor({
        position_correction_percent = 0.8,
        position_correction_slop = 0.01
    } = {}) {
        this.percent = position_correction_percent
        this.slop = position_correction_slop
    }

    /* ------------------------------------------------------------ */
    /* Public API                                                   */
    /* ------------------------------------------------------------ */

    resolve(entity_a, entity_b, data, world) {
        const t_a = world.getComponent(entity_a, 'Transform')
        const t_b = world.getComponent(entity_b, 'Transform')

        const v_a = world.getComponent(entity_a, 'Velocity')
        const v_b = world.getComponent(entity_b, 'Velocity')

        const rb_a = world.getComponent(entity_a, 'RigidBody')
        const rb_b = world.getComponent(entity_b, 'RigidBody')

        const c_a = world.getComponent(entity_a, 'Collider')
        const c_b = world.getComponent(entity_b, 'Collider')

        if (!rb_a || !rb_b) return

        // Static bodies don't move
        if (rb_a.inv_mass === 0 && rb_b.inv_mass === 0) return

        const normal = data.normal
        const penetration = data.penetration

        this._positionalCorrection(
            t_a, t_b,
            rb_a, rb_b,
            normal,
            penetration
        )

        // this._applyImpulse(
        //     v_a, v_b,
        //     rb_a, rb_b,
        //     c_a, c_b,
        //     normal
        // )
    }

    /* ------------------------------------------------------------ */
    /* Positional correction                                       */
    /* ------------------------------------------------------------ */

    _positionalCorrection(t_a, t_b, rb_a, rb_b, normal, penetration) {
        const inv_mass_a = rb_a.inv_mass
        const inv_mass_b = rb_b.inv_mass

        const correction_magnitude = Math.max(
            penetration - this.slop,
            0
        ) / (inv_mass_a + inv_mass_b) * this.percent

        const cx = correction_magnitude * normal.x
        const cy = correction_magnitude * normal.y

        if (inv_mass_a > 0) {
            t_a.x += cx * inv_mass_a
            t_a.y += cy * inv_mass_a
        }

        if (inv_mass_b > 0) {
            t_b.x -= cx * inv_mass_b
            t_b.y -= cy * inv_mass_b
        }
    }

    /* ------------------------------------------------------------ */
    /* Impulse resolution                                          */
    /* ------------------------------------------------------------ */

    _applyImpulse(v_a, v_b, rb_a, rb_b, c_a, c_b, normal) {
        const relative_velocity_x = (v_b?.vx || 0) - (v_a?.vx || 0)
        const relative_velocity_y = (v_b?.vy || 0) - (v_a?.vy || 0)
        const velocity_along_normal = relative_velocity_x * normal.x + relative_velocity_y * normal.y

        // Objects separating
        if (velocity_along_normal > 0) return

        const restitution = Math.min(
            c_a?.restitution ?? 0,
            c_b?.restitution ?? 0
        )
        // console.log(relative_velocity_x, relative_velocity_y, velocity_along_normal, restitution)

        const j = -(1 + restitution) * velocity_along_normal /
            (rb_a.inv_mass + rb_b.inv_mass)

        const impulse_x = j * normal.x
        const impulse_y = j * normal.y

        //Newton’s 3rd law: For every action, there is an equal and opposite reaction
        if (rb_a.inv_mass > 0 && v_a) {
            v_a.vx -= impulse_x * rb_a.inv_mass
            v_a.vy -= impulse_y * rb_a.inv_mass
        }

        if (rb_b.inv_mass > 0 && v_b) {
            v_b.vx += impulse_x * rb_b.inv_mass
            v_b.vy += impulse_y * rb_b.inv_mass
        }
    }
}
