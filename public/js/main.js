import { v, add, half, mul, div, sub, pipe, align, normalize, reverse } from "/js/vector.js";
import { makeDrawAll, makeUpdateAll, spliceAll } from "/js/loopAll.js";
import { loadSprites, loadAudio } from "/js/loadAssets.js";
import createKeys from "/js/keys.js";
import getClouds from "/js/clouds.js";
import getMove from "/js/move.js";
import player from "/js/player.js";
import entity from "/js/entity.js";
import button from "/js/button.js";
import createCanvas from "/js/canvas.js";
import createLevel, { strEach, set } from "/js/level.js";
import levelTeplates from "/js/levelTemplates.js";
import { setupHome } from "/js/home.js";

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
    createKeys(
        "w",
        "a",
        "s",
        "d",
        "W",
        "A",
        "S",
        "D",
        "h",
    ),
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
        "grass-particle",
        "enemy",
        "planks",
        "arrow-right",
        "arrow-left",
        "play-btn",
    ),
    loadAudio(
        0.3,
        "jump",
        "talk",
        "point",
        "main",
        "yes-btn",
        "not-btn",
    ),
).then(([ { c, ctx, scale, pointer }, keys, sprites, audio  ]) => {

    //initialize
    const WORLD = {
        width: 900,
        height: 600,
        scale,
        pointer,
        keys,
        sprites,
        audio,
        timeScl: (1/60)*1000,
        currentLevel: 0,
        state: undefined,
        newSpawn: undefined,
        buttons: [],
        states: {
            setupHome,
        },
        spliceAll,
    };
    if(localStorage.furtestLevel === undefined) localStorage.furtestLevel = 0;

    WORLD.drawAll = makeDrawAll(ctx, sprites);
    WORLD.updateAll = makeUpdateAll(WORLD);

    audio.main.volume = 0.5;
    audio.main.loop = true;
    audio.main.play();

    WORLD.states.setup = () => {

        //initialize level
        const newLevel = createLevel(levelTeplates[WORLD.currentLevel]);
        WORLD.player = newLevel.player;
        WORLD.box = newLevel.box;
        WORLD.obstacles = newLevel.obstacles;
        WORLD.helper = newLevel.helper;
        WORLD.enemies = newLevel.enemies;
        WORLD.points = newLevel.points;
        WORLD.grass = newLevel.grass;
        WORLD.clouds = getClouds();
        
        WORLD.startingAlpha = 1;
        WORLD.nextLevelCounter = undefined;
        if(WORLD.currentLevel > localStorage.furtestLevel) localStorage.furtestLevel = WORLD.currentLevel;
        WORLD.offset = v(0, 0);
        WORLD.state = WORLD.states.game;

    }

    WORLD.state = WORLD.states.setup;

    WORLD.controlPlayerKeys = () => {
        if(keys.a.down) WORLD.player.dir.x = -1;
        if(keys.d.down) WORLD.player.dir.x = 1;
        if(keys.a.down && keys.d.down
        || !keys.a.down && !keys.d.down) WORLD.player.dir.x = 0;
        if(keys.w.pressed){
            WORLD.player.jump(WORLD.audio.jump, WORLD);
        }else if(keys.w.upped && WORLD.player.velocity.y < 0) WORLD.player.velocity.y = 0;
    }
    
    WORLD.states.game = () => {

        //check keys
        WORLD.controlPlayerKeys();
        if(keys.h.down){
            WORLD.state = WORLD.states.setupHome;
        }

        //update logic
        WORLD.updateAll(
            WORLD.box,
            WORLD.enemies,
            WORLD.player,
            WORLD.helper,
            WORLD.points,
            WORLD.clouds,
            WORLD.grass,
        );
    
        //check level end states
        if(WORLD.points.length <= 0 && WORLD.nextLevelCounter === undefined)
            WORLD.nextLevelCounter = 4;
        if(WORLD.nextLevelCounter > 0){
            let sub = Math.round(WORLD.timeScl*100)
            WORLD.nextLevelCounter -= sub/100000;
        }
        if(WORLD.points.length <= 0 && WORLD.nextLevelCounter <= 1){
            WORLD.nextLevelCounter = undefined;
            WORLD.state = WORLD.states.switchLevel;
        }
        if(WORLD.player.dead){
            WORLD.state = WORLD.states.setup;
        }
            
    
        WORLD.draw();
    }

    WORLD.draw = () => {
        ctx.save();
        ctx.scale(WORLD.scale, WORLD.scale);
        ctx.translate(WORLD.offset.x, WORLD.offset.y);
        ctx.drawImage(WORLD.sprites.background1, 0, 0, WORLD.width, WORLD.height);
        ctx.drawImage(WORLD.sprites.background1, 900, 0, WORLD.width, WORLD.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 600, 900, 600);
        WORLD.drawAll(
            WORLD.box,
            WORLD.obstacles,
            WORLD.helper,
            WORLD.points,
            WORLD.player,
            WORLD.enemies,
            WORLD.grass,
            WORLD.clouds,
        );
        WORLD.helper.drawText(ctx);
        if(WORLD.nextLevelCounter){
            ctx.fillStyle = "red";
            ctx.font = "25px game";
            ctx.fillText(Math.floor(WORLD.nextLevelCounter), WORLD.player.center.x - 7.5, WORLD.player.pos.y-5);
        }

        //make shade in beginning of level
        if(WORLD.startingAlpha > 0){
            ctx.fillStyle = "black";
            ctx.globalAlpha = WORLD.startingAlpha;
            ctx.fillRect(0, 0, WORLD.width, WORLD.height);
            ctx.globalAlpha = 1;
            WORLD.startingAlpha -= 0.05;
        }

        ctx.restore();
    }
    
    WORLD.states.switchLevel = () => {
    
        if(WORLD.offset.x === 0){
            WORLD.currentLevel++;
            //initialize level switch
            const newLevel = createLevel(levelTeplates[WORLD.currentLevel], 900);
            WORLD.helper = newLevel.helper;
            newLevel.obstacles.forEach(o => WORLD.obstacles.push(o));
            newLevel.grass.forEach(p => WORLD.grass.push(p));
            newLevel.points.forEach(p => WORLD.points.push(p));
            WORLD.newSpawn = newLevel.player.pos;
        }

        //level switch logic
        WORLD.offset.x -= 7;
        if(WORLD.player.pos.x < WORLD.newSpawn.x){
            const dir = pipe(
                sub(WORLD.player.pos, WORLD.newSpawn),
                normalize,
                reverse,
                x => mul(x, 5),
            );
            WORLD.player.pos = add(WORLD.player.pos, dir);
            WORLD.player.fixCenter();
        }
        WORLD.updateAll(
            WORLD.clouds,
            WORLD.grass,
        );
    
        if(WORLD.offset.x <= -WORLD.width){
            WORLD.state = WORLD.states.setup;
        }
    
        WORLD.draw();
        //make player more visible
        ctx.save();
        ctx.scale(WORLD.scale, WORLD.scale);
        ctx.translate(WORLD.offset.x, WORLD.offset.y);
        WORLD.player.draw(ctx, sprites);
        ctx.restore();
    
    }

    let lastTime = 0;
    let accTime = 0;

    const loop = (time = 0) => {
        accTime += time - lastTime;
        lastTime = time;
        while(accTime > WORLD.timeScl){
            WORLD.state(WORLD, ctx);
            WORLD.pointer.pressed = false;
            WORLD.keys.reset();
            accTime -= WORLD.timeScl;
        }
        requestAnimationFrame(loop);
    }
    
    loop();
});