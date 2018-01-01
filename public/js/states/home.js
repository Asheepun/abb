import vec, { add, half, mul, div, sub, pipe, align, normalize, reverse } from "/js/engine/factories/vector.js";
import entity                                                             from "/js/engine/factories/entity.js";
import text                                                               from "/js/engine/factories/text.js";
import createLevel                                                        from "/js/level.js";
import button                                                             from "/js/button.js";
import helper                                                             from "/js/helper.js";
import levelTeplates                                                      from "/js/levelTemplates.js";
import { strEach, set }                                                   from "/js/level.js";

let extraPlayerState = undefined;

const setupHome = (WORLD) => {

        if(WORLD.audio.sounds.main.loop){
            WORLD.audio.stop("main");
            WORLD.audio.loop("home");
        }

        WORLD.spliceAll(
            WORLD.obstacles,
            WORLD.points,
            WORLD.buttons,
            WORLD.midground,
            WORLD.background,
            WORLD.background,
            WORLD.enemies,
        );
        WORLD.box.pos.set(-30, -30);
        const newLevel = createLevel({map: homeTemplate});
        WORLD.obstacles = newLevel.obstacles;
        WORLD.walls = newLevel.walls;
        WORLD.player = newLevel.player;
        WORLD.shadows = newLevel.shadows;
        if(extraPlayerState !== undefined) WORLD.player = extraPlayerState;
        WORLD.foreground = newLevel.foreground;
        //switch level buttons
        WORLD.midground.push(button({ 
            pos: vec(860, 360), 
            img: "buttons/arrow-right", 
            size: vec(30, 30), 
            action(){
                if(WORLD.currentLevel < localStorage.furtestLevel){
                    WORLD.currentLevel++;
                    WORLD.audio.play("yes-btn");
                }
                else{
                    WORLD.audio.play("not-btn");
                }
            } 
        }));
        WORLD.midground.push(button({ 
            pos: vec(730, 360), 
            img: "buttons/arrow-left", 
            size: vec(30, 30), 
            action(){
                if(WORLD.currentLevel > 0){
                    WORLD.currentLevel--;
                    WORLD.audio.play("yes-btn");
                }
                else{
                    WORLD.audio.play("not-btn");
                }
            } 
        }));
        //shop button
        WORLD.midground.push(button({ 
            pos: vec(330, 440), 
            img: "buttons/shop", 
            size: vec(60, 30), 
            action(){
                extraPlayerState = WORLD.player;
                WORLD.state = WORLD.states.setupShop;
            } 
        }));
        //add text credits text
        if(JSON.parse(localStorage.furtestLevel) === WORLD.levelTemplates.length-1){
            WORLD.midground.push(text({
                text: [
                    "This game is work in progress.",
                    "More content is comming in the future!",
                    "Programming and art by Gustav Almstrom.",
                    'Music by "The soft toffts".',
                ],
                pos: vec(200, 150),
                font: "game",
                fontSize: 20,
                color: "white",
            }));
        }
        //add helpers
        WORLD.midground.push(helper(vec(0, 420), "Welcome to our home!"));
        WORLD.midground.push(helper(vec(345, 480), "Can I interest you in my wares?"));
        WORLD.midground.push(helper(vec(660, 480), "When I'm done I'll get my cash at level 11."));

        WORLD.state = updateHome;
    }

    const updateHome = (WORLD, ctx) => {
        WORLD.controlPlayerKeys();
        
        WORLD.updateAll(
            WORLD.background,
            WORLD.foreground,
            WORLD.player,
            WORLD.midground,
        );
        //play current level
        if(WORLD.player.pos.y > WORLD.height + 50){
            WORLD.audio.stop("home");
            WORLD.audio.loop("main");
            extraPlayerState = undefined;
            WORLD.state = WORLD.states.setup;
        }
        
        //draw home
        ctx.save();
        ctx.scale(WORLD.c.scale, WORLD.c.scale);
        WORLD.drawAll(
            WORLD.walls,
            WORLD.obstacles,
            WORLD.midground,
            WORLD.player,
            WORLD.foreground,
        );
        //draw level switching system
        ctx.drawImage(WORLD.sprites["buttons/empty"], 760, 360, 100, 30);
        ctx.fillStyle = "#594228"
        if(WORLD.currentLevel == localStorage.furtestLevel) ctx.fillStyle = "#438a1d";
        ctx.font = "20px game";
        ctx.fillText("Level " + (WORLD.currentLevel + 1), 768, 380);
        WORLD.drawAll(WORLD.shadows);
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
    
    