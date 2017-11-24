import vec, { sub }                         from "/js/engine/factories/vector.js";
import entity                               from "/js/engine/factories/entity.js";
import addAnimate                           from "/js/engine/factories/entity.js";
import { addHandleColBounce, addHandleCol } from "/js/handleCol.js";
import addMove                              from "/js/move.js";
import addTalk                              from "/js/talk.js";

const enemy = ({ pos, size, jumpSpeed = 0.2, img = "enemy", frame1 = [0, 0, 210, 210], frame2 = [224, 0, 210, 210] }) => {
    const that = entity({
        pos,
        size,
        imgPos: frame1,
        img,
    });
    that.jumpSpeed = jumpSpeed;
    that.lines = [
        "Lil bugger!",
        "Come'ere you!",
        "You scared boy?",
        "I dare you!",
        "Twerp!",
    ];
    that.text = false;
    that.talking = false;
    that.talked = 0;

    addTalk(that, () => that.talking);
    addHandleColBounce(that);
    addMove(that, {
        speed: 0.1,
        dir: -1,
        gravity: 0.01,
    });
    that.handleOubY = () => {
        if(that.velocity.y < 0){
            that.pos.y = 0;
            that.velocity.y = 0;
        }
    }
    that.jump = () => {
        if(that.grounded){
            that.velocity.y = -that.jumpSpeed;
        }
    }
    //make talking engine
    that.handleLines = ({ player, audio }) => {
        if(that.talking && that.text){
            that.talked++;
            if(that.talked > 60) that.text = false;
        }
        if(sub(player.center, that.center).mag < that.size.x/2 + 100){
            if(!that.talking){
                that.talking = true
                that.talked = 0;
                that.text = that.lines[Math.floor(Math.random()*that.lines.length)];
            }
        }else that.talking = false;
    }
    
    that.animate = () => {
        if(that.dir > 0) that.imgPos = frame2;
        else that.imgPos = frame1;
    }

    that.addUpdateActions("move", "jump", "handleLines", "animate");
    that.addDrawingActions("talk");

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

    that.animate = ({ player, sprites }) => {
        if(player.pos.x > that.center.x){
            that.dir = 1;
            that.imgPos = [224, 0, 210, 210];
        }else{
            that.dir = -1;
            that.imgPos = [0, 0, 210, 210];
        }
    }
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
    that.spawn = vec(that.pos.x, that.pos.y).copy();
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
    that.addUpdateActions("reSpawn");

    return that;
}

export const follower = (pos) => {
    const that = jumper(pos);
    that.jumpSpeed = 0.2;
    that.speed = 0.13;

    that.lines.push("I see you!", "I know where you are!");
    
    addHandleCol(that);

    that.animate = ({ player }) => {
        if(player.pos.x > that.pos.x + that.size.x){
            that.dir = 1;
            that.imgPos = [224, 0, 210, 210];
        }
        if(player.pos.x < that.pos.x - player.size.x){
            that.dir = -1;
            that.imgPos = [0, 0, 210, 210];
        }
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