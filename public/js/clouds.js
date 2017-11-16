import vec from "/js/vector.js";
import getMove from "/js/move.js";
import entity from "/js/entity.js";
import { set } from "/js/level.js";

const getClouds = (amount = 20, offset = 0) => {
    const clouds = set();
    //add clouds
    const dist = 900/amount;
    for(let i = 0; i < amount; i++){
        const cloud = entity({
            pos: vec(dist*i + Math.random()*60 + offset, Math.floor(Math.random()*60)),
            size: vec(60, 30),
            alpha: 0.8,
            img: "cloud",
        });
        cloud.move = getMove(cloud, {
            dir: 1,
            gravity: 0,
            speed: 0.04,
            oubArea: [-60, -120, 1080, 600],
        });
        if(Math.random() < 0.5) cloud.imgPos[0] += 60;

        cloud.init = () => {
            cloud.pos.y = Math.floor(Math.random()*60);
            cloud.speed = 0.05;
            if(Math.random() < 0.3) cloud.speed *= 0.8;
            if(Math.random() < 0.3) cloud.speed *= 1.2;
        }
        cloud.init();

        cloud.handleOubX = () => {
            if(cloud.velocity.x > 0) cloud.pos.x = -60;
            else cloud.pos.x = 1860;
            cloud.init();
        }
        cloud.sineWave = () => {
            cloud.velocity.y += Math.sin(cloud.pos.x/3)/2000;
        }
        cloud.update = cloud.makeUpdate("sineWave", "move", "fixCenter");

        clouds.push(cloud);
    }
    return clouds; 
}

export default getClouds;