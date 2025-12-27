export class EntityManager{
    constructor(){
        this.entities = new Set()
        this._next_id = 1
    }

    create(){
        const id = this._next_id++
        this.entities.add(id)
        return id
    }

    destroy(id){
        this.entities.delete(id)
    }

    has(id){
        return this.entities.has(id)
    }

    getAll(){
        return this.entities
    }
}
