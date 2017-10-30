import { v, add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import { obstacle, box } from "/js/obstacles.js";
import { checkProx } from "/js/colission.js";
import helper from "/js/helper.js";
import entity from "/js/entity.js";
import player from "/js/player.js";
import getAnimate from "/js/animate.js";

const createLevel = ({ map, help }, offsetX = 0) => {
    const level = {
        obstacles: [],
        helpers: matrix("checkCol", "drawText", "animate", "update"),
        points: matrix("checkCol"),
        box,
        player,
    }
    let pos;
    map.forEach((row, y) => strEach(row, (tile, x) => {
        pos = v(x*30 + offsetX, y*30);
        if(tile === "@") level.player = player(pos);
        if(tile === "B") level.box = box(pos);
        if(tile === "#") level.obstacles.push(obstacle(pos, map, -offsetX));
        if(tile === "H") level.helpers.entities.push(helper(pos, help));
        if(tile === "P") level.points.entities.push(point(v(pos.x + 5, pos.y + 5)));
    }));
    
    return level;
};

const point = (pos) => {
    const point = entity({
        pos,
        size: v(20, 20),
        img: "point",
    });

    point.checkCol = ({ player, points, audio, reload, state }) => {
        if(checkProx(point.center, [player.center], 30)){
            audio.point.load();
            audio.point.play();
            points.entities.splice(points.entities.indexOf(point), 1);
        }
    }

    return point;
}

const matrix = (...funcs) => {
    const matrix = {
        entities: [],
    };
    funcs.forEach(func => {
        matrix[func] = (WORLD) => matrix.entities.forEach(e => e[func](WORLD));
    });

    return matrix;
}

const strEach = (str, func) => {
    for(let i = 0; i < str.length; i++){
        func(str[i], i);
    }
}

export default createLevel;