export function RigidBody({
    mass = 1,
    use_gravity = true,
    linear_damping = 0.01
} = {}) {
    return {
        mass,
        inv_mass: mass > 0 ? 1 / mass : 0,
        use_gravity,
        linear_damping,
        force_x: 0,
        force_y: 0
    }
}
