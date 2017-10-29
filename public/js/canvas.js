const createCanvas = (width = 800, height = 600, element = document.body) => new Promise((resolve, reject) => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    c.width = width;
    c.height = height;
    element.appendChild(c);
    resolve({
        c,
        ctx,
    });
});

export default createCanvas;