import vec    from "/js/engine/factories/vector.js";
import button from "/js/button.js";

export const emptyProgress = () => ({
    completedLevels: 0,
    coins: 0,
    items: {
        locked: [
            {
                name: "Purple coat",
                price: 6,
            },
            {
                name: "Rainbow trail",
                price: 8,
            },
        ],
        unlocked: [],
    },
});

export const updateProgress = (progress) => {
    const template = emptyProgress();
    
    template.items.locked.forEach(item => {
        if(progress.items.locked.find(x => x.name === item.name) === undefined
        && progress.items.unlocked.find(x => x === item.name) === undefined){
            progress.items.locked.push(item);
        }
    });
}

const setupShop = (WORLD) => {
    WORLD.spliceAll(
        WORLD.obstacles,
        WORLD.points,
        WORLD.grass,
        WORLD.buttons,
        WORLD.helpers,
        WORLD.enemies,
    );

    //exit shop button
    WORLD.buttons.push(button({ pos: vec(695, 425), img: "buttons/exit", size: vec(60, 30), action(){
        WORLD.state = WORLD.states.setupHome;
    } }));
    //make item buttons
    WORLD.progress.items.locked.forEach((item, i) => {
        const btn = button({
            pos: vec(150, 200 + i*60),
            size: vec(200, 30),
            img: "buttons/empty_x200",
            action({ progress }){
                if(progress.coins >= item.price){
                    progress.coins -= item.price;
                    progress.items.locked.splice(progress.items.locked.indexOf(item), 1);
                    progress.items.unlocked.push(item.name);
                    WORLD.buttons.splice(WORLD.buttons.indexOf(btn), 1);
                    WORLD.audio["yes-btn"].load();
                    WORLD.audio["yes-btn"].play();
                }else{
                    WORLD.audio["not-btn"].load();
                    WORLD.audio["not-btn"].play();
                }
            }
        });
        //fix buttons drawing
        btn.draw = (ctx) => {
            ctx.globalAlpha = btn.alpha;
            ctx.drawImage(WORLD.sprites[btn.img], btn.pos.x, btn.pos.y, btn.size.x, btn.size.y);
            ctx.fillStyle = "#594228"
            ctx.fillText(item.name, btn.pos.x + 5, btn.pos.y + 22);
            ctx.fillText(item.price, btn.pos.x + 180, btn.pos.y + 22);
            ctx.globalAlpha = 1;
        }
        WORLD.buttons.push(btn);
    });

    WORLD.state = shop;
}

const shop = ({ c, width, height, buttons, drawAll, updateAll, progress, sprites }, ctx) => {

    updateAll(buttons);

    
    ctx.save();
    ctx.scale(c.scale, c.scale);
    //draw shop background
    ctx.drawImage(sprites["helper-big"], 
        0, 90, 90, 90,
        150, 30, 90, 90
    );
    for(let i = 0; i < Math.floor((width-200)/30); i++){
        ctx.drawImage(sprites.grass, 100 + i*30, 70, 30, 30);
        for(let j = 0; j < Math.floor((height-200)/30); j++){
            if(i === 0 || j === 0 || i === Math.floor(((width-200)/30))-1 || j === Math.floor((height-200)/30)-1){
                if(j === 0) ctx.drawImage(sprites["obstacle-grass"], 100 + i*30, 100 + j*30, 30, 30);
                else ctx.drawImage(sprites.obstacle, 100 + i*30, 100 + j*30, 30, 30);
            }
            else ctx.drawImage(sprites.wall, 100 + i*30, 100 + j*30, 30, 30);
        }
    }
    ctx.drawImage(sprites["buttons/empty_x120"], 130, 130, 120, 30);
    ctx.fillStyle = "#594228"
    ctx.font = "20px game";
    ctx.fillText("Coins: " + progress.coins, 140, 150);

    drawAll(buttons);
    ctx.restore();

}

export default setupShop;