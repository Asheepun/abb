import vec, { add, half, mul, div, sub, pipe, align, normalize, reverse } from "/js/engine/factories/vector.js";
import entity                                                             from "/js/engine/factories/entity.js";
import createLevel                                                        from "/js/level.js";
import button                                                             from "/js/button.js";
import helper                                                             from "/js/helper.js";
import levelTeplates                                                      from "/js/levelTemplates.js";
import { strEach, set }                                                   from "/js/level.js";

let extraPlayerState = undefined;

const setupHome = (WORLD) => {
        WORLD.spliceAll(
            WORLD.obstacles,
            WORLD.points,
            WORLD.grass,
            WORLD.buttons,
            WORLD.helpers,
            WORLD.enemies,
        );
        WORLD.box.pos.set(-30, -30);
        const newLevel = createLevel({map: homeTemplate});
        WORLD.obstacles = newLevel.obstacles;
        WORLD.walls = newLevel.walls;
        WORLD.player = newLevel.player;
        if(extraPlayerState !== undefined) WORLD.player = extraPlayerState;
        WORLD.grass = newLevel.grass;
        WORLD.helpers.push(helper(vec(0, 420), "Welcome to our home!"));
        WORLD.helpers.push(helper(vec(345, 480), "Can I interest you in my wares?"));
        WORLD.helpers.push(helper(vec(660, 480), "When I'm done I'll get my cash at level 10."));
        //switch level buttons
        WORLD.buttons.push(button({ pos: vec(860, 360), img: "buttons/arrow-right", size: vec(30, 30), action(){
            if(WORLD.currentLevel < localStorage.furtestLevel){
                WORLD.currentLevel++;
                WORLD.audio.play("yes-btn")
            }
            else{
                WORLD.audio.play("not-btn")
            }
        } }));
        WORLD.buttons.push(button({ pos: vec(730, 360), img: "buttons/arrow-left", size: vec(30, 30), action(){
            if(WORLD.currentLevel > 0){
                WORLD.currentLevel--;
                WORLD.audio.play("yes-btn")
            }
            else{
                WORLD.audio.play("not-btn")
            }
        } }));
        //shop button
        WORLD.buttons.push(button({ pos: vec(330, 440), img: "buttons/shop", size: vec(60, 30), action(){
            extraPlayerState = WORLD.player;
            WORLD.state = WORLD.states.setupShop;
        } }));

        WORLD.state = updateHome;
    }

    const updateHome = (WORLD, ctx) => {
        WORLD.controlPlayerKeys();
        
        WORLD.updateAll(
            WORLD.player,
            WORLD.buttons,
            WORLD.helpers,
            WORLD.grass,
        );
        //play current level
        if(WORLD.player.pos.y > WORLD.height + 50){
            extraPlayerState = undefined;
            WORLD.state = WORLD.states.setup;
        }
        
        //draw home
        ctx.save();
        ctx.scale(WORLD.c.scale, WORLD.c.scale);
        WORLD.drawAll(
            WORLD.walls,
        )
        //draw info
        ctx.fillStyle = "white";
        if(JSON.parse(localStorage.furtestLevel) === WORLD.levelTemplates.length-1){
            ctx.font = "20px game";
            ctx.fillText("This game is work in progress.", 200, 150);
            ctx.fillText("More content is comming in the future!", 200, 180);
            ctx.fillText("Programming and art by Gustav Almstrom.", 200, 210);
            ctx.fillText('Music by "The soft toffts".', 200, 240);
        }
        WORLD.drawAll(
            WORLD.obstacles,
            WORLD.buttons,
            WORLD.helpers,
            WORLD.player,
            WORLD.grass,
        );
        //draw level switching system
        ctx.drawImage(WORLD.sprites["buttons/empty"], 760, 360, 100, 30);
        ctx.fillStyle = "#594228"
        if(WORLD.currentLevel == localStorage.furtestLevel) ctx.fillStyle = "#438a1d";
        ctx.font = "20px game";
        ctx.fillText("Level " + (WORLD.currentLevel + 1), 768, 380);
        ctx.restore();

    }
    
const homeTemplate = [
    "##############################",
    "##############################",
    "##############################",
    "########,,,,,,,,,,,,,,########",
    "######,,,,,,,,,,,,,,,,,,######",
    "####,,,,,,,,,,,,,,,,,,,,,,,,,,",
    "##,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
    ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
    ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
    ",,,,,,,,,,,,,,,,,,,,,,,,,,@,,,",
    ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
    ",,,,,,,,,,,,,,,,,,,,,,,,######",
    ",,,,,,,,,,,,,,,,,,,,,,,#######",
    ",,,,,,,,,,,,,,,,,,,,,,,#######",
    ",,,,,,,,,,,,,,,,,,,,,,,,,,,###",
    "###,,,,,,,,,,,,,,,,,,,,,,,,,,#",
    "#####,,,,,,,,,,,,,,,,,,##,,,,#",
    "#########################,,,,#",
    "#########################,,,,#",
    "#########################,,,,#",
];

export default setupHome;
    
    