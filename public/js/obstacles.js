import vec, { add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import { checkHover } from "/js/colission.js";
import entity from "/js/entity.js";
import getAnimate from "/js/animate.js";
import getMove from "/js/move.js";

export const obstacle = (pos, map, offset = 0) => {
    const that = entity({
        pos,
        img: "obstacle",
    });
    const mapPos = div(pos, 30);
    if(mapPos.y !== 0 && map[mapPos.y-1][mapPos.x+offset/30] !== "#") that.img = "obstacle-grass";

    return that;
}

export const box = (pos) => {
    const that = entity({
        pos, 
        img: "box",
    });
    that.update = ({ pointer, obstacles, walls, grass }) => {
        if(pointer.down && !checkHover(pointer.pos, obstacles)){
            that.pos.x = align(pointer.pos.x, 30);
            that.pos.y = align(pointer.pos.y, 30);
            if(checkHover(pointer.pos, walls)){
                that.pos.set(-30, -30);
                if(pointer.pressed) confettiParticleEffect(grass, pointer.pos);
            }
            that.fixCenter();
        }
    }
    return that;
}

export const grass = (pos) => {
    const that = entity({
        pos,
        img: "grass",
    });

    if(Math.random() < 0.01 
    && Math.random() < 0.01) that.img = "rare-grass";

    return that;
}

const confettiParticleEffect = (array, pos) => {
    //pixel effect
    for(let i = 0; i <   Math.random()*15; i++){
        const that = entity({
            pos: vec(pos.x + Math.random()*10 - 5, pos.y + Math.random()*10 - 5),
            img: "box-particle",
            size: vec(5, 5),
            imgPos: [0, 0, 5, 5],
            rotation: Math.random()*360,
        });
        that.move = getMove(that, {
            gravity: 0.02,
        });
        that.velocity.y = -Math.random()*0.2 - 0.1;
        if(that.pos.x > pos.x) that.dir = 1;
        else that.dir = -1;
        that.speed = Math.random()*0.1;
        let fade = 0.005;
        that.fade = () => {
            fade *= 1.2;
            that.alpha -= fade;
            if(that.alpha <= 0) that.remove();
        }
        that.remove = () => array.splice(array.indexOf(that), 1);
            
        that.update = that.makeUpdate("move", "fade");
        array.push(that);
    }
}