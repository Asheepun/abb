import { sub, abs } from "/js/vector.js";

export const checkCol = (obj, objects) => {
    if(objects.constructor === Array){
        for(let i = 0; i < objects.length; i++){
            const ob = objects[i];
            if(obj.pos.x + obj.size.x > ob.pos.x
            && obj.pos.x < ob.pos.x + ob.size.x
            && obj.pos.y + obj.size.y > ob.pos.y
            && obj.pos.y < ob.pos.y + ob.size.y) return ob;
        }
    }else if(obj.pos.x + obj.size.x > objects.pos.x
    && obj.pos.x < objects.pos.x + objects.size.x
    && obj.pos.y + obj.size.t > objects.pos.y
    && obj.pos.y < objects.pos.y + objects.size.y) return objects;
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