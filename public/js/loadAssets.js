export const loadSprites = (...urls) => new Promise((resolve, reject) => {
    const sprites = urls.reduce((sprites, url) => {
        const sprite = new Image();
        sprite.src = `/assets/sprites/${url}.png`;
        sprites[url] = sprite;
        return sprites;
    }, {})
    resolve(sprites);
});

export const loadAudio = (...urls) => urls.reduce((arr, url) => {
    const audio = new Audio(`/assets/audio/${url}.wav`);
    audio.volume = 0.5;
    arr.push(audio);
    return arr;
}, []);