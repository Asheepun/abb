import vec, { add, half, mul, div, sub, pipe, align } from "/js/engine/factories/vector.js";
import entity                                         from "/js/engine/factories/entity.js";
import { checkHover }                                 from "/js/engine/functions/colission.js";
import getAnimate                                     from "/js/engine/functions/animate.js";
import addMove                                        from "/js/move.js";

export const obstacle = (pos, map, offset = 0) => {
    const that = entity({
        pos,
        img: "obstacles/900",
    });
    that.mapPos = div(pos, 30);
    if(that.mapPos.y !== 0 && map[that.mapPos.y-1][that.mapPos.x-offset/30] !== "#"){
        that.img = "grass/30";
    }

    return that;
}

export const box = (pos) => {
    const that = entity({
        pos, 
        img: "box",
    });
    that.update = ({ pointer, obstacles, walls, grass, progress }) => {
        if(progress.items.unlocked.find(x => x === "Box of gold")) that.img = "box-of-gold";
        if(pointer.down && !checkHover(pointer.pos, obstacles)){
            that.pos.x = align(pointer.pos.x, 30);
            that.pos.y = align(pointer.pos.y, 30);
            if(checkHover(pointer.pos, walls)){
                that.pos.set(-30, -30);
                if(pointer.pressed) confettiParticleEffect(grass, pointer.pos, 10, 10, 15, that.img + "-particle");
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

export const confettiParticleEffect = (array, pos, xSpread = 10, ySpread = 10, amount = 15, img = "box-particle") => {
    //pixel effect
    for(let i = 0; i <   Math.random()*amount; i++){
        const that = entity({
            pos: vec(pos.x + Math.random()*xSpread - xSpread/2, pos.y + Math.random()*ySpread - ySpread/2),
            img,
            size: vec(5, 5),
            imgPos: [0, 0, 5, 5],
            rotation: Math.random()*360,
        });
        addMove(that, {
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
            
        that.addUpdateActions("move", "fade");
        array.push(that);
    }
}