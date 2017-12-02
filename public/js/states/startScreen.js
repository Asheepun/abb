import entity from "/js/engine/factories/entity.js";
import getClouds from "/js/clouds.js";

const setupStartScreen = (WORLD) => {

    WORLD.clouds = getClouds();
    WORLD.obstacles = [];
    WORLD.grass = [];
    WORLD.box = entity({});

    WORLD.state = startScreen;
}

let startTextAlpha = 1;
let dir = "lower"

const startScreen = (WORLD, ctx) => {
    if(dir === "lower") startTextAlpha -= 0.008;
    else startTextAlpha += 0.008;
    if(startTextAlpha <= 0.2) dir = "higher";
    if(startTextAlpha >= 0.9) dir = "lower";

    WORLD.updateAll(
        WORLD.clouds,
    );


    ctx.save();
    ctx.scale(WORLD.c.scale, WORLD.c.scale);
    ctx.drawImage(WORLD.sprites["background-normal"], 0, 0, WORLD.width, WORLD.height);
    ctx.globalAlpha = startTextAlpha;
    ctx.fillStyle = "white";
    ctx.font = "40px game";
    ctx.fillText("Click to start", WORLD.width/2-140, WORLD.height/2-30);
    ctx.font = "30px game";
    ctx.fillText(`Level ${WORLD.currentLevel + 1}`, WORLD.width/2-60, WORLD.height/2+50);
    ctx.globalAlpha = 1;
    WORLD.drawAll(
        WORLD.clouds,
    );
    ctx.restore();

    if(WORLD.pointer.down){
        WORLD.audio.loop("main");
        WORLD.state = WORLD.states.setup;
    }
}

export default setupStartScreen;