(()=> {
    //TODO Add vector class

    class Vector2d{
        #x;
        #y;
        constructor(x,y) {
            this.#x = x;
            this.#y = y;
        }
        get x(){
            return this.#x;
        }

        set x(value) {
            this.#x = value;
        }

        get y() {
            return this.#y;
        }

        set y(value) {
            this.#y = value;
        }

        /**
         * @param other {Vector2d}
         * @return {Number}
         */
        getLength(other){
            return Math.sqrt(Math.pow(other.x-this.x,2)+Math.pow(other.y-this.y,2));
        }
    }
    class Ball{
        #pos;
        #velocity;
        #idDragging = false;
        #mouse;
        #config = {
            TWO_PI : Math.PI*2,
            color: "rgba(255,236,140,0.85)", //"rgba(0,0,0,0.8)",
            radius :100, //ball rad
            air : 0.99, //air resistance for ball slowing
            gravitation : 1, //"gravitation"
            maxSpeed : 50,
            LMB: 0,
            RMB:2
        }
        isStoppedY =false;
        isStoppedX =false;
        /**
         * @constructor
         * @param context {CanvasRenderingContext2D} Context
         * @param mouse {{x:Number,y:Number, keyPressed:Number}}
         * @param width {Number}
         * @param height {Number}
         */
        constructor(context, mouse,width,height) {
            this.ctx = context;
            this.#pos = new Vector2d( mouse.x/2,mouse.y/2);
            this.#velocity =new Vector2d(10,10);
            this.#mouse = mouse;
            this.w =width;
            this.h = height;
        }

        draw(){
            this.ctx.fillStyle =this.#config.color;
            this.ctx.beginPath();
            this.ctx.arc(this.#pos.x,this.#pos.y,this.#config.radius,0,this.#config.TWO_PI);
            this.ctx.fill();
        }

        velocityCalc() {

            //Stop checks for not clipping the floor
            if (Math.abs(this.#velocity.y) < this.#config.gravitation &&
                this.#pos.y + this.#config.radius >= h) {
                this.#velocity.y = 0;
                this.isStoppedY = true;

            }
            if (Math.abs(this.#velocity.x) < this.#config.gravitation / 3) {
                this.#velocity.x = 0;
                this.isStoppedX = true;
            }
            this.#velocity.y += this.#config.gravitation;
            this.#velocity.x = Math.min(this.#config.maxSpeed, this.#velocity.x);
            this.#velocity.y = Math.min(this.#config.maxSpeed, this.#velocity.y);
            this.#velocity.x *= this.#config.air;
            this.#velocity.y *= this.#config.air;
        }

        move(){
            if(!this.isStoppedY)
                this.#pos.y += this.#velocity.y;
            if(!this.isStoppedX)
                this.#pos.x += this.#velocity.x;
        }
        collisionCheck(){
            if (this.#pos.x + this.#config.radius >= this.w)
                this.#velocity.x = -Math.abs(-this.#velocity.x);
            if (this.#pos.x - this.#config.radius <= 0)
                this.#velocity.x = Math.abs(this.#velocity.x);
            if (this.#pos.y - this.#config.radius <= 0)
                this.#velocity.y = Math.abs(this.#velocity.y);
            if (this.#pos.y + this.#config.radius >= this.h) //duct tape method for ball slowing
                this.#velocity.y = -Math.abs(this.#velocity.y);
                //this.velocity.y*=config.airY;
        }

        //stops physics calculations for ball
        stop(){
            this.isStoppedX = this.isStoppedY = true;
        }

        //Resumes physics calculations for ball
        resume(){

            ball.#velocity.x = this.#mouse.x-ball.#pos.x;
            ball.#velocity.y = this.#mouse.y -ball.#pos.y;
            ball.#velocity.x = Math.min((this.#mouse.x - ball.#pos.x)/15,
                this.#config.maxSpeed);
            ball.#velocity.y = Math.min((this.#mouse.y - ball.#pos.y)/15,
                this.#config.maxSpeed);
        }

        //Draws line between ball and mouse pointer
        connectWithBall(){
            if(this.#mouse.keyPressed===0) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.#mouse.x, this.#mouse.y);
                this.ctx.lineTo(ball.#pos.x, ball.#pos.y);
                this.ctx.stroke();
            }
        }
        /**
         *
         * @param e {MouseEvent}
         */
        mouseDownEvent(e){
            this.#mouse.keyPressed = e.button;
            if(this.#mouse.keyPressed === this.#config.LMB) {
                ball.stop();
            }
            if(this.#mouse.keyPressed === this.#config.RMB &&
                this.#pos.getLength(new Vector2d(this.#mouse.x,this.#mouse.y))<=
                    this.#config.radius){
                this.#idDragging= true;
                ball.stop();
            }
        }

        /**
         *
         * @param e {MouseEvent}
         */
        mouseUpEvent(e){
            if(this.#mouse.keyPressed === this.#config.RMB){
                this.#idDragging= false;
            }
            if(this.#mouse.keyPressed === this.#config.LMB){
                ball.resume();
            }
            this.#mouse.keyPressed = -1;
            ball.isStoppedY = ball.isStoppedX = false;
        }

        /**
         *
         * @param e {MouseEvent}
         */
        mouseMoveEvent(e){
            this.#mouse.x = e.x;
            this.#mouse.y = e.y;
            if(this.#idDragging){
                this.#pos.x = this.#mouse.x;
                this.#pos.y = this.#mouse.y;
            }

        }

    }
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;
    let ball = new Ball(ctx,{x:400, y:400, keyPressed:-1},w,h);

    loop();
    function loop(){
        reDrawBackground();
        ball.draw();
        if (!(ball.isStoppedY&&ball.isStoppedX)) {
            ball.collisionCheck();
            ball.velocityCalc();
            ball.move();
        }
        ball.connectWithBall();
        window.requestAnimationFrame(loop);
    }

    function reDrawBackground(){
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = "#c55fff";
        ctx.fillRect(0,0,w,h);
    }


    //Listeners for mouse
    this.canvas.addEventListener("mousedown",(e)=>{
        ball.mouseDownEvent(e);
    })
    this.canvas.addEventListener("mouseup",(e)=>{
        ball.mouseUpEvent(e);
    })

    this.canvas.addEventListener("mousemove",(e)=>{
        ball.mouseMoveEvent(e);
    })
    document.addEventListener('contextmenu', event => event.preventDefault());
})();
