import { v, add, half, mul, div, sub, pipe } from "/js/vector.js";

const entity = ({ pos = v(0, 0), size = v(30, 30), img = "obstacle", alpha = 1, imgPos = [0, 0, size.x, size.y] }) => {
    let entity = {
        pos,
        size,
        img,
        imgPos,
        alpha,
    };
    entity.center = add(entity.pos, half(entity.size));

    entity.draw = (ctx, sprites) => {
        ctx.save();
        ctx.translate(entity.center.x, entity.center.y);
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
    }

    entity.update = () => {
        entity.center = add(entity.pos, half(entity.size));
    }

    return entity;
}
export default entity;