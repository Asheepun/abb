import vec, { add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import { checkCol } from "/js/colission.js";
import entity from "/js/entity.js";
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
        handleFrames: ({ helperFrames }) => helperFrames[helper.state][helper.dir],
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

    helper.update = helper.makeUpdate("checkCol", "look", "animate");

    helper.addDrawingAction(ctx => {
        if(helper.state === "talking"){
            ctx.fillStyle = "white";
            ctx.font = "20px game";
            ctx.fillText(helper.text, helper.textPos.x, helper.textPos.y);
        }
    });


    return helper;
}

export default helper;