import { v, sub } from "/js/vector.js";

const getPointer = (canvas, offset = v(0, 0), scale = 1) => {
    const pointer = {
        pos: v(0, 0),
        down: false,
    }

    canvas.addEventListener("mousedown", e => pointer.down = true);
    canvas.addEventListener("mouseup", e => pointer.down = false);

    canvas.addEventListener("mousemove", e => {
        const offSet = v(canvas.offsetLeft, canvas.offsetTop);
        pointer.pos = sub(sub(v(e.pageX, e.pageY), offSet), offset);
    });
    return pointer
}

export default getPointer;