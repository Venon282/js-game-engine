

export function createLivingEntity({world, image,
    health=10,
    x=0, y=0, rotation=0, scale_x=1.0, scale_y=1.0,
    width=null, height=null, opacity=1,
    bwidth=null, bheight=null, offset_x=0, offset_y=0
}){
    /*
    image can be a function draw(ctx, w, h)
    If width and height are null, image must have them as properties
    Define by
    - Transform
    - Sprite
    - Velocity
    - Health
    - Bounds
    */
    const entity = world.createEntity()
    world.addComponent(entity, 'Transform', { x, y, rotation, scale_x, scale_y})
    world.addComponent(entity, 'Sprite', {
        image: image,
        width: width,
        height: height,
        opacity: opacity,
        visible: true
    })
    world.addComponent(entity, 'Velocity', {vx: 0, vy:0, rotation:0})
    world.addComponent(entity, 'Health', {health})
    world.addComponent(entity, 'Bounds', {
        width:bwidth??width,
        height:bheight??height,
        offset_x:offset_x,
        offset_y:offset_y
    })
    return entity
}
