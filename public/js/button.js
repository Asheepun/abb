import vec    from "/js/engine/factories/vector.js";
import entity from "/js/engine/factories/entity.js";

const button = ({ pos, img, size, action = () => {} }) => {
    const that = entity({
        pos,
        img,
        size,
    });
    that.down = false;

    that.checkPointer = (WORLD) => {
        if(WORLD.pointer.pos.x > that.pos.x
        && WORLD.pointer.pos.x < that.pos.x + that.size.x
        && WORLD.pointer.pos.y > that.pos.y
        && WORLD.pointer.pos.y < that.pos.y + that.size.y){
            that.alpha = 0.5;
            if(WORLD.pointer.pressed){
                that.down = true;
            }
            if(!WORLD.pointer.down && that.down){
                that.down = false;
                action(WORLD);
            }
        }else{
            that.alpha = 1;
            that.down = false;
        }
    }

    that.addUpdateActions("checkPointer");

    return that;
}

export default button;