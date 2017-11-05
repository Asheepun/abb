import { v } from "/js/vector.js";
import entity from "/js/entity.js";
import getMove from "/js/move.js";

const enemy = ({ pos, size, jumpSpeed = 0.2 }) => {
    const enemy = entity({
        pos,
        size,
        imgPos: [0, 0, 30, 30],
        img: "enemy",
    });

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
        if(enemy.dir.x > 0) enemy.imgPos = [32, 0, 30, 30];
        else enemy.imgPos = [0, 0, 30, 30];
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
            enemy.velocity.y = -jumpSpeed;
        }
    }

    enemy.update = enemy.makeUpdate("move", "jump", "fixCenter");

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
        if(player.pos.x > jumper.pos.x + jumper.size.x) jumper.imgPos = [32, 0, 30, 30];
        if(player.pos.x + player.size.x < jumper.pos.x) jumper.imgPos = [0, 0, 30, 30];
    }
    jumper.update = jumper.makeUpdate("move", "jump", "fixCenter", "look");
    return jumper;
}

export default enemy;