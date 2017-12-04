import vec    from "/js/engine/factories/vector.js";
import button from "/js/button.js";

let volume = 100;

export const setupSettings = (WORLD) => {

    //exit button
    WORLD.buttons.push(button({ pos: vec(585, 425), img: "buttons/exit", size: vec(60, 30), action(){
        WORLD.state = WORLD.states.setup;
    } }));
    //volume buttons
    WORLD.buttons.push(button({ pos: vec(350, 190), img: "buttons/arrow-left", size: vec(30, 30), action(){
        if(WORLD.audio.volume > 0){
            WORLD.audio.volume -= 10;
            WORLD.audio.setVolume();
            WORLD.audio.play("yes-btn")
        }else WORLD.audio.play("not-btn")
    } }));
    WORLD.buttons.push(button({ pos: vec(500, 190), img: "buttons/arrow-right", size: vec(30, 30), action(){
        if(WORLD.audio.volume < 100){
            WORLD.audio.volume += 10;
            WORLD.audio.setVolume();
            WORLD.audio.play("yes-btn")
        }else WORLD.audio.play("not-btn")
    } }));
    //graphics buttons
    //clouds
    const cloudBtn = button({
        pos: vec(500, 250),
        size: vec(30, 30),
        img: WORLD.settings.cloudsOn ? "buttons/on" : "buttons/off",
    });
    cloudBtn.action = () => {
        if(cloudBtn.img === "buttons/off"){
            cloudBtn.img = "buttons/on";
            WORLD.settings.cloudsOn = true;
        }else{
            cloudBtn.img = "buttons/off";
            WORLD.settings.cloudsOn = false;
        }
    }
    WORLD.buttons.push(cloudBtn);

    WORLD.state = settings;
}

const settings = ({ c, width, height, sprites, buttons, drawAll, updateAll, audio }, ctx) => {

    updateAll(buttons);

    //draw
    ctx.save();
    ctx.scale(c.scale, c.scale);
    //draw background
    for(let i = 0; i < Math.floor((height-200)/30); i++){
        for(let j = 0; j < Math.floor((width-400)/30); j++){
            ctx.drawImage(sprites.grass, 200 + j*30, 70, 30, 30);
            if(i === 0 || j === 0 || i === Math.floor(((height-200)/30))-1 || j === Math.floor((width-400)/30)-1){
                if(i === 0) ctx.drawImage(sprites["grass/30"], 200 + j*30, 100 + i*30, 30, 30);
            }
        }
        if(i !== 0){
            ctx.drawImage(sprites["obstacles/480"], 200, 100 + i*30, 480, 30);
            if(i !== Math.floor((height-200)/30)-1) ctx.drawImage(sprites["walls/420"], 230, 100 + i*30, 420, 30);
        }
    }
    drawAll(buttons);
    //draw volume
    ctx.fillStyle = "#594228";
    ctx.font = "18px game";
    ctx.drawImage(sprites["buttons/empty_x120"], 380, 190, 120, 30);
    ctx.drawImage(sprites["buttons/empty_x120"], 350, 250, 120, 30);
    ctx.fillText("Volume " + audio.volume + "%", 384, 213);
    ctx.fillText("Clouds", 354, 273);
    ctx.restore();
}