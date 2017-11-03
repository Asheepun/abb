import { v, add, half, mul, div, sub, pipe, round } from "/js/vector.js";
import getMove from "/js/move.js";
import entity from "/js/entity.js";
import getAnimate from "/js/animate.js";
import { checkCol } from "/js/colission.js";

const player = (pos = v(30, 300)) => {
    const player = entity({
        pos,
        size: v(30, 30),
        img: "player",
    });
    player.grounded = false;
    player.dead = false;
    
    player.move = getMove(player, {oubArea: [0, 0, 900, 700]});

    player.animate = getAnimate(player, {
        delay: 4,
        handleFrames: (frames) => {
            if(player.grounded){ 
                player.img = "player";
                frames = [
                    [32, frames[0][1], 30, 30],
                    [64, frames[0][1], 30, 30],
                    [96, frames[0][1], 30, 30],
                    [128, frames[0][1], 30, 30],
                    [160, frames[0][1], 30, 30],
                    [192, frames[0][1], 30, 30],
                ];
            }
            else{ 
                player.img = "player-jump";
                frames = [
                    [32, frames[0][1], 30, 30],
                    [64, frames[0][1], 30, 30],
                ];
            }
            if(player.dir.x < 0) frames.forEach(f => f[1] = 32);
            else if(player.dir.x > 0) frames.forEach(f => f[1] = 0);
            else frames = [[0, frames[0][1], 30, 30]];
            return frames;
        }
    });

    player.jump = (sound) => {
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
        if(checkCol(player, enemies)){
            player.dead = true;
        }
    }
    player.update = player.makeUpdate("move", "checkHit", "fixCenter", "animate");

    return player;
}


export default player;