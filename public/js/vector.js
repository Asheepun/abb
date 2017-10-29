export const v = (x, y) => ({
    x,
    y,
    mag: Math.sqrt(x*x + y*y),
    set: (x, y) => {
        this.x = x;
        this.y = y;
    }
});

export const add = (vec1, vec2) => v(vec1.x+vec2.x, vec1.y+vec2.y); 

export const sub = (vec1, vec2) => v(vec1.x-vec2.x, vec1.y-vec2.y); 

export const div = (vec, x) => v(vec.x/x, vec.y/x); 

export const mul = (vec, x) => v(vec.x*x, vec.y*x);

export const dub = (vec) => mul(vec, 2);

export const half = (vec) => div(vec, 2);

export const reverse = (vec) => v(-vec.x, -vec.y);

export const normalize = (vec) => div(vec, vec.mag);

export const abs = (vec) => v(Math.abs(vec.x), Math.abs(vec.y));

export const floor = (vec) => v(Math.floor(vec.x), Math.floor(vec.y)); 

export const align = (cord, scl) => {
    if(Math.floor(cord) % scl === 0) return Math.floor(cord);
    else return align(cord-1, scl);
}

export const angle = (vec1, vec2) => -Math.atan2(vec1.x - vec2.x, vec1.y - vec2.y);

export const pipe = (x, ...funcs) => funcs.reduce((x, func) => func(x), x) 