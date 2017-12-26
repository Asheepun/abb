import vec, { align }             from "/js/engine/factories/vector.js";
import entity                     from "/js/engine/factories/entity.js";
import { checkCol }               from "/js/engine/functions/colission.js";
import { jumper, spawner}         from "/js/enemy.js";
import addMove                    from "/js/move.js";
import { addHandleCol }           from "/js/handleCol.js";
import { point, movingPoint }     from "/js/point.js";

let createdPoints = 0;
let createdEnemies = 0;
let createdObstacles = 0;

const boss = (pos) => {
    const that = entity({
        pos,
        size: vec(210, 280),
        img: "boss",
    });
    that.jumpSpeed = 0.1;
    that.currentAttack = undefined;
    that.attacking = false;
    that.started = false;
    that.attackingCounter = 0;
    let attackCounter = 0;
    let startCounter = 0;

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
    that.start = ({ player, width, height, obstacles, foreground }) => {
        if(player.pos.x > 210 && !that.started){
            if(startCounter === 1){
                //cover up
                foreground.push(entity({
                    pos: vec(0, 450),
                    img: "obstacles/30",
                }));
                foreground.push(entity({
                    pos: vec(30, 450),
                    img: "obstacles/30",
                }));
                foreground.push(entity({
                    pos: vec(120, height-60),
                    img: "obstacles/30",
                }));
                foreground.push(entity({
                    pos: vec(150, 420),
                    img: "obstacles/30",
                }));
                foreground.push(entity({
                    pos: vec(180, 420),
                    img: "obstacles/30",
                }));
            }
            if(startCounter < (width-210)/30-16){
                for(let i = 0; i < height/30; i++){
                    obstacles.push(entity({
                        pos: vec(startCounter*30, i*30),
                        img: "obstacles/30",
                    }));
                }
            }

            startCounter += 1;

            if(startCounter > 10) that.started = true;
        }
    }
    that.attack = (WORLD) => {
        if(that.started){
            if(!that.attacking){
                attackCounter += 1;
            }

            if(attackCounter % (60*5) === 0 && !that.attacking){
                that.velocity.y = -0.2;
                that.grounded = false;
                that.loadAttack = true;
            }
            if(that.loadAttack && that.grounded){
                that.loadAttack = false;
                that.attacking = true;
                that.currentAttack = getAttack(that);
                
                WORLD.startingAlpha = 1;
            }

            if(that.attacking){
                that.currentAttack(WORLD);

                //check if atttack was completed
                if(WORLD.points.length === 1){
                    that.attacking = false;
                    that.attackingCounter = 0;
                    that.alpha -= 0.2;
                    return;
                }
                //check if player has colected a point
                if(createdPoints+1 > WORLD.points.length) createdPoints--;
                
                //handle attacks time
                that.attackingCounter--;
                if(that.attackingCounter <= 0){
                    that.attacking = false;
                    //clear created entities
                    WORLD.points.splice(1, createdPoints);
                    //clear arrays
                    createdPoints = 0;
                }
            }
        }
    }
    that.checkDead = ({ enemies }) => {
        if(that.alpha < 0.2){
            enemies.splice(0, enemies.length);
        }
    }
    that.drawAttackingCounter = (ctx) => {
        if(that.attackingCounter !== 0){
            ctx.fillStyle = "red";
            ctx.font = "50px game";
            ctx.fillText(Math.floor(that.attackingCounter/60 + 1), that.center.x - 15, that.pos.y - 5);
        }
    }

    that.addUpdateActions("jump", "attack", "start", "checkDead");
    that.addDrawingActions("drawAttackingCounter");

    return that;
}

const getAttack = (that) => {
    that.attackingCounter = 3*60;

    return ({ points }) => {

        if(that.attackingCounter === 3*60){
            points.push(point(vec(360, 300)));
            createdPoints += 1;
        }

    }
}

export default boss;