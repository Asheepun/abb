import entity from "/js/entity.js";
import vec from "/js/vector.js";
import { checkCol } from "/js/colission.js";

export const door = (pos, i) => {
    const that = entity({
        pos,
        size: vec(30, 90),
        img: "door",
    });
    that.index = i;

    return that;
}

export const key = (pos, i) => {
    const that = entity({
        pos,
        img: "door-button"
    });
    that.down = false;
    that.index = i;
    
    let col = false;
    that.checkCol = ({ enemies, player, obstacles, audio }) => {
        if(!that.down){
            col = checkCol(that, enemies) || checkCol(that, player);
            if(col && col.velocity.y > 0){
                that.down = true;
                obstacles.forEach(o => {
                    if(o.index === that.index) obstacles.splice(obstacles.indexOf(o), 1);
                });
                audio["door-btn"].volume = 1;
                audio["door-btn"].load();
                audio["door-btn"].play();
            }
        }
    }
    that.update = that.makeUpdate("checkCol");

    return that;
}