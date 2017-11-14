import { v, add, half, mul, div, sub, pipe, align, normalize, reverse } from "/js/vector.js";
import entity from "/js/entity.js";
import player from "/js/player.js";
import helper from "/js/helper.js";
import button from "/js/button.js";
import levelTeplates from "/js/levelTemplates.js";
import { strEach, set } from "/js/level.js";

export const setupHome = (WORLD) => {
        WORLD.spliceAll(
            WORLD.obstacles,
            WORLD.points,
            WORLD.grass,
            WORLD.buttons,
            WORLD.helpers,
            WORLD.enemies,
        );
        homeTemplate.forEach((row, y) => strEach(row, (tile, x) => {
            if(tile === "#") WORLD.obstacles.push(entity({pos: v(x*30, y*30), img: "planks"}));
        }));
        WORLD.player = player(v(780, 330));
        WORLD.helpers.push(helper(v(0, 480), "Welcome home!"));
        //switch world buttons
        WORLD.buttons.push(button({ pos: v(748, 200), img: "start-world", size: v(60, 45), action(){
            WORLD.currentWorld = "start";
            WORLD.audio["yes-btn"].load();
            WORLD.audio["yes-btn"].play();
        } }));
        WORLD.buttons.push(button({ pos: v(812, 200), img: "cave-world", size: v(60, 45), action(){
            WORLD.currentWorld = "cave";
            WORLD.audio["yes-btn"].load();
            WORLD.audio["yes-btn"].play();
        } }));
        WORLD.buttons[0].imgPos = [0, 0, 356, 261];
        WORLD.buttons[1].imgPos = [0, 0, 356, 261];
        //switch level buttons
        WORLD.buttons.push(button({ pos: v(840, 300), img: "arrow-right", size: v(30, 30), action(){
            if(WORLD.worlds[WORLD.currentWorld].currentLevel < WORLD.returnProgress()){
                WORLD.worlds[WORLD.currentWorld].currentLevel++;
                WORLD.audio["yes-btn"].load();
                WORLD.audio["yes-btn"].play();
            }
            else{
                WORLD.audio["not-btn"].load();
                WORLD.audio["not-btn"].play();
            }
        } }));
        WORLD.buttons.push(button({ pos: v(750, 300), img: "arrow-left", size: v(30, 30), action(){
            if(WORLD.worlds[WORLD.currentWorld].currentLevel > 0){
                WORLD.worlds[WORLD.currentWorld].currentLevel--;
                WORLD.audio["yes-btn"].load();
                WORLD.audio["yes-btn"].play();
            }
            else{
                WORLD.audio["not-btn"].load();
                WORLD.audio["not-btn"].play();
            }
        } }));
        //play button
        WORLD.buttons.push(button({ pos: v(780, 300), img: "play-btn", size: v(60, 30), action(){
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
        ctx.scale(WORLD.scale, WORLD.scale);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WORLD.width, WORLD.height);
        WORLD.drawAll(WORLD.obstacles);
        //draw level switching system
        ctx.fillStyle = "white";
        ctx.font = "30px game";
        ctx.fillText("Level " + (WORLD.worlds[WORLD.currentWorld].currentLevel+1), 755, 290);
        ctx.fillRect(WORLD.currentWorld === "cave" ? 812 : 748, 195, 60, 5);
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
    "####......................####",
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
    
    