export const loadSprites = (...urls) => new Promise((resolve, reject) => {
    const sprites = urls.reduce((sprites, url) => {
        const sprite = new Image();
        sprite.src = `/assets/sprites/${url}.png`;
        sprites[url] = sprite;
        return sprites;
    }, {});
    resolve(sprites);
});

export const loadAudio = (volume = 0.5, ...urls) => new Promise((resolve, reject) => {
    const audio = urls.reduce((audio, url) => {
        const a = new Audio(`/assets/audio/${url}.wav`);
        a.volume = volume;
        a.load();
        audio[url] = a;
        return audio;
    }, {});
    resolve(audio);
});

export const loadJSON = (...srcs) => new Promise((resolve, reject) => {
    const resJSON = {};

    for(let i = 0; i < srcs.length; i++){
        const jsonReq = new XMLHttpRequest();
    
        jsonReq.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                resJSON[srcs[i]] = JSON.parse(this.responseText);
                if(Object.keys(resJSON).length === srcs.length) resolve(resJSON);
            }
        }
        jsonReq.open("GET", "/assets/json/" + srcs[i] + ".json", true);
        jsonReq.send();
    }
});