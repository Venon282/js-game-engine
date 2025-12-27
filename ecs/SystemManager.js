export class SystemManager {
    constructor(world) {
        this.world = world;
        this.systems = [];
    }

    add(system) {
        system.world = this.world;
        system.init?.(this.world)
        this.systems.push(system);
    }

    update(dt) {
        for (const system of this.systems) {
            system.update?.(dt);
        }
    }

    remove(system) {
        this.systems = this.systems.filter(s => s !== system);
        system.onDestroy?.();
    }
}
