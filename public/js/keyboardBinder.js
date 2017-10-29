const getKeyboardBinder = () => {
    const bindings = [];
    document.addEventListener("keydown", e => {
        for(let i = 0; i < bindings.length; i++){
            if(bindings[i].key === e.key 
            && bindings[i].down === false){
                bindings[i].down = true,
                bindings[i].func(true);
            }
        }
    });

    document.addEventListener("keyup", e => {
        for(let i = 0; i < bindings.length; i++){
            if(bindings[i].key === e.key 
            && bindings[i].down === true){
                bindings[i].down = false,
                bindings[i].func(false);
            }
        }
    });
    return (key, func) => {
        bindings.push({
            key,
            func,
            down: false,
        });
    }
}

export default getKeyboardBinder;