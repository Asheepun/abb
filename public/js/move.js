import { v, add, half, mul, div, sub, pipe } from "/js/vector.js";
import { checkCol, checkOub } from "/js/colission.js";

const getMove = (entity, { speed = 0.2, gravity = 0.04, dir = v(0, 0), oubArea = [0, 0, 900, 600] }) => {
    entity.dir = dir;
    entity.speed = speed;
    entity.gravity = gravity;
    entity.velocity = v(0, 0);
    entity.grounded = false;
    const maxFallSpeed = 0.4;
    let col, oub;

    return ({ timeScl, tiles}) => {

        entity.velocity.x = entity.dir.x*entity.speed;

        //handlePhysics
        entity.velocity.y += entity.gravity;
        if(entity.velocity.y > maxFallSpeed) entity.velocity.y = maxFallSpeed;

        //moveY
        entity.pos.y += entity.velocity.y * timeScl;
        col = checkCol(entity, tiles);
        oub = checkOub(entity, ...oubArea);
        if(col && entity.handleColissionY){
            entity.handleColissionY(col);
            entity.grounded = true;
        }else entity.grounded = false;
        if(oub && entity.handleOubY) entity.handleOubY();

        //moveX
        entity.pos.x += entity.velocity.x * timeScl;
        col = checkCol(entity, tiles);
        oub = checkOub(entity, ...oubArea);
        if(col && entity.handleColissionX) entity.handleColissionX(col);
        if(oub && entity.handleOubX) entity.handleOubX();
    }
}

export default getMove;