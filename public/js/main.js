import vec, { add, half, mul, div, sub, pipe, align, normalize, reverse } from "/js/vector.js";
import { makeDrawAll, makeUpdateAll, spliceAll } from "/js/loopAll.js";
import levelTemplates from "/js/levelTemplates.js";
import { loadSprites, loadAudio, loadJSON } from "/js/loadAssets.js";
import setupHome from "/js/home.js";
import setupShop, { emptyProgress, updateProgress } from "/js/shop.js";
import setupSwitchLevel from "/js/switchLevel.js";
import createKeys from "/js/keys.js";
import getClouds from "/js/clouds.js";
import getRain from "/js/rain.js";
import getMove from "/js/move.js";
import player from "/js/player.js";
import entity from "/js/entity.js";
import button from "/js/button.js";
import createCanvas from "/js/canvas.js";
import createLevel, { strEach, set } from "/js/level.js";

//error message
document.getElementById("no-modules").style.display = "none";

const levelImgs = [
    "levels/level_1",
    "levels/level_2",
    "levels/level_3",
    "levels/level_4",
    "levels/level_5",
    "levels/level_6",
    "levels/level_7",
    "levels/level_8",
    "levels/level_9",
    "levels/level_10",
    "levels/level_11",
    "levels/level_12",
    "levels/level_13",
    "levels/level_14",
    "levels/level_15",
    "levels/level_16",
    "levels/level_17",
];

const buttonIgs = [
    "buttons/arrow-right",
    "buttons/arrow-left",
    "buttons/play",
    "buttons/exit",
    "buttons/shop",
    "buttons/convert",
];

