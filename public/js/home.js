import { v, add, half, mul, div, sub, pipe, align, normalize, reverse } from "/js/vector.js";
import entity from "/js/entity.js";
import button from "/js/button.js";
import levelTeplates from "/js/levelTemplates.js";
import { strEach, set } from "/js/level.js";

export const setupHome = (WORLD) => {
        WORLD.spliceAll(
            WORLD.obstacles,
            WORLD.points,
            WORLD.grass,
            WORLD.buttons,
        );
        homeTemplate.forEach((row, y) => strEach(row, (tile, x) => {
            if(tile === "#") WORLD.obstacles.push(entity({pos: v(x*30, y*30), img: "planks"}));
        }));
        WORLD.player.pos = v(780, 330);
        WORLD.buttons.push(button({ pos: v(840, 300), img: "arrow-right", size: v(30, 30), action: () => {
            if(WORLD.currentLevel < WORLD.furtestLevel){
                WORLD.currentLevel++;
                WORLD.audio["yes-btn"].load();
                WORLD.audio["yes-btn"].play();
            }
            else{
                WORLD.audio["not-btn"].load();
                WORLD.audio["not-btn"].play();
            }
        } }));
        WORLD.buttons.push(button({ pos: v(750, 300), img: "arrow-left", size: v(30, 30), action: () => {
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
        WORLD.buttons.push(button({ pos: v(780, 300), img: "play-btn", size: v(60, 30), action: () => {
            WORLD.state = WORLD.states.setup;
        } }));

        WORLD.state = updateHome;
    }

    const updateHome = (WORLD, ctx) => {
        WORLD.controlPlayerKeys();
        
        WORLD.updateAll(
            WORLD.player,
            WORLD.buttons,
        );
        
        //draw home
        ctx.save();
        ctx.scale(WORLD.scale, WORLD.scale);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WORLD.width, WORLD.height);
        WORLD.drawAll(WORLD.obstacles);
        ctx.fillStyle = "white";
        ctx.font = "30px game";
        ctx.fillText("Level " + (WORLD.currentLevel+1), 755, 290);
        WORLD.drawAll(
            WORLD.buttons,
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
    "##..........................##",
    "..............................",
    "..............................",
    "..............................",
    "..............................",
    "..............................",
    "..............................",
    "..............................",
    "........................######",
    "........................######",
    "........................######",
    "##############################",
    "##############################",
    "##############################",
];
    
    