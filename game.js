export class Game{
    constructor(
        name,
        genre,
        canvas,
        {
        context='2d',
        update_interval_frames=1
    }){
        this.name = name
        this.genre = genre
        this.canvas = canvas
        this.update_interval_frames = update_interval_frames

        if (!this.canvas) {
            console.error("Canvas not found!");
            return
        }

        this.ctx = this.canvas.getContext(context)
        this.events = []
        this.frame_count = 0 // Number of frame
        this.generation = 0 // Number of draw
        this.animation_id = null // keep the animation for stop it when need
    }

    getDetails(){
        return `${this.name} is a ${this.genre} game released on ${this.releaseDate}.`;
    }

    resizeCanvas(width=null, height=null){
        this.canvas.width = width === null ? this.canvas.parentElement.clientWidth: width
        this.canvas.height = height === null ? this.canvas.parentElement.clientHeight: height
    }

    loop(){
        this.frame_count++

        if (this.frame_count % this.update_interval_frames === 0) {
            this.draw();
            this.generation++
        }

        this.animation_id = requestAnimationFrame(() => this.loop())
    }

    stop(){
        if(this.animation_id){
            cancelAnimationFrame(this.animation_id)
            this.animation_id = null
        }
    }

    start(){
        this.loop()
    }

    draw(){
        throw new Error("Child class must implement draw()");
    }

    clear(){
        this.stop()
        this.generation = 0
    }
}
