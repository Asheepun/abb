import { v, add, half, mul, div, sub, pipe } from "/js/vector.js";

const entity = ({ pos = v(0, 0), size = v(30, 30), img = "obstacle", alpha = 1 }) => {
    let entity = {
        pos,
        size,
        img,
        alpha,
    };
    entity.center = add(entity.pos, half(entity.size));

    entity.draw = (ctx, sprites) => {
        ctx.save();
        ctx.translate(entity.center.x, entity.center.y);
        ctx.globalAlpha = entity.alpha;
        ctx.drawImage(
            sprites[entity.img],
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