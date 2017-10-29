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
        audio[url] = a;
        return audio;
    }, {});
    resolve(audio);
});

/*
const loadJson = (...urls) => new Promise((resolve, reject) => {
    const json = [];
    urls.forEach(url => {
        const req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if(req.responseText){
                console.log("CHECK");
                if(urls.indexOf(url) < json.length) json.push(JSON.parse(req.responseText));
                if(json.length === urls.length) resolve(json);
            }
        }
        req.open("GET", "/assets/json/" + url + ".json", true);
        req.send();
    });
});
loadJson("player").then((json) => console.log());
*/