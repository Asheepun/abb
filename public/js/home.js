import vec, { add, half, mul, div, sub, pipe, align, normalize, reverse } from "/js/vector.js";
import createLevel from "/js/level.js";
import entity from "/js/entity.js";
import button from "/js/button.js";
import helper from "/js/helper.js";
import levelTeplates from "/js/levelTemplates.js";
import { strEach, set } from "/js/level.js";

const setupHome = (WORLD) => {
        WORLD.spliceAll(
            WORLD.obstacles,
            WORLD.points,
            WORLD.grass,
            WORLD.buttons,
            WORLD.helpers,
            WORLD.enemies,
        );
        const newLevel = createLevel({map: homeTemplate});
        WORLD.obstacles = newLevel.obstacles;
        WORLD.walls = newLevel.walls;
        WORLD.player = newLevel.player;
        WORLD.grass = newLevel.grass;
        WORLD.helpers.push(helper(vec(0, 420), "Welcome to our home!"));
        WORLD.helpers.push(helper(vec(345, 480), "Can I interest you in my wares?"));
        WORLD.helpers.push(helper(vec(660, 480), "When I'm done I'll get my cash at level 10."));
        //switch level buttons
        WORLD.buttons.push(button({ pos: vec(840, 300), img: "buttons/arrow-right", size: vec(30, 30), action(){
            if(WORLD.currentLevel < localStorage.furtestLevel){
                WORLD.currentLevel++;
                WORLD.audio["yes-btn"].load();
                WORLD.audio["yes-btn"].play();
            }
            else{
                WORLD.audio["not-btn"].load();
                WORLD.audio["not-btn"].play();
            }
        } }));
        WORLD.buttons.push(button({ pos: vec(750, 300), img: "buttons/arrow-left", size: vec(30, 30), action(){
            if(WORLD.currentLevel > 0){
                WORLD.currentLevel--;
                WORLD.audio["yes-btn"].load();
                WORLD.audio["yes-btn"].play();
            }
            else{
                WORLD.audio["not-btn"].load();
                WORLD.audio["not-btn"].play();
            }
        } }));
        //play button
        WORLD.buttons.push(button({ pos: vec(780, 300), img: "buttons/play", size: vec(60, 30), action(){
            WORLD.state = WORLD.states.setup;
        } }));
        //shop button
        WORLD.buttons.push(button({ pos: vec(330, 440), img: "buttons/shop", size: vec(60, 30), action(){
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
        
        //draw home
        ctx.save();
        ctx.scale(WORLD.c.scale, WORLD.c.scale);
        WORLD.drawAll(
            WORLD.walls,
        )
        //draw level switching system
        ctx.fillStyle = "white";
        ctx.font = "30px game";
        ctx.fillText("Level " + (WORLD.currentLevel + 1), 755, 290);
        ctx.drawImage(WORLD.sprites["levels/level_" + (WORLD.currentLevel + 1)],
            780, 220, 60, 40,
        );
        //draw info
        if(JSON.parse(localStorage.furtestLevel) === WORLD.levelTemplates.length-1){
            ctx.font = "20px game";
            ctx.fillText("This game is work in progress.", 200, 150);
            ctx.fillText("More content is comming in the future!", 200, 180);
            ctx.fillText("Programming by Gustav Almstrom.", 200, 210);
            ctx.fillText('Music by "The soft toffts".', 200, 240);
        }
        WORLD.drawAll(
            WORLD.obstacles,
            WORLD.buttons,
            WORLD.helpers,
            WORLD.player,
            WORLD.grass,
        );
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
    ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
    ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
    ",,,,,,,,,,,,,,,,,,,,,,,,,,a,,,",
    ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
    ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
    ",,,,,,,,,,,,,,,,,,,,,,,#######",
    "###,,,,,,,,,,,,,,,,,,,,#######",
    "#####,,,,,,,,,,,,,,,,,,#######",
    "##############################",
    "##############################",
    "##############################",
];

export default setupHome;
    
    