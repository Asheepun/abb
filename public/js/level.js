import vec, { add, half, mul, div, sub, pipe, align }      from "/js/engine/factories/vector.js";
import entity                                              from "/js/engine/factories/entity.js";
import { checkProx }                                       from "/js/engine/functions/colission.js";
import getAnimate                                          from "/js/engine/functions/animate.js";
import { bouncer, jumper, spawner, giantJumper, follower } from "/js/enemy.js";
import { obstacle,  box, grass }                           from "/js/obstacles.js";
import { door, key }                                       from "/js/door.js";
import helper, { converter }                               from "/js/helper.js";
import player                                              from "/js/player.js";

const createLevel = ({ map, helps }, offsetX = 0) => {
    const that = {
        walls: set(),
        obstacles: set(),
        grass: set(),
        points: set(),
        enemies: set(),
        helpers: set(),
        box: box(vec(-30, -30)),
        player: undefined,
        deathCounter: undefined,
    }
    let help = 0;
    let pos;
    map.forEach((row, y) => strEach(row, (tile, x) => {
        pos = vec(x*30 + offsetX, y*30);
        if(tile === "@") that.player = player(pos);
        if(tile === "§") that.deathCounter = deathCounter(pos);
        if(tile === "B") that.box = box(pos);
        if(tile === "$") that.helpers.push(converter(pos));
        if(tile === "#") that.obstacles.push(obstacle(pos, map, offsetX));
        if(tile === "|") that.obstacles.push(door(pos, 1));
        if(tile === "*") that.helpers.push(key(pos, 1));
        if(tile === "I") that.obstacles.push(door(pos, 2));
        if(tile === "o") that.helpers.push(key(pos, 2));
        if(tile === "H"){
            that.helpers.push(helper(pos, helps[help]));
            help ++;
        }
        if(tile === "P") that.points.push(point(vec(pos.x + 5, pos.y + 5)));
        if(tile === "1") that.enemies.push(bouncer(pos));
        if(tile === "2") that.enemies.push(jumper(pos));
        if(tile === "3") that.enemies.push(spawner(pos));
        if(tile === "4") that.enemies.push(giantJumper(pos));
        if(tile === "5") that.enemies.push(follower(pos));
        //handle grass
        if(y !== map.length-1
        && map[y+1][x] === "#" 
        && tile !== "#") that.grass.push(grass(pos));
        //handle walls
        if(tile === ","
        //handle entities
        || ((tile === "§"
        || tile === "@"
        || tile === "H"
        || tile === "P"
        || tile === "$"
        || tile === "1"
        || tile === "2"
        || tile === "3"
        || tile === "4"
        || tile === "5"
        || tile === "6"
        || tile === "|"
        || tile === "I"
        || tile === "*"
        || tile === "o") 
        && (y !== map.length-1
        && map[y+1][x] === ","
        || y !== 0
        && map[y-1][x] === ","))) that.walls.push(entity({pos, img: "wall"}));
    }));
    
    return that;
};

const point = (pos) => {
    const that = entity({
        pos,
        size: vec(20, 20),
        img: "point",
    });

    that.checkCol = ({ player, points, audio, reload, state }) => {
        if(checkProx(that.center, [player.center], 30)){
            audio.point.load();
            audio.point.play();
            points.splice(points.indexOf(that), 1);
        }
    }
    that.addUpdateActions("checkCol");

    return that;
}

const deathCounter = (pos) => {
    const that = entity({ pos, img: "death-counter" });
    that.deaths = 0;

    that.drawDeaths = ctx => {
        ctx.fillStyle = "#5c3434";
        ctx.font = "12px game";
        if(that.deaths < 10) ctx.fillText(that.deaths, that.pos.x + 13, that.pos.y + 18);
        else if(that.deaths < 100){
            ctx.font = "10px game";
            ctx.fillText(that.deaths, that.pos.x + 10, that.pos.y + 18);
        }else {
            ctx.font = "8px game";
            ctx.fillText(that.deaths, that.pos.x + 8, that.pos.y + 18);
        }
    }

    that.addDrawingActions("drawDeaths");

    return that;
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
            if(set[i].draw) set[i].draw(ctx);
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