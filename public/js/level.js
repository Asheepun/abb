import { v, add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import { bouncer, jumper, spawner, giantJumper, ghost, giantGhost } from "/js/enemy.js";
import { obstacle,  box } from "/js/obstacles.js";
import { checkProx } from "/js/colission.js";
import helper from "/js/helper.js";
import entity from "/js/entity.js";
import player from "/js/player.js";
import getAnimate from "/js/animate.js";

const createLevel = ({ map, help }, offsetX = 0) => {
    const level = {
        obstacles: set(),
        grass: set(),
        points: set(),
        enemies: set(),
        box: box(),
        helper: helper(),
        player: undefined,
        deathCounter: undefined,
    }
    let enemy = 0;
    let pos;
    map.forEach((row, y) => strEach(row, (tile, x) => {
        pos = v(x*30 + offsetX, y*30);
        if(tile === "@") level.player = player(pos);
        if(tile === "§") level.deathCounter = deathCounter(pos);
        if(tile === "B") level.box = box(pos);
        if(tile === "#") level.obstacles.push(obstacle(pos, map, -offsetX));
        if(tile === "H") level.helper = helper(pos, help);
        if(tile === "P") level.points.push(point(v(pos.x + 5, pos.y + 5)));
        if(tile === "1") level.enemies.push(bouncer(pos));
        if(tile === "2") level.enemies.push(jumper(pos));
        if(tile === "3") level.enemies.push(spawner(pos));
        if(tile === "4") level.enemies.push(giantJumper(pos));
        if(tile === "5") level.enemies.push(ghost(pos));
        if(tile === "6") level.enemies.push(giantGhost(pos));
        if(y !== map.length-1
        && map[y+1][x] === "#" 
        && tile !== "#") level.grass.push(grass(pos));
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
            points.splice(points.indexOf(point), 1);
        }
    }
    point.update = point.makeUpdate("checkCol");

    return point;
}

const grass = (pos) => {
    const grass = entity({
        pos,
        img: "grass",
    });

    grass.animate = getAnimate(grass, { 
        delay: 12, 
        frames: [
            /*[0, 0, 30, 30],
            [32, 0, 30, 30],
            [64, 0, 30, 30],
            //[96, 0, 30, 30],
            //[64, 0, 30, 30],
            [32, 0, 30, 30],
        */]
    });

    grass.update = grass.makeUpdate("animate");

    return grass;
}

const deathCounter = (pos) => {
    const deathCounter = entity({ pos, img: "death-counter" });
    deathCounter.deaths = 0;

    deathCounter.addDrawingAction(
        (ctx) => {
            ctx.fillStyle = "#5c3434";
            ctx.font = "12px game";
            if(deathCounter.deaths < 10) ctx.fillText(deathCounter.deaths, deathCounter.pos.x + 13, deathCounter.pos.y + 18);
            else if(deathCounter.deaths < 100){
                ctx.font = "10px game";
                ctx.fillText(deathCounter.deaths, deathCounter.pos.x + 10, deathCounter.pos.y + 18);
            }else {
                ctx.font = "8px game";
                ctx.fillText(deathCounter.deaths, deathCounter.pos.x + 8, deathCounter.pos.y + 18);
            }
        }
    );

    return deathCounter;
}

export const set = () => {
    const set = [];

    set.update = (WORLD) => {
        for(let i = 0; i < set.length; i++){
            if(set[i].update) set[i].update(WORLD);
        }
    }
    set.draw = (ctx) => {
        for(let i = 0; i < set.length; i++){
            set[i].update(ctx);
        }
    }
    return set;
}

export const strEach = (str, func) => {
    for(let i = 0; i < str.length; i++){
        func(str[i], i);
    }
}

export default createLevel;