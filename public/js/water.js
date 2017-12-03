import entity           from "/js/engine/factories/entity.js";
import vec              from "/js/engine/factories/vector.js";
import addMove          from "/js/move.js";
import { addHandleCol } from "/js/handleCol.js";

const waterPiece = (pos, dir) => {
    const that = entity({
        pos,
        size: vec(20, 20),
        img: "water",
    });
    that.alpha = 0.5;
    that.hit = false;

    addMove(that, {
        speed: 0.05,
        gravity: 0.01,
        dir,
        moveOnGround: "true",
    });
    addHandleCol(that);

    that.handleOubX = that.handleOubY = () => that.hit = true;

    that.handleColissionX = (object) => {
        if(that.velocity.x > 0) that.pos.x = object.pos.x - that.size.x;
        else that.pos.x = object.pos.x + object.size.x;
        that.hit = true;
    }

    that.checkHit = ({ water }) => {
        if(that.hit){
            that.speed = 0;
            that.alpha -= 0.01;
            if(that.alpha < 0) water.remove(that);
        }
    }

    that.addUpdateActions("checkHit");

    return that;
}

const waterStream = (pos, dir) => {
    const that = entity({
        pos: vec(pos.x + 10, pos.y + 10),
        size: vec(20, 20),
        img: "water",
    });
    that.alpha = 0.5;
    that.prepared = false;

    let time = 0;
    that.stream = ({ water }) => {
        time++;
        if(time % 12 === 0) water.push(waterPiece(that.pos.copy(), dir));
    }
    that.prepare = (WORLD) => {
        if(!that.prepared){
            let x = waterPiece(that.pos.copy(), dir);
            let time = 0;
            while(!x.hit){
                x.move(WORLD);
                time++;
                if(time % 12 === 0) WORLD.water.push(waterPiece(x.pos.copy(), dir));
            }
            WORLD.water.remove(x);
            that.prepared = true;
            time = 0;
        }
    }

    that.addUpdateActions("prepare", "stream");

    return that;
}

export default waterStream;