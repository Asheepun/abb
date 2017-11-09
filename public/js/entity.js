import { v, add, half, mul, div, sub, pipe } from "/js/vector.js";

const entity = ({ pos = v(0, 0), size = v(30, 30), img = "obstacle", alpha = 1, imgPos = [0, 0, size.x, size.y], rotation = 0 }) => {
    let entity = {
        pos,
        size,
        img,
        imgPos,
        alpha,
        rotation,
        drawingActions: [],
    };
    entity.center = add(entity.pos, half(entity.size));

    entity.draw = (ctx, sprites) => {
        ctx.save();
        ctx.translate(entity.center.x, entity.center.y);
        ctx.rotate(entity.rotation);
        ctx.globalAlpha = entity.alpha;
        if(entity.imgPos[0] + entity.imgPos[2] <= sprites[entity.img].width) ctx.drawImage(
            sprites[entity.img],
            entity.imgPos[0], entity.imgPos[1], entity.imgPos[2], entity.imgPos[3],
            -entity.size.x/2, -entity.size.y/2, entity.size.x, entity.size.y
        );
        else ctx.drawImage(
            sprites[entity.img],
            0, entity.imgPos[1], entity.imgPos[2], entity.imgPos[3],
            -entity.size.x/2, -entity.size.y/2, entity.size.x, entity.size.y
        );
        ctx.globalAlpha = 1;
        ctx.restore();
        if(entity.drawingActions.length > 0){
            for(let i = 0; i < entity.drawingActions.length; i++){
                entity.drawingActions[i](ctx, sprites);
            }
        }
    }

    entity.fixCenter = () => {
        entity.center = add(entity.pos, half(entity.size));
    }

    entity.makeUpdate = (...methods) => (WORLD) => {
        for(let i = 0; i < methods.length; i++){
            entity[methods[i]](WORLD);
        }
    }

    entity.addDrawingAction = (...funcs) => {
        for(let i = 0; i < funcs.length; i++){
            entity.drawingActions.push(funcs[i]);
        }
    }

    return entity;
}
export default entity;