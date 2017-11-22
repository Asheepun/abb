import vec from "/js/vector.js";

const entity = ({ pos = vec(0, 0), size = vec(30, 30), img = "obstacle", alpha = 1, imgPos = [0, 0, size.x, size.y], rotation = 0, }) => {
    let that = {
        pos,
        size,
        img,
        imgPos,
        alpha,
        rotation,
        drawingActions: [],
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
        if(that.drawingActions.length > 0){
            for(let i = 0; i < that.drawingActions.length; i++){
                that.drawingActions[i](ctx, WORLD);
            }
        }
    }

    that.fixCenter = () => that.center = vec.add(that.pos, vec.half(that.size));

    that.getUpdate = (...methods) => (WORLD) => {
        for(let i = 0; i < methods.length; i++){
            that[methods[i]](WORLD);
        }
    }

    that.addDrawingAction = (...funcs) => {
        for(let i = 0; i < funcs.length; i++){
            that.drawingActions.push(funcs[i]);
        }
    }

    return that;
}
export default entity;