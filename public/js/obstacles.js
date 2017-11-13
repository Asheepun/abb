import { v, add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import { checkHover } from "/js/colission.js";
import entity from "/js/entity.js";
import getAnimate from "/js/animate.js";
import getMove from "/js/move.js";

export const obstacle = (pos, map, offset = 0) => {
    const obstacle = entity({
        pos,
        img: "obstacle",
    });
    const mapPos = div(pos, 30);
    if(mapPos.y !== 0 && map[mapPos.y-1][mapPos.x+offset/30] !== "#") obstacle.img = "obstacle-grass";

    return obstacle;
}

export const box = (pos) => {
    const box = entity({
        pos, 
        img: "box",
    });
    box.update = ({ pointer, obstacles, walls, grass }) => {
        if(pointer.down && !checkHover(pointer.pos, obstacles)){
            box.pos.x = align(pointer.pos.x, 30);
            box.pos.y = align(pointer.pos.y, 30);
            if(checkHover(pointer.pos, walls)){
                box.pos = v(-30, -30);
                if(pointer.pressed) confettiParticleEffect(grass, pointer.pos);
            }
            box.fixCenter();
        }
    }
    return box;
}

export const grass = (pos) => {
    const grass = entity({
        pos,
        img: "grass",
    });

    if(Math.random() < 0.01 
    && Math.random() < 0.01) grass.img = "rare-grass";

    return grass;
}

const confettiParticleEffect = (array, pos) => {
    //pixel effect
    for(let i = 0; i <   Math.random()*15; i++){
        const pixel = entity({
            pos: v(pos.x + Math.random()*10 - 5, pos.y + Math.random()*10 - 5),
            img: "box-particle",
            size: v(5, 5),
            imgPos: [0, 0, 5, 5],
            rotation: Math.random()*360,
        });
        pixel.move = getMove(pixel, {
            gravity: 0.02,
        });
        pixel.velocity.y = -Math.random()*0.2 - 0.1;
        if(pixel.pos.x > pos.x) pixel.dir = 1;
        else pixel.dir = -1;
        pixel.speed = Math.random()*0.1;
        let fade = 0.005;
        pixel.fade = () => {
            fade *= 1.2;
            pixel.alpha -= fade;
            if(pixel.alpha <= 0) pixel.remove();
        }
        pixel.remove = () => array.splice(array.indexOf(pixel), 1);
            
        pixel.update = pixel.makeUpdate("move", "fade");
        array.push(pixel);
    }
}