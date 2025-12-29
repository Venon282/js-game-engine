export function UIProgress({
    value = 1,
    max = 1,
    width = 100,
    height = 10,
    color = '#0f0',
    background = '#222',
    border = '#000',
    visible = true
} = {}) {
    return {
        value,
        max,
        width,
        height,
        color,
        background,
        border,
        visible
    }
}
