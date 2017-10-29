import { v, add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import { checkCol } from "/js/colission.js";
import entity from "/js/entity.js";
import player from "/js/player.js";

const createLevel = (map) => new Promise((resolve, reject) => {
    const level = {
        obstacles: [],
        box,
        player,
    }
    let pos;
    map.forEach((row, y) => strEach(row, (tile, x) => {
        pos = v(x*30, y*30);
        if(tile === "@") level.player = player(pos);
        if(tile === "B") level.box = box(pos);
        if(tile === "#") level.obstacles.push(obstacle(pos, map));
    }));
    resolve(level);
});

const obstacle = (pos, map) => {
    const obstacle = entity({
        pos,
        img: "obstacle",
    });
    const mapPos = div(pos, 30);
    if(map[mapPos.y-1][mapPos.x] !== "#") obstacle.img = "grass";

    return obstacle;
}

const box = (pos) => {
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

const strEach = (str, func) => {
    for(let i = 0; i < str.length; i++){
        func(str[i], i);
    }
}

export default createLevel;