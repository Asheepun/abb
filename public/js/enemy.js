import vec, { sub } from "/js/vector.js";
import entity from "/js/entity.js";
import getMove from "/js/move.js";

const enemy = ({ pos, size, jumpSpeed = 0.2, img = "enemy", frame1 = [0, 0, 210, 210], frame2 = [224, 0, 210, 210] }) => {
    const that = entity({
        pos,
        size,
        imgPos: frame1,
        img,
    });
    that.jumpSpeed = jumpSpeed;

    that.move = getMove(that, {
        speed: 0.1,
        dir: -1,
        gravity: 0.01,
    });
    that.handleColissionY = (object) => {
        if(that.velocity.y > 0){
            that.pos.y = object.pos.y - that.size.y;
            that.grounded = true;
        }
        else{ 
            that.pos.y = object.pos.y + object.size.y;
            that.grounded = false;
        }
        that.velocity.y = 0;
    }
    that.handleOubY = () => {
        if(that.velocity.y < 0){
            that.pos.y = 0;
            that.velocity.y = 0;
        }
    }
    that.handleColissionX = that.handleOubX = () => {
        that.dir *= -1;
        that.pos.x += 4*that.dir;
        //animate
        if(that.dir > 0) that.imgPos = frame2;
        else that.imgPos = frame1;
    }
    that.handlePlatCol = (object) => {
        if(that.velocity.y > 0){
            that.pos.y = object.pos.y - that.size.y;
            that.grounded = true;
            that.velocity.y = 0;
        }
    }
    that.jump = () => {
        if(that.grounded){
            that.velocity.y = -that.jumpSpeed;
        }
    }
    //make talking engine
    that.lines = [
        "Lil bugger!",
        "Come'ere you!",
        "You scared boy?",
        "I dare you!",
        "Twerp!",
    ];
    that.line = false;
    that.talking = false;
    that.talked = 0;
    that.talk = ({ player, audio }) => {
        if(that.talking && that.line){
            that.talked++;
            if(that.talked > 60) that.line = false;
        }
        if(sub(player.center, that.center).mag < that.size.x/2 + 100){
            if(!that.talking){
                that.talking = true
                that.talked = 0;
                that.line = that.lines[Math.floor(Math.random()*that.lines.length)];
            }
        }else that.talking = false;
    }
    let drawPosX = that.center.x-(that.line.length/2)*10-15;
    that.addDrawingAction(ctx => {
        if(that.talking && that.line){
            ctx.fillStyle = "white";
            ctx.font = "20px game";
            if(that.size.x === 210) ctx.font = "30px game";
            drawPosX = that.center.x-(that.line.length/2)*10-15;
            while(drawPosX < 10){
                drawPosX += 10;
            }
            ctx.fillText(that.line, drawPosX, that.pos.y - 10);
        }
    });

    that.update = that.getUpdate("move", "jump", "talk");

    return that;
}

export const bouncer = (pos) => enemy({
    pos,
    size: vec(50, 50),
});

export const jumper = (pos) => {
    const that = enemy({
        pos,
        size: vec(60, 60),
        jumpSpeed: 0.4,
    });
    that.speed = 0;
    that.lines.push("Don't run away!");

    that.look = ({ player, sprites }) => {
        if(player.pos.x > that.center.x){
            that.dir = 1;
            that.imgPos = [224, 0, 210, 210];
        }else{
            that.dir = -1;
            that.imgPos = [0, 0, 210, 210];
        }
    }
    that.update = that.getUpdate("move", "jump", "look", "talk");
    return that;
}

export const giantJumper = (pos) => {
    const that = jumper(pos);
    that.size = vec(210, 210);
    that.jumpSpeed = 0.5;

    return that;
}

export const spawner = (pos) => {
    const that = bouncer(pos);
    that.spawn = vec(that.pos.x, that.pos.y);
    that.oubArea = [0, 0, 900, 660];
    that.alpha = 0;

    that.handleOubY = () => {
        if(that.velocity.y > 0){
            that.pos = vec(that.spawn.x, that.spawn.y);
            that.alpha = 0;
        }
    }
    that.reSpawn = () => {
        if(that.alpha === 1) return;
        that.alpha += 0.05;
        if(that.alpha > 1) that.alpha = 1;
    }
    that.update = that.getUpdate("move", "jump", "reSpawn", "talk");

    return that;
}

export const follower = (pos) => {
    const that = jumper(pos);
    that.jumpSpeed = 0.2;
    that.speed = 0.13;

    that.lines.push("I see you!", "I know where you are!");
    
    that.look = ({ player }) => {
        if(player.pos.x > that.pos.x + that.size.x){
            that.dir = 1;
            that.imgPos = [224, 0, 210, 210];
        }
        if(player.pos.x < that.pos.x - player.size.x){
            that.dir = -1;
            that.imgPos = [0, 0, 210, 210];
        }
    }
    that.handleColissionX = (object) => {
        if(that.velocity.x > 0) that.pos.x = object.pos.x - that.size.x;
        else that.pos.x = object.pos.x + object.size.x;
    }

    return that;
}
/*
export const ghost = (pos) => {
    const ghost = jumper(pos);
    ghost.alpha = 0.8;
    ghost.gravity = 0;
    ghost.dir.x = 0;
    ghost.velocity.y = 0.2;
    ghost.oubArea = [0, 0, 900, 600];

    ghost.handleOubY = () => {
        ghost.velocity.y *= -1;
    }
    ghost.handleColissionY = undefined;
    ghost.handleColissionX = undefined;
    ghost.handlePlatCol = undefined;

    return ghost;
}

export const giantGhost = (pos) => {
    const jg = ghost(pos);
    jg.size = v(210, 210);
    jg.velocity.y = 0.2;

    return jg;
}*/

export default enemy;