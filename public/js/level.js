import vec, { add, half, mul, div, sub, pipe, align }             from "/js/engine/factories/vector.js";
import entity                                                     from "/js/engine/factories/entity.js";
import { bouncer, jumper, spawner, giantJumper, follower, ghost } from "/js/enemy.js";
import { obstacle,  box, grass }                                  from "/js/obstacles.js";
import { door, key }                                              from "/js/door.js";
import helper, { converter }                                      from "/js/helper.js";
import player                                                     from "/js/player.js";
import waterStream                                                from "/js/water.js";
import { point, movingPoint }                                     from "/js/point.js";

const createLevel = ({ map, helps }, offsetX = 0) => {
    const that = {
        background: set(),
        walls: set(),
        obstacles: set(),
        box: box(vec(-30, -30)),
        deathCounter: undefined,
        points: set(),
        midground: set(),
        player: undefined,
        enemies: set(),
        foreground: set(),
        water: set(),
    }
    let help = 0;
    let pos;
    map.forEach((row, y) => strEach(row, (tile, x) => {
        pos = vec(x*30 + offsetX, y*30);
        if(tile === "@") that.player = player(pos);
        if(tile === "§") that.deathCounter = deathCounter(pos);
        if(tile === "B") that.box = box(pos);
        if(tile === "$") that.midground.push(converter(pos));
        if(tile === "#") that.obstacles.push(obstacle(pos, map, offsetX));
        if(tile === "|") that.obstacles.push(door(pos, 1));
        if(tile === "*") that.midground.push(key(pos, 1));
        if(tile === "I") that.obstacles.push(door(pos, 2));
        if(tile === "o") that.midground.push(key(pos, 2));
        if(tile === "<") that.water.push(waterStream(pos, -1));
        if(tile === ">") that.water.push(waterStream(pos, 1));
        if(tile === "H"){
            that.midground.push(helper(pos, helps[help]));
            help ++;
        }
        if(tile === "P") that.points.push(point(vec(pos.x + 5, pos.y + 5)));
        if(tile === "p") that.points.push(movingPoint(vec(pos.x + 5, pos.y + 5)));
        if(tile === "1") that.enemies.push(bouncer(pos));
        if(tile === "2") that.enemies.push(jumper(pos));
        if(tile === "3") that.enemies.push(spawner(pos));
        if(tile === "4") that.enemies.push(giantJumper(pos));
        if(tile === "5") that.enemies.push(follower(pos));
        if(tile === "6") that.enemies.push(ghost(pos));
        //handle grass
        if(y !== map.length-1
        && map[y+1][x] === "#" 
        && tile !== "#") that.foreground.push(grass(pos));
        //handle walls
        if((tile === ","
        || (y !== 0 && map[y-1][x] === ",")
        || (y !== map.length-1 && map[y+1][x] === ","))
        && tile !== "#"
        && tile !== ".") that.walls.push(entity({pos: pos.copy(), img: "walls/30"}));
    }));

    //group obstacles
    that.obstacles.filter(x => x.mapPos && x.mapPos.y !== 0 && map[x.mapPos.y-1][x.mapPos.x] === "#")
    .forEach(o1 => {
        const arr = that.obstacles.filter(o2 => {
            if(o1.pos.y === o2.pos.y
            && o1 !== o2 
            && o1.pos.x + o1.size.x === o2.pos.x
            && (o2.mapPos.y !== 0 && map[o2.mapPos.y-1][o2.mapPos.x] === "#")){
                o1.size.x += o2.size.x;
                o1.fixCenter();
                o1.fixImgPos();
                o1.img = "obstacles/" + o1.size.x;
                return true;
            }
            return false;
        });
        arr.forEach(x => that.obstacles.splice(that.obstacles.indexOf(x), 1));
    });
    //group walls
    that.walls.forEach(w1 => {
        const arr = that.walls.filter(w2 => {
            if(w1.pos.y === w2.pos.y
            && w1 !== w2 
            && w1.pos.x + w1.size.x === w2.pos.x){
                w1.size.x += w2.size.x;
                w1.fixCenter();
                w1.fixImgPos();
                w1.img = "walls/" + w1.size.x;
                return true;
            }
            return false;
        });
        arr.forEach(x => that.walls.splice(that.walls.indexOf(x), 1));
    });
    //group obstacle grass
    if(offsetX === 0){
        that.obstacles.filter(x => x.mapPos && x.mapPos.y !== 0 && map[x.mapPos.y-1][x.mapPos.x] !== "#")
        .forEach(o1 => {
            const arr = that.obstacles.filter(o2 => {
                if(o1.pos.y === o2.pos.y
                && o1 !== o2 
                && o1.pos.x + o1.size.x === o2.pos.x
                && (o2.mapPos.y !== 0 && map[o2.mapPos.y-1][o2.mapPos.x] !== "#")){
                    o1.size.x += o2.size.x;
                    o1.fixCenter();
                    o1.fixImgPos();
                    o1.img = "grass/" + o1.size.x;
                    return true;
                }
                return false;
            });
            arr.forEach(x => that.obstacles.splice(that.obstacles.indexOf(x), 1));
        });
    }
    
    return that;
};

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
    set.remove = (x) => set.splice(set.indexOf(x), 1);
    return set;
}

export const strEach = (str, func) => {
    for(let i = 0; i < str.length; i++){
        func(str[i], i);
    }
}

export default createLevel;