export class ComponentManager{
    constructor(){
        this.components = new Map() // componentName -> Map(entity ->data)
    }

    register(name){
        if(this.components.has(name)){
            throw new Error(`Component "${name}" already registered`);
        }

        this.components.set(name, new Map())
    }

    add(entity, name, data = {}){
        const store = this.components.get(name)
        if (!store) throw new Error(`Component "${name}" not registered`)
        store.set(entity, data)
    }

    remove(entity, name){
        this.components.get(name)?.delete(entity)
    }

    get(entity, name){
        return this.components.get(name)?.get(entity)
    }

    has(entity, name){
        return this.components.get(name)?.has(entity) ?? false
    }

    removeEntity(entity){
        for(const store of this.components.values()){
            store.delete(entity)
        }
    }

    entitiesWith(name){
        return this.components.get(name)?.keys() ?? []
    }
}
