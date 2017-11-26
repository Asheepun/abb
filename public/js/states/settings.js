import vec    from "/js/engine/factories/vector.js";
import button from "/js/button.js";

let volume = 100;

export const setupSettings = (WORLD) => {
    WORLD.spliceAll(
        WORLD.obstacles,
        WORLD.points,
        WORLD.grass,
        WORLD.buttons,
        WORLD.helpers,
        WORLD.enemies,
    );

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


    WORLD.state = settings;
}

const settings = ({ c, width, height, sprites, buttons, drawAll, updateAll, audio }, ctx) => {

    updateAll(buttons);

    //draw
    ctx.save();
    ctx.scale(c.scale, c.scale);
    //draw background
    for(let i = 0; i < Math.floor((width-400)/30); i++){
        ctx.drawImage(sprites.grass, 200 + i*30, 70, 30, 30);
        for(let j = 0; j < Math.floor((height-200)/30); j++){
            if(i === 0 || j === 0 || i === Math.floor(((width-400)/30))-1 || j === Math.floor((height-200)/30)-1){
                if(j === 0) ctx.drawImage(sprites["obstacle-grass"], 200 + i*30, 100 + j*30, 30, 30);
                else ctx.drawImage(sprites.obstacle, 200 + i*30, 100 + j*30, 30, 30);
            }
            else ctx.drawImage(sprites.wall, 200 + i*30, 100 + j*30, 30, 30);
        }
    }
    drawAll(buttons);
    //draw volume
    ctx.fillStyle = "#594228";
    ctx.font = "18px game";
    ctx.drawImage(sprites["buttons/empty_x120"], 380, 190, 120, 30);
    ctx.fillText("Volume " + audio.volume + "%", 384, 213);
    ctx.restore();
}