import vec, { div, sub } from "/js/engine/factories/vector.js";

const createCanvas = (width = 800, height = 600, element = document.body) => new Promise((resolve, reject) => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;    

    //fix canvas size
    const dif = height/width;

    const reSize  = () => {
        c.width = window.innerWidth-20;
        c.height = c.width*dif;
        while(c.height > window.innerHeight-20){
            c.width -= 2;
            c.height = c.width*dif;
        }
        c.scale = c.width/width;
    }
    reSize();

    window.addEventListener("resize", reSize);

    const pointer = {
        pos: vec(0, 0),
        down: false,
        pressed: false,
    };

    c.addEventListener("mousedown", e => {
        pointer.down = true;
        pointer.pressed = true;
    });
    c.addEventListener("mouseup", e => {
        pointer.down = false;
    });
    c.addEventListener("mousemove", e => {
        const offset = vec(c.offsetLeft, c.offsetTop);
        pointer.pos = div(sub(vec(e.pageX, e.pageY), offset), c.scale);
    });
    c.addEventListener("contextmenu", e => {
        e.preventDefault();
    });

    element.appendChild(c);
    resolve({
        c,
        ctx,
        pointer,
    });
});

export default createCanvas;