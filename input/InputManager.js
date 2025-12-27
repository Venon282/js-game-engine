export class InputManager {
    constructor(target = window, prevent=[]) {
        this.target = target || window
        this.prevent = prevent

        /* -------------------------------------------------------------- */
        /* Raw state                                                       */
        /* -------------------------------------------------------------- */

        this._keys = new Map()      // code -> pressed
        this._keys_down = new Set()  // pressed this frame
        this._keys_up = new Set()    // released this frame

        this._mouse_buttons = new Map()
        this._mouse_down = new Set()
        this._mouse_up = new Set()

        this.mouse = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            wheel: 0
        }

        /* -------------------------------------------------------------- */
        /* Action mapping                                                  */
        /* -------------------------------------------------------------- */

        this.actions = new Map() // action -> Set(inputs)

        /* -------------------------------------------------------------- */
        /* Bindings                                                        */
        /* -------------------------------------------------------------- */

        this._on_key_down = this._handleKeyDown.bind(this)
        this._on_key_up = this._handleKeyUp.bind(this)
        this._on_mouse_down = this._handleMouseDown.bind(this)
        this._on_mouse_up = this._handleMouseUp.bind(this)
        this._on_mouse_move = this._handleMouseMove.bind(this)
        this._on_wheel = this._handleWheel.bind(this)

        this._attach()
    }

    /* ------------------------------------------------------------------ */
    /* Lifecycle                                                          */
    /* ------------------------------------------------------------------ */

    destroy() {
        this._detach()
        this._keys.clear()
        this._mouse_buttons.clear()
        this.actions.clear()
    }

    update() {
        // Clear edge states
        this._keys_down.clear()
        this._keys_up.clear()
        this._mouse_down.clear()
        this._mouse_up.clear()
        this.mouse.dx = 0
        this.mouse.dy = 0
        this.mouse.wheel = 0
    }

    /* ------------------------------------------------------------------ */
    /* Public query API                                                   */
    /* ------------------------------------------------------------------ */

    isKeyPressed(code) {
        return this._keys.get(code) === true
    }

    isKeyDown(code) {
        return this._keys_down.has(code)
    }

    isKeyUp(code) {
        return this._keys_up.has(code)
    }

    isMousePressed(button = 0) {
        return this._mouse_buttons.get(button) === true
    }

    isMouseDown(button = 0) {
        return this._mouse_down.has(button)
    }

    isMouseUp(button = 0) {
        return this._mouse_up.has(button)
    }

    /* ------------------------------------------------------------------ */
    /* Action mapping API                                                 */
    /* ------------------------------------------------------------------ */

    bindAction(action, inputs) {
        if (!Array.isArray(inputs)) {
            inputs = [inputs]
        }
        if(this.actions.has(action)){
            for (const input of inputs) {
                this.actions.get(action).add(input)
            }
        }else{
            this.actions.set(action, new Set(inputs))
        }
    }

    unbindAction(action) {
        this.actions.delete(action)
    }

    isActionPressed(action) {
        return this._checkAction(action, this.isKeyPressed.bind(this), this.isMousePressed.bind(this))
    }

    isActionDown(action) {
        return this._checkAction(action, this.isKeyDown.bind(this), this.isMouseDown.bind(this))
    }

    isActionUp(action) {
        return this._checkAction(action, this.isKeyUp.bind(this), this.isMouseUp.bind(this))
    }

    /* ------------------------------------------------------------------ */
    /* Internal helpers                                                   */
    /* ------------------------------------------------------------------ */

    _checkAction(action, keyFn, mouseFn) {
        const inputs = this.actions.get(action)
        if (!inputs) return false

        for (const input of inputs) {
            if (typeof input === 'string') {
                if (keyFn(input)) return true
            } else if (typeof input === 'number') {
                if (mouseFn(input)) return true
            }
        }
        return false
    }

    /* ------------------------------------------------------------------ */
    /* Event handling                                                     */
    /* ------------------------------------------------------------------ */

    _attach() {
        this.target.addEventListener('keydown', this._on_key_down)
        this.target.addEventListener('keyup', this._on_key_up)
        this.target.addEventListener('mousedown', this._on_mouse_down)
        this.target.addEventListener('mouseup', this._on_mouse_up)
        this.target.addEventListener('mousemove', this._on_mouse_move)
        this.target.addEventListener('wheel', this._on_wheel, { passive: true })
    }

    _detach() {
        this.target.removeEventListener('keydown', this._on_key_down)
        this.target.removeEventListener('keyup', this._on_key_up)
        this.target.removeEventListener('mousedown', this._on_mouse_down)
        this.target.removeEventListener('mouseup', this._on_mouse_up)
        this.target.removeEventListener('mousemove', this._on_mouse_move)
        this.target.removeEventListener('wheel', this._on_wheel)
    }

    _handleKeyDown(e) {
        this._preventDefault(e)
        if (!this._keys.get(e.code)) {
            this._keys_down.add(e.code)
        }
        this._keys.set(e.code, true)
    }

    _handleKeyUp(e) {
        this._preventDefault(e)
        this._keys.set(e.code, false)
        this._keys_up.add(e.code)
    }

    _handleMouseDown(e) {
        this._preventDefault(e)
        if (!this._mouse_buttons.get(e.button)) {
            this._mouse_down.add(e.button)
        }
        this._mouse_buttons.set(e.button, true)
    }

    _handleMouseUp(e) {
        this._preventDefault(e)
        this._mouse_buttons.set(e.button, false)
        this._mouse_up.add(e.button)
    }

    _handleMouseMove(e) {
        const rect = this.target.getBoundingClientRect?.()
        if (rect) {
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            this.mouse.dx += x - this.mouse.x
            this.mouse.dy += y - this.mouse.y
            this.mouse.x = x
            this.mouse.y = y
        } else {
            this.mouse.dx += e.movementX
            this.mouse.dy += e.movementY
        }
    }

    _handleWheel(e) {
        this._preventDefault(e)
        this.mouse.wheel += e.deltaY
    }

    _preventDefault(e){
        if(this.prevent.includes(e.code) || this.prevent.includes(e.key))
            e.preventDefault()
    }
}

/*
// Setup
engine.input.bindAction('jump', ['Space', 'KeyW'])
engine.input.bindAction('shoot', [0]); // left mouse

// In system / scene
if (engine.input.isActionDown('jump')) {
    player.jump()
}

if (engine.input.isActionPressed('shoot')) {
    player.fire()
}
*/
