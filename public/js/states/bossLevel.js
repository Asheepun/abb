import entity                        from "/js/engine/factories/entity.js";
import vec                           from "/js/engine/factories/vector.js";
import createLevel, { strEach, set } from "/js/level.js";

let offsetProgress = 0;

const setupBossLevel = (WORLD) => {
    WORLD.enemies = [];
    WORLD.points = [];
    
    WORLD.player.oubArea = [-WORLD.levelTemplates.length*900, 0, WORLD.levelTemplates.length*900+900, 700];
    WORLD.foreground.forEach(x => x.oubArea = [-WORLD.levelTemplates.length*900, 0, WORLD.levelTemplates.length*900+900, 700]);

    WORLD.levelTemplates[10] = levelFix11;
    WORLD.levelTemplates[11] = levelFix12;

    //make following boss
    const that = entity({
        pos: vec(900, 0),
        size: vec(210, 280),
        img: "boss",
        alpha: 0.8,
    });

    that.move = (WORLD) => {
        let speed = that.center.copy()
        .sub(WORLD.player.center)
        .normalize()
        .reverse()
        .mul(2.9);
        
        that.pos.add(speed);
        that.fixCenter();
    }
    that.addUpdateActions("move");

    WORLD.foreground.push(that);

    offsetProgress = 0;
    WORLD.state = bossLevel;
}

const bossLevel = ({ draw, offset, updateAll, player, midground, foreground, background, controlPlayerKeys, box, width, height, sprites, levelTemplates, obstacles, walls, water }, ctx) => {

    controlPlayerKeys();

    updateAll(
        water,
        player,
        midground, 
        foreground, 
        background,
        box,
    );

    if(offset.x < -player.center.x + 450) offset.x = -player.center.x + 450;
    
    if(offsetProgress < Math.floor((offset.x+900)/900)){
        //remove old terrain
        const rmObstacles = obstacles.filter(o => offset.x - 900 > -o.pos.x);
        rmObstacles.forEach(o => {
            if(obstacles.indexOf(o) !== -1) obstacles.remove(o);
        });
        //console.log(rmObstacles);

        //create new terrain
        const newTerrain = createLevel(levelTemplates[levelTemplates.length-2-offsetProgress], -900*(offsetProgress+1));
        newTerrain.obstacles.forEach(o => obstacles.push(o));
        newTerrain.foreground.forEach(g => foreground.push(g));
        newTerrain.walls.forEach(w => walls.push(w));
        newTerrain.water.forEach(w => water.push(w));
        newTerrain.midground.forEach(m => midground.push(m));
        //fix door keys
        midground.forEach(m => {
            if(m.index) m.imgPos = [30, 0, 30, 30];
            m.down = true;
        });

        //console.log(water);
        const doors = obstacles.filter(o => typeof o.index === "number");
        doors.forEach(o => {
            if(obstacles.indexOf(o) !== -1) obstacles.remove(o);
        });
    }
    offsetProgress = Math.floor((offset.x+900)/900);

    if(offset.x < 0) offset.x = 0;

    draw();

}

const levelFix12 = {
    map: [
        ".....######..#################",  
        "........,,,,,,,,##############",
        "........,,,,,,,,,,,,,#########", 
        "..#.....,,,,,,,,,,,,,#########",
        "..##....,,,,,,,,,,,,,#########",
        "..#######,,,,,,,,,,,,#########",  
        "..#######,,,,,,,,,,,,#########",
        "..,######,,,,,,,,,,,,,,#######", 
        "..######,,,,,,,,,,,,,,,,######",
        "...,####,,,,,,,,,,,,##,,######",
        "...,,###,,,,,,,,,,,,##,,######",  
        "...,,,,,,,,,,,,,,,,,,,,,######",
        "..##,,,,,,,,,,,,,,,,,,,#######", 
        "..######,,,,,,,,,,,,,#########",
        "...####,,,,,,,,,,,,,,,,,,,,,,,",
        "##.,,,,,,,,,,,,,,,,,,,,,,,,,,,",  
        "##.,,,,,,,,,,,,,,,,,,,,,,,,,,,",
        "###,,,,,,,,,,,,,,,############", 
        "########,,,,,,,,,#############",
        "########,,,##,,,,#############",
    ],
    helps: ["Do you think I can make that jump?"],
};

const levelFix11 = {
    map: [
        "......################..######",  
        "......########..######..######",
        "......########...####...###...", 
        "......###,,###...###,,,,##....",
        "#......#,,,,,,....#,,,,,,,....",
        "##......,,,,,,....,,,,,,,,....",  
        "###.....,,,,,,....,,,,,,,,....",
        "###.....,,,,,,....,,,,,,,,....", 
        "##......,,,,##....,,,,,,,,..##",
        "##......######....,,,,,,,,..##",
        "#.......######....,,,,,,,,...#",  
        "#......#######....,,,,,,,,....",
        ".......#######....,,,,,,,,....", 
        ".......########...,,,,,,,,....",
        ".......########...#,,,,,,,....",
        "##.....########..##,,,,,,,,...",  
        "##....#########..##,,,,,,,,...",
        "###...#########..##,,,##,,,..#", 
        "###...##########.##,,,##,,,###",
        "####..#############,,###,,,###",
    ],
};

export default setupBossLevel;