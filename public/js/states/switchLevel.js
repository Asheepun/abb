import createLevel, { strEach, set } from "/js/level.js";
import getClouds                     from "/js/clouds.js";

    const setupSwitchLevel = (WORLD, ctx) => {
        WORLD.currentLevel++;
        if(WORLD.currentLevel >= WORLD.levelTemplates.length){
            WORLD.state = WORLD.states.setupHome;
            WORLD.currentLevel--;
        }else {
            //save level progress
            if(WORLD.currentLevel > localStorage.furtestLevel){
                localStorage.furtestLevel = WORLD.currentLevel;
                WORLD.progress.completedLevels++;
            }

            //make mock world for switching animation
            const newLevel = createLevel(WORLD.levelTemplates[WORLD.currentLevel], 900);
            newLevel.obstacles.forEach(o => WORLD.obstacles.push(o));
            newLevel.walls.forEach(w => WORLD.walls.push(w));
            newLevel.midground.forEach(x => {
                if(x.update) for(let i = 0; i < 3; i++){
                    x.update(WORLD);//fix helper sprite
                }
                WORLD.midground.push(x)
            });
            newLevel.background.forEach(p => WORLD.background.push(p));
            newLevel.foreground.forEach(p => WORLD.foreground.push(p));
            newLevel.points.forEach(p => WORLD.points.push(p));
            newLevel.shadows.forEach(x => WORLD.shadows.push(x));
            WORLD.deathCounter = newLevel.deathCounter;
            WORLD.deathCounter.deaths = WORLD.deaths;
            if(WORLD.settings.cloudsOn) getClouds(15, 900).forEach(c => WORLD.foreground.push(c));
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
            if(Math.random() < 0.3) WORLD.weather = "rain";
            WORLD.state = WORLD.states.setup;
        }
    
        WORLD.draw(ctx, WORLD);
        //make player more visible
        ctx.save();
        ctx.scale(WORLD.c.scale, WORLD.c.scale);
        ctx.translate(WORLD.offset.x, WORLD.offset.y);
        WORLD.player.draw(ctx, WORLD);
        ctx.restore();
    
    }

export default setupSwitchLevel;