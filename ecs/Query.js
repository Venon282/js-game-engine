export class Query {
    constructor(component_manager, include = [], exclude = []) {
        this.component_manager = component_manager
        this.include = include
        this.exclude = exclude
    }

    *run(entities) {
        for (const e of entities) {
            if (!this.include.every(c => this.component_manager.has(e, c))) continue
            if (this.exclude.some(c => this.component_manager.has(e, c))) continue
            yield e
        }
    }
}
