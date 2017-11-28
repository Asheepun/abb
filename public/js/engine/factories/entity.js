import vec from "/js/engine/factories/vector.js";

const entity = ({ pos = vec(0, 0), size = vec(30, 30), img = "obstacle", alpha = 1, imgPos = [0, 0, size.x, size.y], rotation = 0, }) => {
    let that = {
        pos,
        size,
        img,
        imgPos,
        alpha,
        rotation,
        drawingActions: [],
        updateActions: [],
    };
    that.center = vec.add(that.pos, vec.half(that.size));

    that.draw = (ctx, WORLD) => {
        ctx.save();
        ctx.translate(that.center.x, that.center.y);
        ctx.rotate(that.rotation);
        ctx.globalAlpha = that.alpha;
        if(that.imgPos[0] + that.imgPos[2] <= WORLD.sprites[that.img].width) ctx.drawImage(
            WORLD.sprites[that.img],
            that.imgPos[0], that.imgPos[1], that.imgPos[2], that.imgPos[3],
            -that.size.x/2, -that.size.y/2, that.size.x, that.size.y
        );
        else ctx.drawImage(
            WORLD.sprites[that.img],
            0, that.imgPos[1], that.imgPos[2], that.imgPos[3],
            -that.size.x/2, -that.size.y/2, that.size.x, that.size.y
        );
        ctx.globalAlpha = 1;
        ctx.restore();

        that.drawingActions.forEach(action => that[action](ctx, WORLD));
    }
    that.update = (WORLD) => {
        if(that.updateActions.length > 0){
            that.updateActions.forEach(action => that[action](WORLD));
        }
    }

    that.fixCenter = () => that.center = vec.add(that.pos, vec.half(that.size));
    that.fixImgPos = () => that.imgPos = [0, 0, that.size.x, that.size.y];

    that.addUpdateActions = (...actions) => {
        actions.forEach(action => that.updateActions.push(action));
    }
    that.addDrawingActions = (...actions) => {
        actions.forEach(action => that.drawingActions.push(action));
    }

    return that;
}
export default entity;