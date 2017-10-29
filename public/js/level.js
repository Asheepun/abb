import { v, add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import { obstacle, box } from "/js/obstacles.js";
import helper from "/js/helper.js";
import entity from "/js/entity.js";
import player from "/js/player.js";
import getAnimate from "/js/animate.js";

const createLevel = ({ map, help }) => new Promise((resolve, reject) => {
    const level = {
        obstacles: [],
        helpers: matrix("checkCol", "drawText", "animate"),
        box,
        player,
    }
    let pos;
    map.forEach((row, y) => strEach(row, (tile, x) => {
        pos = v(x*30, y*30);
        if(tile === "@") level.player = player(pos);
        if(tile === "B") level.box = box(pos);
        if(tile === "#") level.obstacles.push(obstacle(pos, map));
        if(tile === "h") level.helpers.entities.push(helper(pos, help));
    }));
    resolve(level);
});

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