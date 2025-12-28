import {
    Transform,
    Velocity,
    Sprite,
    Bounds,
    Collider,
    RigidBody,
    Camera,
    Health
} from "../components/index.js"

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
    world.addComponent(entity, 'Transform', Transform({ x, y, rotation, scale_x, scale_y}))
    world.addComponent(entity, 'Sprite', Sprite({
        image: image,
        width: width,
        height: height,
        opacity: opacity,
        visible: true
    }))
    world.addComponent(entity, 'Velocity', Velocity({vx: 0, vy:0, rotation:0}))
    world.addComponent(entity, 'Health', Health({health}))
    world.addComponent(entity, 'Bounds', Bounds({
        width:bwidth??width,
        height:bheight??height,
        offset_x:offset_x,
        offset_y:offset_y
    }))
    return entity
}

export function createWorldWall(world, width, height, collider_layer, collider_mask, size=1000){
    const mid_size = size / 2
    const width_len = width + size
    const height_len = height + size
    const width_mid = width_len / 2
    const height_mid = height_len / 2
    for(const [x, y, wall_width, wall_height] of [
        [width_mid      , -mid_size         , width_len , size],        // top
        [width_mid-size , height+mid_size   , width_len , size],        // bottom
        [-mid_size      , height_mid-size   , size      , height_len],  // left
        [width+mid_size , height_mid        , size      , height_len],  // right
    ]){
        const wall = world.createEntity()
        world.addComponent(wall, 'Transform', Transform({x:x, y:y}))
        world.addComponent(wall, 'Bounds', Bounds({offset_x:0, offset_y:0, width:wall_width, height:wall_height}))
        world.addComponent(wall, 'RigidBody', RigidBody({mass:0, use_gravity:false}))
        world.addComponent(wall, 'Collider', Collider({layer:collider_layer, mask:collider_mask}))
    }
}
