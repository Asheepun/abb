import { v, add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import { makeDrawAll } from "/js/loopAll.js";
import { loadSprites, loadAudio } from "/js/loadAssets.js";
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
    ".....................#########",
    "....................h#########",
    "##................############",
    "##...........#################",
    "##...........#################",
    "##...........#################",
    "###.........##################",
    "####.......###################",
    "##############################",
    "##############################",
];

const template = {
    map,
    help: "Click to move the box",
};

promiseAll(
    createCanvas(900, 600),
    createLevel(template),
    loadSprites(
        "background1",
        "player",
        "player-jump",
        "obstacle",
        "grass",
        "box",
        "cloud",
        "helper",
    ),
    loadAudio(
        0.5,
        "jump",
        "talk"
    ),
).then(([ { c, ctx }, { obstacles, helpers, box, player }, sprites, audio ]) => {

    //initialize
    const WORLD = {
        timeScl: 16,
        lastTime: 0,
        sprites,
        audio,
        player,
        box,
        obstacles,
        helpers,
        clouds: getClouds(),
        pointer: getPointer(c),
    };

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
    addKeyboardBinding("w", (down) => WORLD.player.jump(down, audio.jump));
    
    const loop = (time = 0) => {
        WORLD.timeScl = time - WORLD.lastTime;
        WORLD.lastTime = time;
    
        //update logic
        WORLD.box.update(WORLD);
        WORLD.player.move(WORLD);
        WORLD.player.update();
        WORLD.helpers.checkCol(WORLD);
        WORLD.clouds.update(WORLD);
        WORLD.player.animate(WORLD);
        WORLD.helpers.animate(WORLD);
    
        //draw
        ctx.drawImage(sprites.background1, 0, 0, c.width, c.height);
        drawAll(
            WORLD.box,
            WORLD.obstacles,
            WORLD.helpers.entities,
            WORLD.player,
            WORLD.clouds.entities,
        );
        WORLD.helpers.drawText(ctx);
    
        requestAnimationFrame(loop);
    
    }
    
    loop();
});