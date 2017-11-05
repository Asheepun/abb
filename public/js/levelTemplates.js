import { bouncer, jumper, spawner, giantJumper } from "/js/enemy.js";

const levelTemplates = [
    {
        map: [
            "..............................",
            "..............................",
            "...........................P..",
            "..............................",
            "......................########",
            "....................##########",
            "...............P....##########",
            "....................##########",
            "@...................##########",
            "...............B....##########",
            ".....................#########",
            "....................H#########",
            "##................############",
            "##...........#################",
            "##...........#################",
            "##...........#################",
            "###.........##################",
            "####.......###################",
            "##############################",
            "##############################",
        ],
        help: "Click to move the box!",
    },
    {
        map: [
            "..............................",
            "..............................",
            "..........................P...",
            ".@..........P.................",
            "............................##",
            "#..........####..........#####",
            "###......#######...B...#######",
            "###......#######........######",
            "##.......#######........######",
            "##........######.........#####",
            "##........######.........#####",
            "##.......######..........#####",
            "###......######...........####",
            "###......######...........####",
            "##......#######...........####",
            "#.......########...........###",
            "#H......########...........###",
            "################...........###",
            "#################.........####",
            "#################........#####",
        ],
        help: "Hold down W to jump higher.",
    },
    {
        map: [
            "..............................",
            ".@............................",
            "..............................",
            "......................P.......",
            "#.............................",
            "###..................###....##",
            "###....B....####...######..###",
            "##...........#################",
            "##.............###############",
            "##...............####.........",
            "#.............................",
            "#...........................P.",
            "#H............................",
            "#####......................###",
            "#####.....................####",
            "####......................####",
            "###.......###.............####",
            "###......####..............###",
            "###......###...............###",
            "###.......##................##",
        ],
        help: "Mind the gap!",
    },
    {
        map: [
            "..............................",
            "..............................",
            "..............................",
            "............................P.",
            "..............................",
            "#..........................###",
            "###......................#####",
            "###.......................####",
            "##............P.............##",
            "..............................",
            ".@............................",
            ".......B......................",
            "..............................",
            "###...........................",
            "####..........................",
            "####..........................",
            "###...........................",
            "###...........................",
            "###H..........................",
            "#####.........................",
        ],
        help: "Only a true master can clear this gap!",
    },
    {
        map: [
            "..............................",
            "..............................",
            "..............................",
            ".@..........................P.",
            "..............................",
            "###......................H####",
            "###...................########",
            "###...................########",
            "##...........P.......#########",
            ".....................####...##",
            ".........B..###.......##.....#",
            "............####..........P..#",
            "...........#####..........E..#",
            "...........#####.............#",
            "...........###################",
            "...........###################",
            "..........####################",
            "..........####################",
            "..........####################",
            "..........####################",
        ],
        enemies: [bouncer],
        help: "10 coins if you touch that thing.",
    },
    {
        map: [
            "........###############.......",
            "........###############.......",
            ".........############.........",
            ".@.......###########........P.",
            "..........####..###...........",
            "###........##...###........###",
            "###........##..............###",
            "###.....................B..###",
            "##.........E...P............##",
            "##............................",
            "##............................",
            "##......###..#####..##........",
            "#......####...###.E.###.......",
            "#......####.........###.......",
            "#......######..P..######......",
            "##....########..H#######......",
            "##....##################......",
            "###...###################.....",
            "###...###################.....",
            "###..####################.....",
        ],
        enemies: [jumper, jumper],
        help: "I'm stuck!",
    },
    {
        map: [
            "..........################..##",           
            "..........###############...##",
            "...........###########......##",
            ".@.......#..........E.....E..#",
            "........##......P......###...#",
            "###.....###..........####....#",
            "###....##################...##",
            "###....###############.....###",
            "##.....#######..............##",
            ".......######..P.E.....###..H#",
            "......########..........######",
            "......###.############..######",
            "......###..##########....#####",
            ".....####..#########..........",
            ".....###...##...###...........",
            ".....###P..#..................",
            ".....###...................EP.",
            "....#####E..##................",
            "....#####..#############B#####",
            "....###################..#####",
        ],
        enemies: [bouncer, jumper, bouncer, bouncer, jumper],
    },
    {
        map: [
            "..............................",  
            "..............................",
            "..............................", 
            "..............................",
            "..............................",
            "..............................",  
            "....................EP........",
            "..............................", 
            "................#######.......",
            "...............#########.....#",
            "................#######...####",  
            "..................###......###",
            "..................##..........", 
            "...........................EP.",
            "..............................",
            "...........................###",  
            ".@.......................#####",
            "..............################", 
            "####.B.....###################",
            "####.......###################",
        ],
        enemies: [spawner, spawner],
    },
    {
        map: [
            "..............................",  
            "..............................",
            "..............................", 
            "...........................PE.",
            "..............................",
            ".........................#####",  
            "......................########",
            "...............E......########", 
            "........................######",
            "#.........................####",
            "##..........................##",  
            "#............................#",
            "..............................", 
            ".@..........................EP",
            "..............................",
            "###B.............EP........###",  
            "####......................####",
            "####........##################", 
            "####.....#####################",
            "####.....#####################",
        ],
        enemies: [spawner, giantJumper, spawner, spawner],
    },
];

export default levelTemplates;