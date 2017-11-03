import { sub, abs } from "/js/vector.js";

export const checkCol = (obj, objects) => {
    const cc = (o1, o2) => {
        if(o1.pos.x + o1.size.x > o2.pos.x
        && o1.pos.x < o2.pos.x + o2.size.x
        && o1.pos.y + o1.size.y > o2.pos.y
        && o1.pos.y < o2.pos.y + o2.size.y) return true;
    }
    if(objects.constructor === Array){
        for(let i = 0; i < objects.length; i++){
            const ob = objects[i];
            if(cc(obj, ob)) return ob;
        }
    }else if(cc(obj, objects)) return objects;
    return false;
}

export const checkOub = (object, x, y, w, h) => {
    if(object.pos.x + object.size.x > x + w
    || object.pos.x < x
    || object.pos.y + object.size.y > y + h
    || object.pos.y < y) return true
    return false;
}

export const checkProx = (vec, vecs, length) => {
    for(let i = 0; i < vecs.length; i++){
        if(abs(sub(vec, vecs[i])).mag < length) return vecs[i];
    }
    return false;
}

export const checkPlatCol = (obj, objects) => {
    const cc = (o1, o2) => {
        if(o1.pos.x < o2.pos.x + o2.size.x
        && o1.pos.x + o1.size.x > o2.pos.x
        && o1.pos.y + o1.size.y >= o2.pos.y
        && o1.pos.y + o1.size.y < o2.pos.y + 10){
            return true;
        }
    }
    if(objects.constructor === Array){
        for(let i = 0; i < objects.length; i++){
            const ob = objects[i];
            if(cc(obj, ob)) return ob;
        }
    }else if(cc(obj, objects)) return objects;
    return false;
}