import createLevel, { strEach, set } from "/js/level.js";
import getClouds from "/js/clouds.js";

    const setupSwitchLevel = (WORLD, ctx) => {
        WORLD.currentLevel++;
        if(WORLD.currentLevel >= WORLD.levelTemplates.length){
            WORLD.state = WORLD.states.setupHome;
            WORLD.currentLevel--;
        }else {
            //save level progress
            if(WORLD.currentLevel > localStorage.furtestLevel){
                localStorage.furtestLevel = WORLD.currentLevel;
            }

            //make mock world for switching animation
            const newLevel = createLevel(WORLD.levelTemplates[WORLD.currentLevel], 900);
            WORLD.helper = newLevel.helper;
            newLevel.obstacles.forEach(o => WORLD.obstacles.push(o));
            newLevel.walls.forEach(w => WORLD.walls.push(w));
            newLevel.grass.forEach(p => WORLD.grass.push(p));
            newLevel.points.forEach(p => WORLD.points.push(p));
            getClouds(15, 900).forEach(c => WORLD.clouds.push(c));
            WORLD.newSpawn = newLevel.player.pos;
            
            WORLD.state = switchLevel;
        }
    }
    
    const switchLevel = (WORLD, ctx) => {

        if(WORLD.player.alpha > 0.2) WORLD.player.alpha -= 0.05;

        //level switch logic
        WORLD.offset.x -= 7;
        if(WORLD.player.pos.x < WORLD.newSpawn.x){
            const dir = WORLD.player.pos.copy().sub(WORLD.newSpawn)
            .normalize()
            .reverse()
            .mul(5);
            WORLD.player.pos.add(dir);
            WORLD.player.fixCenter();
        }
    
        if(WORLD.offset.x <= -WORLD.width){
            WORLD.weather = "normal";
            if(Math.random() < 0.2) WORLD.weather = "rain";
            WORLD.state = WORLD.states.setup;
        }
    
        WORLD.draw(ctx);
        //make player more visible
        ctx.save();
        ctx.scale(WORLD.c.scale, WORLD.c.scale);
        ctx.translate(WORLD.offset.x, WORLD.offset.y);
        WORLD.player.draw(ctx, WORLD.sprites);
        ctx.restore();
    
    }

export default setupSwitchLevel;