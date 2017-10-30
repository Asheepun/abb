import { v, add, half, mul, div, sub, pipe, align, normalize, reverse } from "/js/vector.js";
import { makeDrawAll } from "/js/loopAll.js";
import { loadSprites, loadAudio } from "/js/loadAssets.js";
import keyboardBinder from "/js/keyboardBinder.js";
import getPointer from "/js/pointer.js";
import getClouds from "/js/clouds.js";
import player from "/js/player.js";
import entity from "/js/entity.js";
import createCanvas from "/js/canvas.js";
import createLevel from "/js/level.js";
import levelTeplates from "/js/levelTemplates.js";

const promiseAll = (...promises) => {
    return new Promise((resolve, reject) => {
        const results = [];
        promises.forEach(promise => {
            promise.then(arg => results.push(arg));
        });
        resolve(results);
    });
}

promiseAll(
    createCanvas(900, 600),
    loadSprites(
        "background1",
        "player",
        "player-jump",
        "obstacle",
        "obstacle-grass",
        "box",
        "cloud",
        "helper",
        "point",
        "grass",
    ),
    loadAudio(
        0.3,
        "jump",
        "talk",
        "point",
        "main",
    ),
).then(([ { c, ctx }, sprites, audio ]) => {

    //initialize
    const WORLD = {
        width: c.width,
        height: c.height,
        timeScl: 16,
        lastTime: 0,
        currentLevel: 0,
        offset: v(0, 0),
        state: undefined,
        newSpawn: undefined,
        sprites,
        audio,
        pointer: getPointer(c),
    };

    WORLD.drawAll = makeDrawAll(ctx, sprites);

    const keyboardBindings = keyboardBinder();

    audio.main.volume = 1;
    audio.main.loop = true;
    audio.main.play();

    const setup = () => {
        keyboardBindings.removeAll();

        //initialize level
        const newLevel = createLevel(levelTeplates[WORLD.currentLevel]);
        WORLD.player = newLevel.player;
        WORLD.box = newLevel.box;
        WORLD.obstacles = newLevel.obstacles;
        WORLD.helpers = newLevel.helpers;
        WORLD.points = newLevel.points;
        WORLD.grass = newLevel.grass;
        WORLD.clouds = getClouds();
        //add keybindings
        keyboardBindings.add("a", down => {
            if(down) WORLD.player.dir.x -= 1;
            else WORLD.player.dir.x += 1;
        });
        keyboardBindings.add("d", down => {
            if(down) WORLD.player.dir.x += 1;
            else WORLD.player.dir.x -= 1;
        });
        keyboardBindings.add("w", (down) => WORLD.player.jump(down, WORLD.audio.jump));
        
        WORLD.startingAlpha = 1;
        WORLD.offset = v(0, 0);
        WORLD.state = game;
    }

    WORLD.state = setup;
    
    const game = () => {
        
        //update logic
        WORLD.box.update(WORLD);
        WORLD.player.move(WORLD);
        WORLD.helpers.checkCol(WORLD);
        WORLD.points.checkCol(WORLD);
        WORLD.player.update();
        WORLD.clouds.update(WORLD);
        WORLD.helpers.update(WORLD);
        WORLD.player.animate(WORLD);
        WORLD.helpers.animate(WORLD);
    
        //check level end states
        if(WORLD.points.entities.length <= 0) WORLD.state = switchLevel;
        if(WORLD.player.dead) WORLD.state = setup;
    
        draw();
    }

    const draw = () => {
        ctx.save();
        ctx.translate(WORLD.offset.x, WORLD.offset.y);
        ctx.drawImage(WORLD.sprites.background1, 0, 0, WORLD.width, WORLD.height);
        ctx.drawImage(WORLD.sprites.background1, 900, 0, WORLD.width, WORLD.height);
        WORLD.drawAll(
            WORLD.box,
            WORLD.obstacles,
            WORLD.helpers.entities,
            WORLD.points.entities,
            WORLD.player,
            WORLD.grass,
            WORLD.clouds.entities,
        );
        WORLD.helpers.drawText(ctx);
        ctx.restore();

        //make shade in beginning of level
        if(WORLD.startingAlpha > 0){
            ctx.fillStyle = "black";
            ctx.globalAlpha = WORLD.startingAlpha;
            ctx.fillRect(0, 0, WORLD.width, WORLD.height);
            ctx.globalAlpha = 1;
            WORLD.startingAlpha -= 0.05;
        }
    }
    
    const switchLevel = () => {
    
        if(WORLD.offset.x === 0){
            WORLD.currentLevel++;
            //initialize level switch
            const newLevel = createLevel(levelTeplates[WORLD.currentLevel], 900);
            newLevel.obstacles.forEach(o => WORLD.obstacles.push(o));
            newLevel.grass.forEach(p => WORLD.grass.push(p));
            newLevel.helpers.entities.forEach(h => WORLD.helpers.entities.push(h));
            newLevel.points.entities.forEach(p => WORLD.points.entities.push(p));
            WORLD.newSpawn = newLevel.player.pos;
        }

        //level switch logic
        WORLD.offset.x -= 5;
        if(WORLD.player.pos.x < WORLD.newSpawn.x){
            const dir = pipe(
                sub(WORLD.player.pos, WORLD.newSpawn),
                normalize,
                reverse,
                x => mul(x, 3),
            );
            WORLD.player.pos = add(WORLD.player.pos, dir);
            WORLD.player.update();
        }
        WORLD.clouds.update(WORLD);
    
        if(WORLD.offset.x <= -900){
            WORLD.state = setup;
        }
    
        draw();
        //make player more visible
        ctx.save();
        ctx.translate(WORLD.offset.x, WORLD.offset.y);
        WORLD.player.draw(ctx, sprites);
        ctx.restore();
    
    };

    const loop = (time = 0) => {
        WORLD.timeScl = time - WORLD.lastTime;
        WORLD.lastTime = time;
        WORLD.state();
        requestAnimationFrame(loop);
    }
    
    loop();
});

