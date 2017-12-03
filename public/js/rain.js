import vec, { angle } from "/js/engine/factories/vector.js";
import entity         from "/js/engine/factories/entity.js";
import addMove        from "/js/move.js";

const getRain = () => {
    const rain = [];

    for(let i = 0; i < 40; i++){
        //make drop
        const that = entity({ pos: vec(), size: vec(4, 15), img: "rain" });

        that.init = () => {
            that.pos.set(Math.random()*900, -Math.random()*50 - 50);
            that.maxFallSpeed = 0.5 + Math.random() * 0.5;
            that.rotation = angle(that.pos, vec(that.speed, that.maxFallSpeed).add(that.pos));
        }
        that.init();
        that.pos.y = Math.random()*600;
        addMove(that, {});
        that.speed = 0.1;
        that.dir = 1;
        
        that.handleOubY = () => {
            if(that.pos.y > 100) that.init();
        }

        rain.push(that);
    }
    return rain;
}

export default getRain;