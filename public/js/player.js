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
        handleFrames: ({ playerFrames }) => {
            if(that.grounded){ 
                that.img = "player";
                that.state = that.dir === 0 ? "still" : "moving";
            }
            else{ 
                that.img = "player-jump";
                that.state = "jumping";
            }
            if(that.dir < 0) that.imgDir = "left";
            if(that.dir > 0) that.imgDir = "right";
            return playerFrames[that.state][that.imgDir];
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
    that.update = that.makeUpdate("move", "checkHit", "animate");

    return that;
}


export default player;