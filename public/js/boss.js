import vec, { align }             from "/js/engine/factories/vector.js";
import entity                     from "/js/engine/factories/entity.js";
import { checkCol }               from "/js/engine/functions/colission.js";
import { jumper, spawner} from "/js/enemy.js";
import addMove                    from "/js/move.js";
import { addHandleCol }           from "/js/handleCol.js";

const boss = (pos) => {
    const that = entity({
        pos,
        size: vec(210, 280),
        img: "boss",
    });
    that.jumpSpeed = 0.1;
    that.attacks = [wallAttack];
    that.currentAttack = undefined;
    that.attacking = false;
    that.dead = false;
    let attackCounter = 0;

    addMove(that, {
        dir: 0,
        speed: 0,
        gravity: 0.005,
    });
    addHandleCol(that);

    that.jump = () => {
        if(that.grounded){
            that.velocity.y = -that.jumpSpeed;
        }
    }
    that.attack = (WORLD) => {
        if(!that.attacking){
            attackCounter += 1;
        }

        if(attackCounter % (60*3) === 0 && !that.attacking){
            that.velocity.y = -0.2;
            that.loadAttack = true;
        }
        if(that.loadAttack && that.grounded){
            that.loadAttack = false;
            that.attacking = true;
            if(WORLD.player.pos.y < 180) that.currentAttack = rainAttack(that);
            else if(WORLD.player.pos.y >= 180 && WORLD.player.pos.y <= WORLD.height - 210){
                if(Math.random() < 0.5)that.currentAttack = rainAttack(that) 
                else that.currentAttack = wallAttack(that);
            }else if(WORLD.player.pos.y >= WORLD.height-180) that.currentAttack = lowWaterAttack(that);
            else{
                that.currentAttack = () => console.log("No attack.");
                that.attacking = false;
            }
            WORLD.enemies.push(boulder(vec(0, 0)));
            WORLD.startingAlpha = 1;
        }

        if(that.attacking && !that.dead) that.currentAttack(WORLD);
    }
    that.checkBoulder = (WORLD) => {
        WORLD.enemies.forEach(e => {
            if(e.isBoulder && checkCol(that, [e])){
                that.dead = true;
            }
        });
    }
    that.checkDead = (WORLD) => {
        if(that.dead){
            WORLD.nextLevelCounter = undefined;
            WORLD.startingAlpha = 1;
            WORLD.currentLevel++;
            localStorage.furtestLevel = WORLD.currentLevel;
            WORLD.state = WORLD.states.setup;
        }
    }

    that.addUpdateActions("jump", "attack", "checkBoulder", "checkDead");

    return that;
}

const boulder = (pos) => {
    const that = entity({
        pos,
        img: "boulder",
    });
    that.isBoulder = true;
    addMove(that, {
        speed: 0.07,
        gravity: 0.01,
        dir: 1,
        moveOnGround: true,
    });
    addHandleCol(that);

    return that;
}

const rainAttack = (that) => {
    let counter = 0;
    let obstaclesFade = 1;

    return ({ enemies, player, obstacles }) => {

        if(counter < 5){
            for(let i = 0; i < 13; i++){
                obstacles.push(entity({
                    pos: vec(counter*30, 210 + i*30),
                    img: "obstacles/30",
                }));
            }
        }

        if(counter % 40 === 0)
            enemies.push(jumper(vec(player.pos.x + (player.pos.x > 300 ? -33 : 3), 0)));

        if(counter > 10*60){
            const createdObstacles = obstacles.filter(x => x.img === "obstacles/30");
            obstaclesFade -= 0.01;
            createdObstacles.forEach(x => x.alpha = obstaclesFade);
            if(obstaclesFade <= 0.01){
                createdObstacles.forEach(x => obstacles.splice(obstacles.indexOf(x), 1));
                that.attacking = false;
            }
        }

        counter++;
    }
}

const lowWaterAttack = (that) => {
    let counter = 0;
    let waterFade = 0.5;

    return ({ water, width, height, player, obstacles }) => {
        if(counter === 0){
            for(let i = 0; i < 5; i++){
                obstacles.push(entity({
                    pos: vec(i*30 + align(player.pos.x, 30) - 60, height-210),
                    img: "grass/30",
                }));
            }
            for(let i = 0; i < 23; i++){
                water.push(waterStream(vec(Math.floor(i*30), height-180), 1));
                water.push(waterStream(vec(Math.floor(i*30), height-150), 1));
            }
        }
        counter += 1;

        if(counter > 5*60){
            const createdObstacles = obstacles.filter(x => x.img === "grass/30");
            waterFade -= 0.01;
            water.forEach(x => x.alpha = waterFade);
            createdObstacles.forEach(x => x.alpha = waterFade);
            if(waterFade <= 0.01){
                water.splice(0, water.length);
                createdObstacles.forEach(x => obstacles.splice(obstacles.indexOf(x), 1));
                that.attacking = false;
            }
        }
    }
}

const wallAttack = (that) => {
    let counter = 0;

    let pos = undefined;
    let wallAlpha = 1;
    let obstacleAlpha = 1;
    
    return ({ walls, obstacles, width, height, player, box, foreground, enemies }) => {
        
        if(pos === undefined) pos = align(player.pos.y + 30, 30);

        if(counter < 23){
            for(let i = 0; i < (height-pos)/30; i++){
                if(box.pos.x === width-240-counter*30 && box.pos.y === pos + i*30) box.remove({foreground});
                walls.push(entity({
                    pos: vec(width-240-counter*30, pos + i*30),
                    img: "walls/30",
                }));
            }
            if(counter < 20){
                obstacles.push(entity({
                    pos: vec(width-240-counter*30, height-30),
                    img: "grass/30",
                }));
            }
        }
        if(counter === 23){
            enemies.push(jumper(vec(player.pos.x - 90, height-90)));
            enemies.push(jumper(vec(player.pos.x + 30, height-90)));
        }
        counter += 1;

        if(counter % 120 === 0) enemies.push(spawner(vec(width-270, height-90)));

        if(counter >= 2 + 15*60){
            //fade out walls
            wallAlpha -= 0.01;
            walls.forEach(w => w.alpha = wallAlpha);
            enemies.forEach(e => {
                if(e.size.x < 210) e.alpha = wallAlpha;
            });
            if(wallAlpha <= 0.01){
                enemies.splice(1, enemies.length);
                walls.splice(0, walls.length);

                //fade out obstacles
                obstacleAlpha -= 0.01;
                const createdObstacles = obstacles.filter(x => x.img === "grass/30");
                createdObstacles.forEach(x => obstacles[obstacles.indexOf(x)].alpha = obstacleAlpha);

                //end attack
                if(obstacleAlpha <= 0.01){
                    createdObstacles.forEach(x => obstacles.splice(obstacles.indexOf(x), 1));
                    that.attacking = false;
                }
            }
        }
    }
}

export default boss;