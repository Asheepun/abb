import vec, { sub } from "/js/vector.js";
import entity from "/js/entity.js";
import getMove from "/js/move.js";

const enemy = ({ pos, size, jumpSpeed = 0.2, img = "enemy", frame1 = [0, 0, 210, 210], frame2 = [224, 0, 210, 210] }) => {
    const enemy = entity({
        pos,
        size,
        imgPos: frame1,
        img,
    });
    enemy.jumpSpeed = jumpSpeed;

    enemy.move = getMove(enemy, {
        speed: 0.1,
        dir: -1,
        gravity: 0.01,
    });
    enemy.handleColissionY = (object) => {
        if(enemy.velocity.y > 0){
            enemy.pos.y = object.pos.y - enemy.size.y;
            enemy.grounded = true;
        }
        else{ 
            enemy.pos.y = object.pos.y + object.size.y;
            enemy.grounded = false;
        }
        enemy.velocity.y = 0;
    }
    enemy.handleOubY = () => {
        if(enemy.velocity.y < 0){
            enemy.pos.y = 0;
            enemy.velocity.y = 0;
        }
    }
    enemy.handleColissionX = enemy.handleOubX = () => {
        enemy.dir *= -1;
        enemy.pos.x += 4*enemy.dir;
        //animate
        if(enemy.dir > 0) enemy.imgPos = frame2;
        else enemy.imgPos = frame1;
    }
    enemy.handlePlatCol = (object) => {
        if(enemy.velocity.y > 0){
            enemy.pos.y = object.pos.y - enemy.size.y;
            enemy.grounded = true;
            enemy.velocity.y = 0;
        }
    }
    enemy.jump = () => {
        if(enemy.grounded){
            enemy.velocity.y = -enemy.jumpSpeed;
        }
    }
    //make talking engine
    enemy.lines = [
        "Lil bugger!",
        "Come'ere you!",
        "You scared boy?",
        "I dare you!",
        "Twerp!",
    ];
    enemy.line = false;
    enemy.talking = false;
    enemy.talked = 0;
    enemy.talk = ({ player, audio }) => {
        if(enemy.talking && enemy.line){
            enemy.talked++;
            if(enemy.talked > 60) enemy.line = false;
        }
        if(sub(player.center, enemy.center).mag < enemy.size.x/2 + 100){
            if(!enemy.talking){
                enemy.talking = true
                enemy.talked = 0;
                enemy.line = enemy.lines[Math.floor(Math.random()*enemy.lines.length)];
            }
        }else enemy.talking = false;
    }
    let drawPosX = enemy.center.x-(enemy.line.length/2)*10-15;
    enemy.addDrawingAction(ctx => {
        if(enemy.talking && enemy.line){
            ctx.fillStyle = "white";
            ctx.font = "20px game";
            if(enemy.size.x === 210) ctx.font = "30px game";
            drawPosX = enemy.center.x-(enemy.line.length/2)*10-15;
            while(drawPosX < 10){
                drawPosX += 10;
            }
            ctx.fillText(enemy.line, drawPosX, enemy.pos.y - 10);
        }
    });

    enemy.update = enemy.makeUpdate("move", "jump", "talk");

    return enemy;
}

export const bouncer = (pos) => enemy({
    pos,
    size: vec(50, 50),
});

export const jumper = (pos) => {
    const jumper = enemy({
        pos,
        size: vec(60, 60),
        jumpSpeed: 0.4,
    });
    jumper.speed = 0;
    jumper.lines.push("Don't run away!", "Stay here!");

    jumper.look = ({ player, sprites }) => {
        if(player.pos.x > jumper.pos.x + jumper.size.x){
            jumper.dir = 1;
            jumper.imgPos = [224, 0, 210, 210];
        }
        if(player.pos.x + player.size.x < jumper.pos.x){
            jumper.dir = -1;
            jumper.imgPos = [0, 0, 210, 210];
        }
    }
    jumper.update = jumper.makeUpdate("move", "jump", "look", "talk");
    return jumper;
}

export const giantJumper = (pos) => {
    const gj = jumper(pos);
    gj.size = vec(210, 210);
    gj.jumpSpeed = 0.5;

    return gj;
}

export const spawner = (pos) => {
    const spawner = bouncer(pos);
    spawner.spawn = vec(spawner.pos.x, spawner.pos.y);
    spawner.oubArea = [0, 0, 900, 660];
    spawner.alpha = 0;

    spawner.handleOubY = () => {
        if(spawner.velocity.y > 0){
            spawner.pos = vec(spawner.spawn.x, spawner.spawn.y);
            spawner.alpha = 0;
        }
    }
    spawner.reSpawn = () => {
        if(spawner.alpha === 1) return;
        spawner.alpha += 0.05;
        if(spawner.alpha > 1) spawner.alpha = 1;
    }
    spawner.update = spawner.makeUpdate("move", "jump", "reSpawn", "talk");

    return spawner;
}
/*
export const ghost = (pos) => {
    const ghost = jumper(pos);
    ghost.alpha = 0.8;
    ghost.gravity = 0;
    ghost.dir.x = 0;
    ghost.velocity.y = 0.2;
    ghost.oubArea = [0, 0, 900, 600];

    ghost.handleOubY = () => {
        ghost.velocity.y *= -1;
    }
    ghost.handleColissionY = undefined;
    ghost.handleColissionX = undefined;
    ghost.handlePlatCol = undefined;

    return ghost;
}

export const giantGhost = (pos) => {
    const jg = ghost(pos);
    jg.size = v(210, 210);
    jg.velocity.y = 0.2;

    return jg;
}*/

export default enemy;