import { CollisionResolver } from '../physics/CollisionResolver.js'

export class CollisionSystem {
    constructor() {
        this.world = null
        this.resolver = new CollisionResolver()
    }

    init(world){
        this.world = world
    }

    update(dt) {
        const entities = Array.from(this.world.query([
            'Transform',
            'Bounds',
            'Collider',
            'RigidBody'
        ]))

        const len = entities.length

        for (let i = 0; i < len; i++) {
            for (let j = i + 1; j < len; j++) {
                const a = entities[i]
                const b = entities[j]

                if (!this._shouldCollide(a, b)) continue

                const manifold = this._testAABB(a, b)
                if (!manifold) continue

                this.resolver.resolve(
                    a,
                    b,
                    manifold,
                    this.world
                )
            }
        }
    }

    /* ------------------------------------------------------------ */
    /* Filters                                                     */
    /* ------------------------------------------------------------ */

    _shouldCollide(a, b) {
        const c_a = this.world.getComponent(a, 'Collider')
        const c_b = this.world.getComponent(b, 'Collider')

        if (!c_a.enabled || !c_b.enabled) return false

        // Collision layers / masks
        if ((c_a.mask & c_b.layer) === 0) return false
        if ((c_b.mask & c_a.layer) === 0) return false

        return true
    }

    /* ------------------------------------------------------------ */
    /* Narrow phase: AABB vs AABB                                   */
    /* ------------------------------------------------------------ */

    _testAABB(entity_a, entity_b) {
        const t_a = this.world.getComponent(entity_a, 'Transform')
        const t_b = this.world.getComponent(entity_b, 'Transform')

        const b_a = this.world.getComponent(entity_a, 'Bounds')
        const b_b = this.world.getComponent(entity_b, 'Bounds')

        const a_min_x = t_a.x + b_a.offset_x
        const a_min_y = t_a.y + b_a.offset_y
        const a_max_x = a_min_x + b_a.width
        const a_max_y = a_min_y + b_a.height

        const b_min_x = t_b.x + b_b.offset_x
        const b_min_y = t_b.y + b_b.offset_y
        const b_max_x = b_min_x + b_b.width
        const b_max_y = b_min_y + b_b.height

        // console.log(entity_a, entity_b, a_max_x ,'<=', b_min_x ,'||',
        //         a_min_x ,'>=', b_max_x ,'||',
        //         a_max_y ,'<=', b_min_y ,'||',
        //         a_min_y ,'>=', b_max_y, a_max_x <= b_min_x ||
        //         a_min_x >= b_max_x ||
        //         a_max_y <= b_min_y ||
        //         a_min_y >= b_max_y)

        if (
            a_max_x <= b_min_x ||
            a_min_x >= b_max_x ||
            a_max_y <= b_min_y ||
            a_min_y >= b_max_y
        ) {
            return null
        }



        // Compute overlap
        const overlap_x = Math.min(a_max_x, b_max_x) - Math.max(a_min_x, b_min_x)
        const overlap_y = Math.min(a_max_y, b_max_y) - Math.max(a_min_y, b_min_y)

        // Compute centers
        const center_a_x = a_min_x + b_a.width * 0.5
        const center_a_y = a_min_y + b_a.height * 0.5

        const center_b_x = b_min_x + b_b.width * 0.5
        const center_b_y = b_min_y + b_b.height * 0.5

        let normal
        let penetration

        if (overlap_x < overlap_y) {
            penetration = overlap_x
            normal = {
                x: center_a_x < center_b_x ? -1 : 1,
                y: 0
            }
        } else {
            penetration = overlap_y
            normal = {
                x: 0,
                y: center_a_y < center_b_y ? -1 : 1
            }
        }

        return {
            normal,
            penetration
        }
    }
}
