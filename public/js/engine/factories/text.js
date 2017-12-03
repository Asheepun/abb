const text = ({ text, pos, fontSize, font, color, alpha = 1, blinking = false, }) => {
    const that = {
        text,
        pos,
        fontSize,
        font,
        color,
        alpha,
        blinking,
    };
    const originAlpha = alpha;
    let dir = -1;

    that.draw = (ctx, WORLD) => {

        //handle blinking
        if(that.blinking){
            if(dir === -1) that.alpha -= 0.008;
            else that.alpha += 0.008;
            if(that.alpha <= 0.2) dir = 1;
            if(that.alpha >= originAlpha) dir = -1;
        }

        //draw the text
        ctx.fillStyle = that.color;
        ctx.font = `${that.fontSize}px ${that.font}`;
        ctx.globalAlpha = that.alpha;
        that.text.forEach((line, i) => {
            ctx.fillText(line, that.pos.x, that.pos.y + i*(that.fontSize + 10) - 10);
        });
    }

    return that;
}

export default text;