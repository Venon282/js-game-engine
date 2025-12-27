export function Camera({
    zoom = 1,
    rotation = 0,
    viewport_width = null,
    viewport_height = null,
    follow = null,
    smooth = 0,
    active = true,
    clear_color = null
} = {}) {
    return {
        zoom,
        rotation,
        viewport_width,
        viewport_height,
        follow,          // entity id
        smooth,          // 0 = instant, >0 = smoothing factor
        active,
        clear_color
    }
}
