import { v, add, half, mul, div, sub, pipe, align } from "/js/vector.js";
import { checkCol } from "/js/colission.js";
import entity from "/js/entity.js";
import getAnimate from "/js/animate.js";

const helper = (pos, text) => {
    const helper = entity({ pos, img: "helper" });
    helper.dirX = -1;
    helper.text = text;
    helper.talking = false;
    helper.textPos = v(helper.pos.x - (text.length / 2) * 12.5 - 15, helper.pos.y-15);
    while(helper.textPos.x + helper.text.length*10 > 900){
        helper.textPos.x -= 1;
    }
    while(helper.textPos.x < 15){
        helper.textPos.x += 1;
    }

    helper.animate = getAnimate(helper, {
        delay: 3,
        handleFrames: (frames) => {
            if(helper.talking) frames = [
                [0, 0, 30, 30],
                [30, 0, 30, 30],
                [60, 0, 30, 30],
                [90, 0, 30, 30],
                [120, 0, 30, 30],
                [150, 0, 30, 30],
                [180, 0, 30, 30],
                [210, 0, 30, 30],
            ];
            else frames = [[0, 0, 30, 30]];
            if(helper.dirX > 0) frames.forEach(f => f[1] = 30);
            if(helper.dirX < 0) frames.forEach(f => f[1] = 0);
            return frames;
        }
    });
    let col;
    helper.checkCol = ({ player, audio }) => {
        col = checkCol(helper, player);
        if(col){ 
            if(!helper.talking){
                helper.talking = true;
                audio.talk.load();
                audio.talk.play();
            }
        }else helper.talking = false;
    }
    helper.look = ({ player }) => {
        if(player.pos.x > helper.pos.x + helper.size.x) helper.dirX = 1;
        if(player.pos.x + player.size.x < helper.pos.x) helper.dirX = -1;
    }

    helper.update = helper.makeUpdate("checkCol", "look", "animate");

    helper.drawText = (ctx) => {
        if(helper.talking){
            ctx.fillStyle = "white";
            ctx.font = "20px game";
            ctx.fillText(helper.text, helper.textPos.x, helper.textPos.y);
        }
    }


    return helper;
}

export default helper;