import { v } from "/js/vector.js";
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
        dir: v(-1, 0),
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
        enemy.dir.x *= -1;
        enemy.pos.x += 4*enemy.dir.x;
        //animate
        if(enemy.dir.x > 0) enemy.imgPos = frame2;
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

    enemy.update = enemy.makeUpdate("move", "jump");

    return enemy;
}

export const bouncer = (pos) => enemy({
    pos,
    size: v(50, 50),
});

export const jumper = (pos) => {
    const jumper = enemy({
        pos,
        size: v(60, 60),
        jumpSpeed: 0.4,
    });
    jumper.speed = 0;

    jumper.look = ({ player }) => {
        if(player.pos.x > jumper.pos.x + jumper.size.x) jumper.imgPos = [224, 0, 210, 210];
        if(player.pos.x + player.size.x < jumper.pos.x) jumper.imgPos = [0, 0, 210, 210];
    }
    jumper.update = jumper.makeUpdate("move", "jump", "look");
    return jumper;
}

export const giantJumper = (pos) => {
    const gj = jumper(pos);
    gj.size = v(210, 210);
    gj.jumpSpeed = 0.5;

    return gj;
}

export const spawner = (pos) => {
    const spawner = bouncer(pos);
    spawner.spawn = v(spawner.pos.x, spawner.pos.y);
    spawner.oubArea = [0, 0, 900, 660];
    spawner.alpha = 0;

    spawner.handleOubY = () => {
        if(spawner.velocity.y > 0){
            spawner.pos = v(spawner.spawn.x, spawner.spawn.y);
            spawner.alpha = 0;
        }
    }
    spawner.reSpawn = () => {
        if(spawner.alpha === 1) return;
        spawner.alpha += 0.05;
        if(spawner.alpha > 1) spawner.alpha = 1;
    }
    spawner.update = spawner.makeUpdate("move", "jump", "reSpawn");

    return spawner;
}

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
}

export default enemy;