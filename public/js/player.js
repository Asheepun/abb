import { v, add, half, mul, div, sub, pipe, floor } from "/js/vector.js";
import getMove from "/js/move.js";
import entity from "/js/entity.js";

const player = (pos = v(30, 300)) => {
    const player = entity({
        pos,
        size: v(30, 30),
        img: "player",
    });
    player.grounded = false;
    
    player.move = getMove(player, {});

    player.jump = (down) => {
        if(down && player.grounded) player.velocity.y = -0.8;
        else if(player.velocity.y < 0) player.velocity.y = 0;
    }

    player.handleColissionX = (object) => {
        if(player.velocity.x > 0) player.pos.x = object.pos.x - player.size.x;
        else player.pos.x = object.pos.x + object.size.x;
    }
    player.handleColissionY = (object) => {
        if(player.velocity.y > 0){
            player.pos.y = object.pos.y - player.size.y;
            player.pos = floor(player.pos);
        }else player.pos.y = object.pos.y + object.size.y;
        player.velocity.y = 0;
    }
    player.handleOubX = () => {
        if(player.velocity.x > 0) player.pos.x = 870;
        else player.pos.x = 0;
    }
    player.handleOubY = () => {
        if(player.velocity.y > 0) player.pos.y = 570;
        else player.pos.y = 0;
        player.velocity.y = 0;
    }
    player.checkBoxCol = (box) => {
        if(player.pos.x < box.pos.x + box.size.x
        && player.pos.x + player.size.x > box.pos.x
        && player.pos.y + player.size.y > box.pos.y
        && player.pos.y + player.size.y < box.pos.y + 10
        && player.velocity.y > 0){
            player.pos.y = box.pos.y - player.size.y;
            player.grounded = true;
            player.velocity.y = 0;
            player.pos = floor(player.pos);
        }
    }

    return player;
}


export default player;