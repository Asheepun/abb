import entity    from "/js/engine/factories/entity.js";
import text      from "/js/engine/factories/text.js";
import vec       from "/js/engine/factories/vector.js";
import getClouds from "/js/clouds.js";

const setupStartScreen = (WORLD) => {

    WORLD.clouds = getClouds();
    WORLD.obstacles = [];
    WORLD.grass = [];
    WORLD.box = entity({});
    //start text
    WORLD.clouds.push(text({
        text: ["Click to start"],
        pos: vec(WORLD.width/2-170, WORLD.height/2-30),
        fontSize: 40,
        font: "game",
        color: "white",
        alpha: 0.9,
        blinking: true,
    }));
    WORLD.clouds.push(text({
        text: [`Level ${WORLD.currentLevel + 1}`],
        pos: vec(WORLD.width/2-70, WORLD.height/2+50),
        fontSize: 30,
        font: "game",
        color: "white",
        alpha: 0.9,
        blinking: true,
    }));

    WORLD.state = startScreen;
}

const startScreen = (WORLD, ctx) => {
    if(WORLD.pointer.down){
       // WORLD.audio.loop("main");
        WORLD.state = WORLD.states.setup;
        return;
    }

    WORLD.updateAll(
        WORLD.clouds,
    );

    ctx.save();
    ctx.scale(WORLD.c.scale, WORLD.c.scale);
    ctx.drawImage(WORLD.sprites["background-normal"], 0, 0, WORLD.width, WORLD.height);
    WORLD.drawAll(
        WORLD.clouds,
    );
    ctx.restore();
}

export default setupStartScreen;