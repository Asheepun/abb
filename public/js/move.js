import { v, add, half, mul, div, sub, pipe } from "/js/vector.js";
import { checkCol, checkOub, checkPlatCol } from "/js/colission.js";
import entity from "/js/entity.js";

const getMove = (entity, { speed = 0.2, gravity = 0.04, dir = 0, oubArea = [0, 0, 900, 600] }) => {
    entity.dir = dir;
    entity.speed = speed;
    entity.gravity = gravity;
    entity.oubArea = oubArea;
    entity.velocity = v(0, 0);
    entity.grounded = false;
    entity.maxFallSpeed = 0.4;
    let col, oub, platCol;

    return ({ timeScl, obstacles, box, grass }) => {

        entity.velocity.x = entity.dir * entity.speed;

        //handlePhysics
        entity.velocity.y += entity.gravity;
        if(entity.velocity.y > entity.maxFallSpeed) entity.velocity.y = entity.maxFallSpeed;

        //moveY
        entity.pos.y += entity.velocity.y * timeScl;
        col = checkCol(entity, obstacles);
        oub = checkOub(entity, ...entity.oubArea);
        platCol = checkPlatCol(entity, box);
        if(col && entity.handleColissionY){
            if(!entity.grounded && entity.velocity.y > 0){
                hitGroundParticleEffect(grass, entity);
            }
            entity.handleColissionY(col);
        }else entity.grounded = false;
        if(platCol && entity.handlePlatCol) entity.handlePlatCol(box);
        if(oub && entity.handleOubY) entity.handleOubY();

        //moveX
        entity.pos.x += entity.velocity.x * timeScl;
        col = checkCol(entity, obstacles);
        oub = checkOub(entity, ...entity.oubArea);
        if(col && entity.handleColissionX) entity.handleColissionX(col);
        if(oub && entity.handleOubX) entity.handleOubX();
        
        entity.fixCenter();
    }
}

const hitGroundParticleEffect = (array, object) => {
    for(let i = 0; i <   Math.random()*15; i++){
        const pixel = entity({
            pos: v(object.pos.x + Math.random()*(object.size.x-10) + 5, object.pos.y + object.size.y),
            img: "grass-particle",
            size: v(5, 5),
            imgPos: [0, 0, 5, 5],
            rotation: Math.random()*360,
        });
        if(Math.random() < 0.4) pixel.img = "player";
        pixel.move = getMove(pixel, {
            gravity: 0.02,
        });
        pixel.velocity.y = -Math.random()*0.2 - 0.1;
        if(pixel.pos.x > object.center.x) pixel.dir = 1;
        else pixel.dir = -1;
        pixel.speed = Math.random()*0.1;
        let fade = 0.005;
        pixel.fade = () => {
            fade *= 1.2;
            pixel.alpha -= fade;
            if(pixel.alpha <= 0) pixel.remove();
        }
        pixel.remove = () => array.splice(array.indexOf(pixel), 1);
            
        pixel.update = pixel.makeUpdate("move", "fade");
        array.push(pixel);
    }
}

export default getMove;