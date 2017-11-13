import { v, add, half, mul, div, sub, pipe, round } from "/js/vector.js";
import getMove from "/js/move.js";
import entity from "/js/entity.js";
import getAnimate from "/js/animate.js";
import { checkCol, checkProx } from "/js/colission.js";

const player = (pos = v(30, 300)) => {
    const player = entity({
        pos,
        size: v(28, 30),
        img: "player",
    });
    player.state = "still";
    player.imgDir = "right"
    player.grounded = false;
    player.dead = false;
    
    player.move = getMove(player, {oubArea: [0, 0, 900, 700]});

    player.animate = getAnimate(player, {
        delay: 4,
        handleFrames: ({ playerFrames }) => {
            if(player.grounded){ 
                player.img = "player";
                player.state = player.dir === 0 ? "still" : "moving";
            }
            else{ 
                player.img = "player-jump";
                player.state = "jumping";
            }
            if(player.dir < 0) player.imgDir = "left";
            if(player.dir > 0) player.imgDir = "right";
            return playerFrames[player.state][player.imgDir];
        }
    });

    player.jump = (sound, WORLD) => {
        if(player.grounded){ 
            sound.load();
            sound.play();
            player.velocity.y = -0.8
        }
    }

    player.handleColissionX = (object) => {
        if(player.velocity.x > 0) player.pos.x = object.pos.x - player.size.x;
        else player.pos.x = object.pos.x + object.size.x;
    }
    player.handleColissionY = (object) => {
        if(player.velocity.y > 0){
            player.grounded = true;
            player.pos.y = object.pos.y - player.size.y;
            player.pos = round(player.pos);
        }else player.pos.y = object.pos.y + object.size.y;
        player.velocity.y = 0;
    }
    player.handleOubX = () => {
        if(player.velocity.x > 0) player.pos.x = 870;
        else player.pos.x = 0;
    }
    player.handleOubY = () => {
        if(player.velocity.y > 0) player.dead = true;
        else player.pos.y = 0;
        player.velocity.y = 0;
    }
    player.handlePlatCol = (object) => {
        if(player.velocity.y > 0){
            player.pos.y = object.pos.y - player.size.y;
            player.grounded = true;
            player.velocity.y = 0;
            player.pos = round(player.pos);
        }
    }
    player.checkHit = ({ enemies }) => {
        for(let i = 0; i < enemies.length; i++){
            if(sub(player.center, enemies[i].center).mag < player.size.x/4 + enemies[i].size.x/2){
                player.dead = true;
            }
        }
    }
    player.update = player.makeUpdate("move", "checkHit", "animate");

    return player;
}


export default player;