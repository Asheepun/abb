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
    that.update = ({ pointer, obstacles, walls, foreground, progress, offset }) => {
        if(progress.items.unlocked.find(x => x === "Box of gold")) that.img = "box-of-gold";
        let offsetPointer = vec(pointer.pos.x - offset.x, pointer.pos.y);
        if(pointer.down && !checkHover(offsetPointer, obstacles)){
            that.pos.x = align(offsetPointer.x, 30);
            that.pos.y = align(offsetPointer.y, 30); 
            if(checkHover(offsetPointer, walls)){
                that.pos.set(-30, -30);
                if(pointer.pressed) confettiParticleEffect(foreground, offsetPointer, 10, 10, 15, that.img + "-particle");
            }
            that.fixCenter();
        }
    }
    that.remove = ({ foreground }) => {
        that.pos.set(-30, -30);
        confettiParticleEffect(foreground, that.center, 10, 10, 15, that.img + "-particle");
        that.fixCenter();
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

export const confettiParticleEffect = (array, pos, xSpread = 10, ySpread = 10, amount = 15, img = "box-particle", size = 5) => {
    //pixel effect
    for(let i = 0; i <   Math.random()*amount; i++){
        const that = entity({
            pos: vec(pos.x + Math.random()*xSpread - xSpread/2, pos.y + Math.random()*ySpread - ySpread/2),
            img,
            size: vec(size, size),
            imgPos: [0, 0, size, size],
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
            
        that.addUpdateActions("fade");
        array.push(that);
    }
}