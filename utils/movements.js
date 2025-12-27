export function adwsAction(engine, {prefix='', suffix=''}={}){
    engine.input.bindAction(`${prefix}left${suffix}`    , ['KeyA'])
    engine.input.bindAction(`${prefix}right${suffix}`   , ['KeyD'])
    engine.input.bindAction(`${prefix}up${suffix}`      , ['KeyW'])
    engine.input.bindAction(`${prefix}down${suffix}`    , ['KeyS'])
}

export function arrowAction(engine, {prefix='', suffix=''}={}){
    engine.input.bindAction(`${prefix}left${suffix}`    , ['ArrowLeft'])
    engine.input.bindAction(`${prefix}right${suffix}`   , ['ArrowRight'])
    engine.input.bindAction(`${prefix}up${suffix}`      , ['ArrowUp'])
    engine.input.bindAction(`${prefix}down${suffix}`    , ['ArrowDown'])
}

export function updatePosition(ventity, vx, vy, speed){
    speed = vx!==0 && vy!==0 ? speed*Math.sqrt(2)/2 : speed // If diagonal update it for no acceleration
    ventity.vx = vx * speed
    ventity.vy = vy * speed
}
