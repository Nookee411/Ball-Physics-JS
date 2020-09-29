(()=> {

    //TODO Add left button check for impulse
    //TODO Right button for ball dragging (force will be equal to potential energy
    const config = {
        TWO_PI : Math.PI*2,
        color: "rgba(255,236,140,0.85)", //"rgba(0,0,0,0.8)",
        radius :100,
        airX : 0.99,
        air : 0.78,
        acceleration : 0.5,
        maxSpeed : 40,
    }
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let w,h;
    let lastPos;
    let isDown = false;
    let mouse = {x: 0, y:0}

    class Ball{
        pos;
        velocity;
        isStoppedY =false;
        isStoppedX =false;
        constructor() {
            this.pos = {x: w/2,y:h/2};
            this.delta = {x:0,y: 1}
            this.velocity ={x:1,y:0};
        }

        draw(){
            ctx.fillStyle = config.color;
            ctx.beginPath();
            ctx.arc(this.pos.x,this.pos.y,config.radius,0,config.TWO_PI);
            ctx.fill();
        }

        velocityCalc(){
            if(Math.abs(this.velocity.y)<config.acceleration*3&&
                this.pos.y+config.radius>=h) {
                this.delta.y = 0;
                this.isStoppedY = true;

            }
            if(Math.abs(this.velocity.x)<config.acceleration/3) {
                this.delta.x =0;
                this.isStoppedX = true;
            }
            if(Math.abs(this.velocity.x)<config.acceleration)
                this.delta.x = 0;
            if (this.velocity.y <= 0) {
                this.delta.y = 1;
            }
            //goes down when delta.y ==1 && velocity.y>0
            this.velocity.x *=config.airX;
            this.velocity.y +=config.acceleration*this.delta.y;

            this.velocity.x = Math.min(config.maxSpeed, this.velocity.x);
            this.velocity.y = Math.min(config.maxSpeed, this.velocity.y);
        }

        move(){
            if(!this.isStoppedY)
                this.pos.y += this.delta.y * this.velocity.y;
            if(!this.isStoppedX)
                this.pos.x += this.delta.x * this.velocity.x;
        }
        collisionCheck(){
            if (this.pos.x + config.radius >= w)
                this.delta.x = -1;
            if (this.pos.x - config.radius <= 0)
                this.delta.x = 1;
            if (this.pos.y - config.radius <= 0)
                this.delta.y = 1;
            if (this.pos.y + config.radius >= h) {
                this.delta.y = -1;
                this.velocity.y*=config.air;
            }
        }

        //delta sets to zero
        stop(){
            this.delta.x = this.delta.y = 0;
        }
        resume(){
            ball.delta.x = (mouse.x-ball.pos.x)>0?1:-1;
            ball.delta.y = (mouse.y -ball.pos.y)>0?1:-1;
            debugger;
            ball.velocity.x = Math.min(Math.abs((mouse.x - ball.pos.x))/20,
                                config.maxSpeed);
            ball.velocity.y = Math.min(Math.abs((mouse.y - ball.pos.y))/20,
                                config.maxSpeed);
        }

        connectWithBall(){
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(ball.pos.x,ball.pos.y);
            ctx.stroke();
        }

    }
    function loop(){
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = "#c55fff";
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle =config.color;
        if (!(ball.isStoppedY&&ball.isStoppedX)) {
            ball.collisionCheck();
            ball.velocityCalc();
            ball.move();
            if(isDown)
                ball.connectWithBall();
        }
        ball.draw();
        window.requestAnimationFrame(loop);
    }

    function init(){
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        isDown = false;

    }
    init();

    let ball = new Ball(400,400);
    ball.draw();

    loop();

    canvas.addEventListener("mousedown",(e)=>{
        if(e.button == 0) {
            isDown = true;
            lastPos = {x: e.x, y: e.y};
            ball.stop();
            lastPos = {x: e.x, y: e.y};
        }
    })
    canvas.addEventListener("mouseup",(e)=>{
        if(e.button == 0) {
            ball.isStoppedY = ball.isStoppedX = false;
            isDown = false;
            ball.resume();
        }
    })

    canvas.addEventListener("mousemove",(e)=>{
            mouse = {x: e.x, y: e.y};
    })
})();