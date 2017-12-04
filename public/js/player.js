import vec, { add, half, mul, div, sub, pipe, round } from "/js/engine/factories/vector.js";
import entity                                         from "/js/engine/factories/entity.js";
import addAnimate                                     from "/js/engine/functions/animate.js";
import { checkCol, checkProx }                        from "/js/engine/functions/colission.js";
import { addHandleCol }                               from "/js/handleCol.js";
import addHandleWater                                 from "/js/handleWater.js";
import addMove                                        from "/js/move.js";

const player = (pos) => {
    const that = entity({
        pos,
        size: vec(28, 30),
        img: "player",
    });
    that.state = "still";
    that.imgDir = "right";
    that.grounded = false;
    that.dead = false;
    that.jumpSpeed = 0.8;
    
    addMove(that, {oubArea: [0, 0, 900, 700]});
    addHandleCol(that);
    addHandleWater(that, {});
    addAnimate(that, {
        delay: 4,
        handleFrames: ({ JSON, progress }) => {
            if(that.grounded){ 
                that.img = progress.items.unlocked.find(x => x === "Purple coat") ? "player-purple": "player";
                that.state = that.dir === 0 ? "still" : "moving";
            }
            else{
                that.img = progress.items.unlocked.find(x => x === "Purple coat") ? "player-jump-purple": "player-jump";
                that.state = "jumping";
            }
            if(that.dir < 0) that.imgDir = "left";
            if(that.dir > 0) that.imgDir = "right";
            return JSON.playerFrames[that.state][that.imgDir];
        }
    });

    that.jump = (WORLD) => {
        if(that.grounded){ 
            WORLD.audio.play("jump");
            that.velocity.y = -that.jumpSpeed;
        }
    }
    that.handleOubX = () => {
        if(that.velocity.x > 0) that.pos.x = 870;
        else that.pos.x = 0;
    }
    that.handleOubY = () => {
        if(that.velocity.y > 0) that.dead = true;
        else that.pos.y = 0;
        that.velocity.y = 0;
    }
    that.checkHit = ({ enemies }) => {
        for(let i = 0; i < enemies.length; i++){
            if(sub(that.center, enemies[i].center).mag < that.size.x/4 + enemies[i].size.x/2){
                that.dead = true;
            }
        }
    }
    that.rainbow = ({ progress, midground, helpers }) => {
        if(progress.items.unlocked.find(x => x === "Rainbow trail") && (that.velocity.x !== 0 || that.velocity.y !== 0)){
            rainbowParticleEffect(midground, that.center.copy(), mul(that.velocity, 0.1));
        }
    }

    that.addUpdateActions("checkHit", "rainbow", "animate");

    return that;
}

const rainbowParticleEffect = (array, pos, vel) => {
    for(let i = 0; i < Math.random()*2; i++){
        const that = entity({
            pos,
            size: vec(5, 5),
            rotation: Math.random()*360,
            img: "rainbow"
        });
        for(let i = 0; i < 3; i++){
            if(Math.random() < i*0.3) that.imgPos[0] += 5;
        }
        that.pos.y += Math.random()*10-5;
        that.pos.x += Math.random()*10-5;
        addMove(that, {
            dir: vel.x * Math.random()*5,
            gravity: vel.y * 0.01 + Math.random()*0.001,
            speed: 0.1,
        });
        that.fade = () => {
            if(that.alpha > 0){
                that.alpha -= Math.random()*0.1;
                if(that.alpha <= 0) array.splice(array.indexOf(that), 1);
            }
        }

        that.addUpdateActions("fade");

        array.push(that);
    }
}

export default player;