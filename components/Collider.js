/*
    restitution is the force restitution when collid
    between 0 and 1
    0	No bounce (clay)
    0.5	Partial bounce
    1	Perfect bounce (rubber)

    layer who i am
    mask what i can collid (bits)
*/
export function Collider({
    enabled = true,

    // collision filtering
    layer = 0x0001,
    mask  = 0xFFFF,

    // physics
    is_trigger = false,
    restitution = 0,

    // callbacks
    onCollision = null
} = {}) {
    return {
        enabled,
        layer,
        mask,

        is_trigger,
        restitution,

        onCollision
    }
}
