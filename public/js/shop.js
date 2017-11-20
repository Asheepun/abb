import button from "/js/button.js";
import vec from "/js/vector.js";

const progress = {
    coins: 10,
    items: {
        locked: [
            {
                name: "Golden clothes",
                price: 2,
            },
            {
                name: "Rainbow trail",
                price: 3,
            },
        ],
        unlocked: [],
    },
};

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
    WORLD.buttons.push(button({ pos: vec(720, 460), img: "buttons/exit", size: vec(60, 30), action(){
        WORLD.state = WORLD.states.setupHome;
    } }));
    //make item buttons
    progress.items.locked.forEach((item, i) => {
        const btn = button({
            pos: vec(150, 200 + i*60),
            size: vec(200, 30),
            img: "buttons/play",
            action(){
                progress.coins -= item.price;
                progress.items.locked.splice(progress.items.locked.indexOf(item), 1);
                progress.items.unlocked.push(item.name);
                WORLD.buttons.splice(WORLD.buttons.indexOf(btn), 1);
                console.log(progress.items.unlocked);
            }
        });
        btn.draw = (ctx) => {
            ctx.fillStyle = "brown";
            ctx.font = "20px game";
            ctx.fillRect(btn.pos.x, btn.pos.y, btn.size.x, btn.size.y);
            ctx.fillStyle = "yellow";
            ctx.fillText(item.name, btn.pos.x + 5, btn.pos.y + 25);
        }
        WORLD.buttons.push(btn);
    });

    WORLD.state = shop;
}

const shop = ({ c, width, height, buttons, drawAll, updateAll }, ctx) => {

    updateAll(buttons);

    
    ctx.save();
    ctx.scale(c.scale, c.scale);
    ctx.fillStyle = "white";
    ctx.fillRect(100, 100, width-200, height-200);
    ctx.fillStyle = "brown";
    ctx.fillRect(120, 120, 120, 30);
    ctx.fillStyle = "yellow";
    ctx.font = "20px game";
    ctx.fillText("Coins: " + progress.coins, 130, 140);

    drawAll(buttons);
    ctx.restore();

}

export default setupShop;