import vec, { add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import { checkCol } from "/js/colission.js";
import entity from "/js/entity.js";
import button from "/js/button.js";
import getAnimate from "/js/animate.js";

const helper = (pos = vec(-30, -30), text = "Hello!") => {
    const helper = entity({ pos, img: "helper" });
    helper.state = "still"
    helper.dir = "left";
    helper.text = text;
    helper.textPos = vec(helper.pos.x - (text.length / 2) * 12.5 - 15, helper.pos.y-15);
    while(helper.textPos.x + helper.text.length*10 > 900){
        helper.textPos.x -= 1;
    }
    while(helper.textPos.x < 15){
        helper.textPos.x += 1;
    }

    helper.animate = getAnimate(helper, {
        delay: 3,
        handleFrames: ({JSON }) => JSON.helperFrames[helper.state][helper.dir],
    });
    helper.checkCol = ({ player, audio }) => {
        if(checkCol(helper, player)){ 
            if(helper.state !== "talking"){
                helper.state = "talking";
                audio.talk.load();
                audio.talk.play();
            }
        }else helper.state = "still";
    }
    helper.look = ({ player }) => {
        if(player.pos.x > helper.pos.x + helper.size.x) helper.dir = "right";
        if(player.pos.x + player.size.x < helper.pos.x) helper.dir = "left";
    }

    helper.update = helper.getUpdate("checkCol", "look", "animate");

    helper.drawText = ctx => {
        if(helper.state === "talking"){
            ctx.fillStyle = "white";
            ctx.font = "20px game";
            ctx.fillText(helper.text, helper.textPos.x, helper.textPos.y);
        }
    }

    helper.addDrawingAction(helper.drawText);


    return helper;
}

export const converter = (pos) => {
    const that = helper(pos);

    that.addConverterButton = (WORLD) => {
        if(that.state === "talking" && WORLD.buttons.length === 0){
            WORLD.buttons.push(button({
                pos: vec(that.pos.x - 25, that.pos.y - 45),
                size: vec(80, 20),
                img: "buttons/convert",
                action(){
                    if(WORLD.progress.completedLevels > 0){
                        WORLD.progress.completedLevels--;
                        WORLD.progress.coins++;
                        WORLD.audio["yes-btn"].load();
                        WORLD.audio["yes-btn"].play();
                    }else{
                        WORLD.audio["not-btn"].load();
                        WORLD.audio["not-btn"].play();
                    }
                }
            }));
        }else if(that.state !== "talking" && WORLD.buttons.length === 1) WORLD.buttons.splice(0, 1);
    }

    that.drawText = (ctx, { progress }) => {
        if(that.state === "talking"){
            ctx.fillStyle = "white";
            ctx.font = "20px game";
            ctx.fillText("completed", that.pos.x - 39, that.pos.y - 71);
            ctx.fillText("levels: " + progress.completedLevels, that.pos.x - 41, that.pos.y - 50);
            ctx.fillText("coins: " + progress.coins, that.pos.x - 30, that.pos.y - 5);
        }
    }
    that.drawingActions.splice(0, 1);
    that.addDrawingAction(that.drawText);

    that.update = that.getUpdate("checkCol", "look", "animate", "addConverterButton");

    return that;
}

export default helper;