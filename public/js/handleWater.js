import { checkCol } from "/js/engine/functions/colission.js";

const addHandleWater = (that, { speed = 0.1, jumpSpeed = 0.3, gravity = 0.01 }) => {
    that.waterCounter = 0;
    const originSpeed = that.speed;
    const originJumpSpeed = that.jumpSpeed;
    const originGravity = that.gravity;

    that.checkWater = ({ water }) => {
        if(!that.dead){
            if(checkCol(that, water)){
                if(that.waterCounter === 0) that.waterCounter = 4;
                that.speed = speed;
                that.jumpSpeed = jumpSpeed;
                that.gravity = gravity;
                that.waterCounter -= 1/40;
                if(that.waterCounter < 1) that.dead = true;
            }
            else{
                that.waterCounter = 0;
                that.speed = originSpeed;
                that.jumpSpeed = originJumpSpeed;
                that.gravity = originGravity;
            }
        }
    }
    that.drawWaterCounter = (ctx) => {
        if(that.waterCounter > 0 && !that.dead){
            ctx.fillStyle = "blue";
            ctx.font = "25px game";
            ctx.fillText(Math.floor(that.waterCounter), that.center.x - 7.5, that.pos.y-5);
        }
    }

    that.addUpdateActions("checkWater");
    that.addDrawingActions("drawWaterCounter");
}

export default addHandleWater;