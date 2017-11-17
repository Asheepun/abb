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

    that.update = that.makeUpdate("move", "jump", "talk");

    return that;
}

export const bouncer = (pos) => enemy({
    pos,
    size: vec(50, 50),
});

export const jumper = (pos) => {
    const jumper = enemy({
        pos,
        size: vec(60, 60),
        jumpSpeed: 0.4,
    });
    jumper.speed = 0;
    jumper.lines.push("Don't run away!", "Stay here!");

    jumper.look = ({ player, sprites }) => {
        if(player.pos.x > jumper.pos.x + jumper.size.x){
            jumper.dir = 1;
            jumper.imgPos = [224, 0, 210, 210];
        }
        if(player.pos.x + player.size.x < jumper.pos.x){
            jumper.dir = -1;
            jumper.imgPos = [0, 0, 210, 210];
        }
    }
    jumper.update = jumper.makeUpdate("move", "jump", "look", "talk");
    return jumper;
}

export const giantJumper = (pos) => {
    const gj = jumper(pos);
    gj.size = vec(210, 210);
    gj.jumpSpeed = 0.5;

    return gj;
}

export const spawner = (pos) => {
    const spawner = bouncer(pos);
    spawner.spawn = vec(spawner.pos.x, spawner.pos.y);
    spawner.oubArea = [0, 0, 900, 660];
    spawner.alpha = 0;

    spawner.handleOubY = () => {
        if(spawner.velocity.y > 0){
            spawner.pos = vec(spawner.spawn.x, spawner.spawn.y);
            spawner.alpha = 0;
        }
    }
    spawner.reSpawn = () => {
        if(spawner.alpha === 1) return;
        spawner.alpha += 0.05;
        if(spawner.alpha > 1) spawner.alpha = 1;
    }
    spawner.update = spawner.makeUpdate("move", "jump", "reSpawn", "talk");

    return spawner;
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