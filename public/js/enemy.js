import vec, { sub }                         from "/js/engine/factories/vector.js";
import entity                               from "/js/engine/factories/entity.js";
import addAnimate                           from "/js/engine/factories/entity.js";
import { checkCol, checkProx }              from "/js/engine/functions/colission.js";
import { addHandleColBounce, addHandleCol } from "/js/handleCol.js";
import addHandleWater                       from "/js/handleWater.js";
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
    that.state = "silent";
    that.talked = 0;
    that.dead = false;

    addTalk(that);
    addHandleColBounce(that);
    addMove(that, {
        speed: 0.1,
        dir: -1,
        gravity: 0.01,
        oubArea: [0, 0, 900, 600],
    });
    addHandleWater(that, {
        speed: 0.05,
        jumpSpeed: 0.1,
        gravity: 0.005,
    });
    that.handleOubY = () => {
        if(that.velocity.y < 0){
            that.pos.y = 0;
            that.velocity.y = 0;
        }else that.dead = true;
    }
    that.jump = () => {
        if(that.grounded && that.velocity.y === 0){
            that.velocity.y = -that.jumpSpeed;
        }
    }
    //make talking engine
    that.handleLines = ({ player, audio }) => {
        if(that.state === "talking" && that.text){
            that.talked++;
            if(that.talked > 60) that.text = false;
        }
        if(sub(player.center, that.center).mag < that.size.x/2 + 100){
            if(that.state !== "talking"){
                that.state = "talking"
                that.talked = 0;
                that.text = that.lines[Math.floor(Math.random()*that.lines.length)];
            }
        }else that.state = "silent";
    }
    
    that.animate = () => {
        if(that.dir > 0) that.imgPos = frame2;
        else that.imgPos = frame1;
    }
    that.checkDead = ({ enemies }) => {
        if(that.dead){
            that.jumpSpeed = 0;
            that.speed = 0;
            that.alpha -= 0.01;
            if(that.alpha < 0) enemies.remove(that);
            console.log("CHECK")
        }
    }

    that.addUpdateActions("move", "jump", "handleLines", "animate", "checkDead");
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
    that.lines.push("Don't run away!", "Stay there!");
    addHandleWater(that, {speed: 0});
    
    that.look = ({ player }) => {
        if(player.pos.x > that.center.x){
            that.dir = 1;
        }else{
            that.dir = -1;
        }
    }
    that.addUpdateActions("look");

    return that;
}

export const giantJumper = (pos) => {
    const that = jumper(pos);
    that.size = vec(210, 210);
    that.jumpSpeed = 0.5;
    that.lines.push("I'll crush you!", "I am your biggest nightmare!");
    addHandleWater(that, {});

    return that;
}

export const spawner = (pos) => {
    const that = bouncer(pos);
    that.spawn = vec(that.pos.x, that.pos.y).copy();
    that.oubArea = [0, 0, 900, 660];
    that.alpha = 0;
    that.lines.push("I'm back!", "Think you can get rid of me?");

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
    const that = enemy({
        pos,
        size: vec(60, 60),
    });
    that.jumpSpeed = 0.2;
    that.speed = 0.13;
    addHandleWater(that, {});
    that.lines.push("I see you!", "I know where you are!");
    
    addHandleCol(that);

    that.follow = ({ player }) => {
        if(player.pos.x > that.pos.x + that.size.x){
            that.dir = 1;
        }
        if(player.pos.x < that.pos.x - player.size.x){
            that.dir = -1;
        }
    }
    that.addUpdateActions("follow");

    return that;
}

export const ghost = (pos) => {
    const that = giantJumper(pos);
    that.alpha = 0.8;
    that.gravity = 0;
    that.dir = 0;
    that.velocity.y = 0.2;
    that.oubArea = [0, 0, 900, 600];
    that.lines = ["BoOOoO!", "Jumpscare!!!", "RAAAAAHH!", "You live and you learn."];
    addHandleWater(that, {
        speed: 0,
        gravity: 0,
    });

    that.handleOubY = () => {
        that.velocity.y *= -1;
    }
    that.handleColissionY = undefined;
    that.handleColissionX = undefined;
    that.handleOubX = undefined;
    that.handlePlatCol = undefined;

    return that;
}

export const giantGhost = (pos) => {
    const jg = ghost(pos);
    jg.size = v(210, 210);
    jg.velocity.y = 0.2;

    return jg;
}

export default enemy;