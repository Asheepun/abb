import { v } from "/js/vector.js";
import entity from "/js/entity.js";
import getMove from "/js/move.js";

const enemy = ({ pos, size }) => {
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
        else enemy.pos.y = object.pos.y + object.size.y;
        enemy.velocity.y = 0;
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
            enemy.velocity.y = -0.2;
        }
    }

    enemy.update = enemy.makeUpdate("move", "jump", "fixCenter");

    return enemy;
}

export const bouncer = (pos) => enemy({
    pos,
    size: v(50, 50),
});

export default enemy;