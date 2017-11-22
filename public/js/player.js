import vec, { add, half, mul, div, sub, pipe, round } from "/js/vector.js";
import getMove from "/js/move.js";
import entity from "/js/entity.js";
import getAnimate from "/js/animate.js";
import { checkCol, checkProx } from "/js/colission.js";

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
    
    that.move = getMove(that, {oubArea: [0, 0, 900, 700]});

    that.animate = getAnimate(that, {
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

    that.jump = (sound, WORLD) => {
        if(that.grounded){ 
            sound.load();
            sound.play();
            that.velocity.y = -0.8
        }
    }
    that.handleColissionX = (object) => {
        if(that.velocity.x > 0) that.pos.x = object.pos.x - that.size.x;
        else that.pos.x = object.pos.x + object.size.x;
    }
    that.handleColissionY = (object) => {
        if(that.velocity.y > 0){
            that.grounded = true;
            that.pos.y = object.pos.y - that.size.y;
            that.pos = round(that.pos);
        }else that.pos.y = object.pos.y + object.size.y;
        that.velocity.y = 0;
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
    that.handlePlatCol = (object) => {
        if(that.velocity.y > 0){
            that.pos.y = object.pos.y - that.size.y;
            that.grounded = true;
            that.velocity.y = 0;
            that.pos = round(that.pos);
        }
    }
    that.checkHit = ({ enemies }) => {
        for(let i = 0; i < enemies.length; i++){
            if(sub(that.center, enemies[i].center).mag < that.size.x/4 + enemies[i].size.x/2){
                that.dead = true;
            }
        }
    }
    that.rainbow = ({ progress, grass, helpers }) => {
        if(progress.items.unlocked.find(x => x === "Rainbow trail") && (that.velocity.x !== 0 || that.velocity.y !== 0)){
            rainbowParticleEffect(helpers, that.center.copy(), mul(that.velocity, 0.1));
        }
    }
    that.update = that.getUpdate("move", "checkHit", "rainbow", "animate");

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
        that.move = getMove(that, {
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

        that.update = that.getUpdate("move", "fade");

        array.push(that);
    }
}

export default player;