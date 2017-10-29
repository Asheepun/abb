import { v, add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import { makeDrawAll } from "/js/loopAll.js";
import { loadSprites } from "/js/loadAssets.js";
import getKeyboardBinder from "/js/keyboardBinder.js";
import getPointer from "/js/pointer.js";
import getClouds from "/js/clouds.js";
import player from "/js/player.js";
import entity from "/js/entity.js";
import createCanvas from "/js/canvas.js";
import createLevel from "/js/level.js";

const promiseAll = (...promises) => {
    return new Promise((resolve, reject) => {
        const results = [];
        promises.forEach(promise => {
            promise.then(arg => results.push(arg));
        });
        resolve(results);
    });
}

const map = [
    "..............................",
    "..............................",
    "..............................",
    "..............................",
    "......................########",
    "....................##########",
    "....................##########",
    "....................##########",
    "@...................##########",
    "...............B....##########",
    "....................##########",
    "....................##########",
    "##................############",
    "##...........#################",
    "##...........#################",
    "##...........#################",
    "###.........##################",
    "####.......###################",
    "##############################",
    "##############################",
];

promiseAll(
    createCanvas(900, 600),
    createLevel(map),
    loadSprites(
        "background1",
        "player",
        "obstacle",
        "grass",
        "box",
        "cloud",
    ),
).then(([ { c, ctx }, { tiles, box, player }, sprites ]) => {
    
    //initialize
    const WORLD = {
        timeScl: 16,
        lastTime: 0,
        player,
        box,
        tiles,
        clouds: getClouds(),
        pointer: getPointer(c),
    };
    console.log(WORLD.clouds.update);

    const drawAll = makeDrawAll(ctx, sprites);

    //add keyboard bindings
    const addKeyboardBinding = getKeyboardBinder();

    addKeyboardBinding("a", down => {
        if(down) WORLD.player.dir.x-= 1;
        else WORLD.player.dir.x += 1;
    });
    addKeyboardBinding("d", down => {
        if(down) WORLD.player.dir.x += 1;
        else WORLD.player.dir.x -= 1;
    });
    addKeyboardBinding("w", WORLD.player.jump);
    
    const loop = (time = 0) => {
        WORLD.timeScl = time - WORLD.lastTime;
        WORLD.lastTime = time;
    
        //update logic
        WORLD.box.update(WORLD);
        WORLD.player.move(WORLD);
        WORLD.player.checkBoxCol(WORLD.box);
        WORLD.player.update();
        WORLD.clouds.update(WORLD);
    
        //draw
        ctx.drawImage(sprites.background1, 0, 0, c.width, c.height);
        drawAll(
            WORLD.box,
            WORLD.tiles,
            WORLD.player,
            WORLD.clouds.entities,
        );
    
        requestAnimationFrame(loop);
    
    }
    
    loop();
});