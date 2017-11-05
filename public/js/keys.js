const createKeys = (...bindings) => new Promise((resolve, reject) =>  {
    const keys = {};

    for(let i = 0; i < bindings.length; i++){
        keys[bindings[i]] = {
            down: false,
            pressed: false,
            upped: false,
        };
    }

    keys.reset = () => {
        for(let key in keys){
            keys[key].pressed = false;
            keys[key].upped = false;
        }
    }

    document.addEventListener("keydown", e => {
        if(keys[e.key] && !keys[e.key].down){
            keys[e.key].down = true;
            keys[e.key].pressed = true;
        }
    });

    document.addEventListener("keyup", e => {
        if(keys[e.key]){
            keys[e.key].down = false;
            keys[e.key].upped = true;
        }
    });
    resolve(keys);
});

export default createKeys;