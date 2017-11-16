import vec from "/js/vector.js";
import entity from "/js/entity.js";

const button = ({ pos, img, size, action = () => {} }) => {
    const button = entity({
        pos,
        img,
        size,
    });
    button.down = false;

    button.checkPointer = ({ pointer }) => {
        if(pointer.pos.x > button.pos.x
        && pointer.pos.x < button.pos.x + button.size.x
        && pointer.pos.y > button.pos.y
        && pointer.pos.y < button.pos.y + button.size.y){
            button.alpha = 0.5;
            if(pointer.pressed){
                button.down = true;
            }
            if(!pointer.down && button.down){
                button.down = false;
                action();
            }
        }else{
            button.alpha = 1;
            button.down = false;
        }
    }

    button.update = button.makeUpdate("checkPointer");

    return button;
}

export default button;