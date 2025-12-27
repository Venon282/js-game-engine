import { EntityManager } from './EntityManager.js'
import { ComponentManager } from './ComponentManager.js'
import { SystemManager } from './SystemManager.js'
import { Query } from './Query.js'
import { EventBus } from './EventBus.js'

export class World {
    constructor() {
        this.entities = new EntityManager()
        this.components = new ComponentManager()
        this.systems = new SystemManager(this)
        this.events = new EventBus()
    }

    createEntity() {
        return this.entities.create()
    }

    destroyEntity(entity) {
        this.components.removeEntity(entity)
        this.entities.destroy(entity)
        this.events.emit('entityDestroyed', entity)
    }

    registerComponent(name) {
        this.components.register(name)
    }

    addComponent(entity, name, data) {
        this.components.add(entity, name, data)
    }

    removeComponent(entity, name) {
        this.components.remove(entity, name)
    }

    getComponent(entity, name) {
        return this.components.get(entity, name)
    }

    hasComponent(entity, name) {
        return this.components.has(entity, name)
    }

    query(include = [], exclude = []) {
        return new Query(this.components, include, exclude)
            .run(this.entities.getAll())
    }

    addSystem(system) {
        this.systems.add(system)
    }

    update(dt) {
        this.systems.update(dt)
    }
}

/*
import { World } from './ecs/index.js'

const world = new World()

// Components
world.registerComponent('Position')
world.registerComponent('Velocity')

// Entity
const player = world.createEntity()
world.addComponent(player, 'Position', { x: 0, y: 0 })
world.addComponent(player, 'Velocity', { x: 1, y: 0 })

// System
world.addSystem({
    update(dt) {
        for (const e of this.world.query(['Position', 'Velocity'])) {
            const pos = this.world.getComponent(e, 'Position')
            const vel = this.world.getComponent(e, 'Velocity')
            pos.x += vel.x * dt
            pos.y += vel.y * dt
        }
    }
})

// Game loop
world.update(1 / 60)
*/
