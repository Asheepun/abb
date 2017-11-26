export const makeUpdateAll = (object) => (...arrs) => {
    for(let i = 0; i < arrs.length; i++){
        if(arrs[i].constructor === Array){
            for(let j = 0; j < arrs[i].length; j++){
                if(arrs[i][j].update) arrs[i][j].update(object);
            }
        }else arrs[i].update(object);
    }
}

export const makeDrawAll = (ctx, WORLD) => (...arrs) => {
    for(let i = 0; i < arrs.length; i++){
        if(arrs[i].constructor === Array){
            for(let j = 0; j < arrs[i].length; j++){
                arrs[i][j].draw(ctx, WORLD);
            }
        }else arrs[i].draw(ctx, WORLD);
    }
}

export const spliceAll = (...arrs) => {
    for(let i = 0; i < arrs.length; i++){
        arrs[i].splice(0, arrs[i].length);
    }
}