const vec = (x = 0, y = 0) => {
    const that = {
        x, 
        y,
        mag: Math.sqrt(x*x + y*y),
    }; 

    //cascading mutation methods
    that.set = (x, y) => {
        that.x = x;
        that.y = y;
        that.mag = Math.sqrt(x*x + y*y);
    }
    that.add = (v) => {
        if(typeof v === "number") 
            that.set(that.x + v, that.y + v);
        else that.set(that.x + v.x, that.y + v.y);
        return that;  
    }
    that.sub = (v) => {
        if(typeof v === "number") 
            that.set(that.x - v, that.y - v);
        else that.set(that.x - v.x, that.y - v.y);
        return that;  
    }
    that.mul = (v) => {
        if(typeof v === "number") 
            that.set(that.x * v, that.y * v);
        else that.set(that.x * v.x, that.y * v.y);
        return that;  
    }
    that.div = (v) => {
        if(typeof v === "number") 
            that.set(that.x * v, that.y * v);
        else that.set(that.x * v.x, that.y * v.y);
        return that;  
    }
    that.reverse = () => {
        that.set(-that.x, -that.y);
        return that;
    }
    that.normalize = () => {
        that.set(that.x/that.mag, that.y/that.mag);
        return that
    }
    //return methods
    that.copy = () => vec(that.x, that.y);

    return that;
}

vec.add = (vec1, vec2) => vec(vec1.x+vec2.x, vec1.y+vec2.y); 

vec.sub = (vec1, vec2) => vec(vec1.x-vec2.x, vec1.y-vec2.y); 

vec.div = (v, x) => vec(v.x/x, v.y/x); 

vec.mul = (v, x) => vec(v.x*x, v.y*x);

vec.dub = (v) => mul(v, 2);

vec.half = (v) => div(v, 2);

vec.reverse = (v) => vec(-v.x, -v.y);

vec.normalize = (v) => div(v, v.mag);

vec.abs = (v) => vec(Math.abs(v.x), Math.abs(v.y));

vec.floor = (v) => vec(Math.floor(v.x), Math.floor(v.y)); 

vec.round = (v) => vec(Math.round(v.x), Math.round(v.y)); 

export const add = (vec1, vec2) => vec(vec1.x+vec2.x, vec1.y+vec2.y); 

export const sub = (vec1, vec2) => vec(vec1.x-vec2.x, vec1.y-vec2.y); 

export const div = (v, x) => vec(v.x/x, v.y/x); 

export const mul = (v, x) => vec(v.x*x, v.y*x);

export const dub = (v) => mul(v, 2);

export const half = (v) => div(v, 2);

export const reverse = (v) => vec(-v.x, -v.y);

export const normalize = (v) => div(v, v.mag);

export const abs = (v) => vec(Math.abs(v.x), Math.abs(v.y));

export const floor = (v) => vec(Math.floor(v.x), Math.floor(v.y)); 

export const round = (v) => vec(Math.round(v.x), Math.round(v.y)); 

export const align = (cord, scl) => {
    if(Math.floor(cord) % scl === 0) return Math.floor(cord);
    else return align(cord-1, scl);
}

export const angle = (vec1, vec2) => -Math.atan2(vec1.x - vec2.x, vec1.y - vec2.y);

export const pipe = (x, ...funcs) => funcs.reduce((x, func) => func(x), x);


export default vec;