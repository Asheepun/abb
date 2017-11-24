import vec, { add, half, mul, div, sub, pipe, align } from "/js/engine/factories/vector.js";
import entity                                         from "/js/engine/factories/entity.js";
import { checkCol }                                   from "/js/engine/functions/colission.js";
import addAnimate                                     from "/js/engine/functions/animate.js";
import button                                         from "/js/button.js";
import addTalk                                        from "/js/talk.js";

const helper = (pos = vec(-30, -30), text = "Hello!") => {
    const that = entity({ pos, img: "helper" });
    that.state = "still"
    that.dir = "left";
    that.text = text;

    addAnimate(that, {
        delay: 3,
        handleFrames: ({JSON }) => JSON.helperFrames[that.state][that.dir],
    });
    addTalk(that, () => that.state === "talking");
    
    that.checkCol = ({ player, audio }) => {
        if(checkCol(that, player)){ 
            if(that.state !== "talking"){
                that.state = "talking";
                audio.talk.load();
                audio.talk.play();
            }
        }else that.state = "still";
    }
    that.look = ({ player }) => {
        if(player.pos.x > that.pos.x + that.size.x) that.dir = "right";
        if(player.pos.x + player.size.x < that.pos.x) that.dir = "left";
    }

    that.addUpdateActions("checkCol", "look", "animate");
    that.addDrawingActions("talk");

    return that;
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

    that.addDrawingActions("drawText");
    that.addUpdateActions("addConverterButton");

    return that;
}

export default helper;