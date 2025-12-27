// Sprite.js
export function Sprite({
    image = null, // Can be a draw function
    width = null,
    height = null,
    opacity = 1,
    visible = true
} = {}) {
    return {
        image,
        width,
        height,
        opacity,
        visible
    }
}
