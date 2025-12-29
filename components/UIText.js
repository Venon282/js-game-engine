export function UIText({
    value = '',
    font = '24px sans-serif',
    color = '#fff',
    align = 'left',
    baseline = 'top',
    visible = true
} = {}) {
    return {
        value,
        font,
        color,
        align,
        baseline,
        visible
    }
}