Promise.all([
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
        "H",
    ),
    loadSprites(
        "background-normal",
        "background-rain",
        "player",
        "player-jump",
        "player-purple",
        "player-jump-purple",
        "obstacle",
        "obstacle-grass",
        "wall",
        "box",
        "box-particle",
        "cloud",
        "helper",
        "helper-big",
        "point",
        "grass",
        "rare-grass",
        "grass-particle",
        "enemy",
        "death-counter",
        "rain",
        "door",
        "door-button",
        "rainbow",
        ...buttonIgs,
        ...levelImgs,
    ),
    loadAudio(
        0.3,
        "jump",
        "talk",
        "point",
        "main",
        "yes-btn",
        "not-btn",
        "door-btn",
        "enemy",
    ),
    loadJSON(
        "playerFrames",
        "helperFrames",
    ),
]).then(([ { c, ctx, scale, pointer }, keys, sprites, audio, resJSON  ]) => {

    //initialize
    const WORLD = {
        c,
        width: 900,
        height: 600,
        pointer,
        keys,
        sprites,
        audio,
        JSON: resJSON,
        timeScl: (1/60)*1000,
        state: undefined,
        newSpawn: undefined,
        spliceAll,
        deaths: 0,
        buttons: [],
        states: {
            setupHome,
            setupShop,
            setupSwitchLevel,
        },
        levelTemplates,
        currentLevel: 0,
        weather: "normal",
        saveProgress(){
            localStorage.progress = JSON.stringify(WORLD.progress);
        }
    };
    //handle progress
    if(localStorage.progress === undefined){
        localStorage.clear();
        localStorage.progress = JSON.stringify(emptyProgress());
    }
    WORLD.progress = JSON.parse(localStorage.progress);
    updateProgress(WORLD.progress);

    if(localStorage.furtestLevel === undefined) localStorage.furtestLevel = 0;

    WORLD.drawAll = makeDrawAll(ctx, WORLD);
    WORLD.updateAll = makeUpdateAll(WORLD);

    audio.main.volume = 0.5;
    audio.main.loop = true;
    audio.main.play();

    WORLD.states.setup = () => {

        //initialize level
        WORLD.buttons = [];
        const newLevel = createLevel(WORLD.levelTemplates[WORLD.currentLevel]);
        WORLD.player = newLevel.player;
        WORLD.box = newLevel.box;
        WORLD.obstacles = newLevel.obstacles;
        WORLD.walls = newLevel.walls;
        WORLD.helpers = newLevel.helpers;
        WORLD.enemies = newLevel.enemies;
        WORLD.points = newLevel.points;
        WORLD.grass = newLevel.grass;
        WORLD.deathCounter = newLevel.deathCounter;
        WORLD.deathCounter.deaths = WORLD.deaths;
        WORLD.clouds = getClouds();
        WORLD.rain = getRain();
        
        WORLD.startingAlpha = 1;
        WORLD.nextLevelCounter = undefined;
        WORLD.offset = vec(0, 0);

        WORLD.state = WORLD.states.game;

    }

    WORLD.state = WORLD.states.setup;

    WORLD.controlPlayerKeys = () => {
        if(keys.a.down || keys.A.down) WORLD.player.dir = -1;
        if(keys.d.down || keys.D.down) WORLD.player.dir = 1;
        if((keys.a.down && keys.d.down
        || !keys.a.down && !keys.d.down)
        && (keys.A.down && keys.D.down
        || !keys.A.down && !keys.D.down)) WORLD.player.dir = 0;
        if(keys.w.pressed || keys.W.pressed){
            WORLD.player.jump(WORLD.audio.jump, WORLD);
        }else if((keys.w.upped || keys.W.upped) && WORLD.player.velocity.y < 0) WORLD.player.velocity.y = 0;
    }
    
    WORLD.states.game = () => {

        //check keys
        WORLD.controlPlayerKeys();
        if(keys.h.down || keys.H.down){
            WORLD.state = WORLD.states.setupHome;
        }

        //update logic
        WORLD.updateAll(
            WORLD.box,
            WORLD.enemies,
            WORLD.player,
            WORLD.helpers,
            WORLD.points,
            WORLD.clouds,
            WORLD.grass,
            WORLD.weather === "rain" ? WORLD.rain :[],
            WORLD.walls,
            WORLD.buttons,
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
            WORLD.state = WORLD.states.setupSwitchLevel;
        }
        if(WORLD.player.dead){
            WORLD.state = WORLD.states.setup;
            WORLD.deaths++;
        }
            
    
        WORLD.draw();
    }

    WORLD.draw = () => {
        ctx.save();
        ctx.scale(c.scale, c.scale);
        ctx.translate(WORLD.offset.x, WORLD.offset.y);
        ctx.drawImage(WORLD.sprites["background-" + WORLD.weather], 0, 0, WORLD.width, WORLD.height);
        ctx.drawImage(WORLD.sprites["background-" + WORLD.weather], 900, 0, WORLD.width, WORLD.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 600, 900, 600);
        WORLD.drawAll(
            WORLD.weather === "rain" ? WORLD.rain :[],
            WORLD.walls,
            WORLD.box,
            WORLD.obstacles,
            WORLD.buttons,
            WORLD.helpers,
            WORLD.deathCounter,
            WORLD.points,
            WORLD.player,
            WORLD.enemies,
            WORLD.grass,
            WORLD.clouds,
        );
        //draw nextLevelCounter
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
        //darken on rainy days
        if(WORLD.weather === "rain"){
            ctx.fillStyle = "black";
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0, 0, c.width*2, c.height*2);
            ctx.globalAlpha = 1;
        }

        ctx.restore();
    }

    let lastTime = 0;
    let accTime = 0;
    let lastState = undefined;

    const loop = (time = 0) => {
        accTime += time - lastTime;
        lastTime = time;
        while(accTime > WORLD.timeScl){
            if(lastState !== WORLD.state) WORLD.saveProgress();
            lastState = WORLD.state;
            WORLD.state(WORLD, ctx);
            WORLD.pointer.pressed = false;
            WORLD.keys.reset();
            accTime -= WORLD.timeScl;
        }
        requestAnimationFrame(loop);
    }
    
    loop();
});