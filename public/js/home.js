import vec, { add, half, mul, div, sub, pipe, align, normalize, reverse } from "/js/vector.js";
import entity from "/js/entity.js";
import player from "/js/player.js";
import helper from "/js/helper.js";
import button from "/js/button.js";
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
        homeTemplate.forEach((row, y) => strEach(row, (tile, x) => {
            if(tile === "#") WORLD.obstacles.push(entity({pos: vec(x*30, y*30), img: "planks"}));
        }));
        WORLD.player = player(vec(780, 330));
        WORLD.helpers.push(helper(vec(0, 480), "Welcome home!"));
        //switch level buttons
        WORLD.buttons.push(button({ pos: vec(840, 300), img: "arrow-right", size: vec(30, 30), action(){
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
        WORLD.buttons.push(button({ pos: vec(750, 300), img: "arrow-left", size: vec(30, 30), action(){
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
        WORLD.buttons.push(button({ pos: vec(780, 300), img: "play-btn", size: vec(60, 30), action(){
            WORLD.state = WORLD.states.setup;
        } }));

        WORLD.state = updateHome;
    }

    const updateHome = (WORLD, ctx) => {
        WORLD.controlPlayerKeys();
        
        WORLD.updateAll(
            WORLD.player,
            WORLD.buttons,
            WORLD.helpers,
        );
        
        //draw home
        ctx.save();
        ctx.scale(WORLD.c.scale, WORLD.c.scale);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WORLD.width, WORLD.height);
        WORLD.drawAll(WORLD.obstacles);
        //draw level switching system
        ctx.fillStyle = "white";
        ctx.font = "30px game";
        ctx.fillText("Level " + (WORLD.currentLevel + 1), 755, 290);
        ctx.drawImage(WORLD.sprites["levels/level_" + (WORLD.currentLevel + 1)],
            780, 220, 60, 40,
        );
        //draw info
        ctx.font = "20px game";
        ctx.fillText("This game is work in progress.", 200, 150);
        ctx.fillText("More content is comming in the future!", 200, 180);
        ctx.fillText("Programming by Gustav Almstrom.", 200, 210);
        ctx.fillText('Music by "The soft toffts".', 200, 240);
        ctx.font = "30px game";
        ctx.fillText('Press "H" in any level.', 200, 300);
        ctx.fillText('to return here.', 200, 335);
        WORLD.drawAll(
            WORLD.buttons,
            WORLD.helpers,
            WORLD.player,
        );
        ctx.restore();

    }
    
const homeTemplate = [
    "##############################",
    "##############################",
    "##############################",
    "########..............########",
    "######..................######",
    "####..........................",
    "##............................",
    "..............................",
    "..............................",
    "..............................",
    "..............................",
    "..............................",
    "..............................",
    "..............................",
    ".......................#######",
    ".......................#######",
    "......................H#######",
    "##############################",
    "##############################",
    "##############################",
];

export default setupHome;
    
    