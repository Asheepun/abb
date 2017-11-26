import entity                 from "/js/engine/factories/entity.js";
import vec, { sub }           from "/js/engine/factories/vector.js";
import { checkProx }          from "/js/engine/functions/colission.js";
import addMove                from "/js/move.js";
import addTalk                from "/js/talk.js";
import { addHandleColBounce } from "/js/handleCol.js";

export const point = (pos) => {
    const that = entity({
        pos,
        size: vec(20, 20),
        img: "point",
    });

    that.checkCol = ({ player, points, audio, reload, state }) => {
        if(checkProx(that.center, [player.center], 30)){
            audio.play("point");
            points.splice(points.indexOf(that), 1);
        }
    }
    that.addUpdateActions("checkCol");

    return that;
}

export const movingPoint = (pos) => {
    const that = point(pos);
    that.lines = [
        "Don't mind me.",
        "Go away!",
        "Leave me alone!",
        "Catch me if you can!"
    ];
    that.text = false;
    that.state = "silent";
    that.talked = 0;


    addMove(that, {
        dir: -1,
        speed: 0.05,
        gravity: 0.007,
    });
    addHandleColBounce(that);
    addTalk(that);

    that.jump = () => {
        if(that.grounded){
            that.velocity.y = -0.15;
        }
    }
    //make talking engine
    that.handleLines = ({ player, audio }) => {
        if(that.state === "talking" && that.text){
            that.talked++;
            if(that.talked > 60) that.text = false;
        }
        if(sub(player.center, that.center).mag < that.size.x/2 + 100){
            if(that.state !== "talking"){
                that.state = "talking"
                that.talked = 0;
                that.text = that.lines[Math.floor(Math.random()*that.lines.length)];
            }
        }else that.state = "silent";
    }

    that.addUpdateActions("move", "jump", "handleLines");
    that.addDrawingActions("talk");

    return that;
}