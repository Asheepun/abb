import { v, add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import entity from "/js/entity.js";
import getAnimate from "/js/animate.js";

export const obstacle = (pos, map) => {
    const obstacle = entity({
        pos,
        img: "obstacle",
    });
    const mapPos = div(pos, 30);
    if(map[mapPos.y-1][mapPos.x] !== "#") obstacle.img = "grass";

    return obstacle;
}

export const box = (pos) => {
    const box = entity({
        pos, 
        img: "box",
    });
    box.update = ({ pointer, obstacles }) => {
        let col = false;
        for(let i = 0; i < obstacles.length; i++){
            if(pointer.pos.x >= obstacles[i].pos.x
            && pointer.pos.x <= obstacles[i].pos.x + obstacles[i].size.x
            && pointer.pos.y >= obstacles[i].pos.y
            && pointer.pos.y <= obstacles[i].pos.y + obstacles[i].size.y) col = true;
        }
        if(pointer.down && !col){
            box.pos.x = align(pointer.pos.x, 30);
            box.pos.y = align(pointer.pos.y, 30);
            box.center = add(box.pos, half(box.size));
        }
    }
    return box;
}