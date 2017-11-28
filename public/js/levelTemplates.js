/*
1: bouncer
2: jumper
3: spawner
4: giantJumper
5: follower
6: ghost
{
    map: [
        "..............................",  
        "..............................",
        "..............................", 
        "..............................",
        "..............................",
        "..............................",  
        "..............................",
        "..............................", 
        "..............................",
        "..............................",
        "..............................",  
        "..............................",
        "..............................", 
        "..............................",
        "..............................",
        "..............................",  
        "..............................",
        "..............................", 
        "..............................",
        "..............................",
    ],
},
{
    map: [
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
        ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
    ],
},
*/

const levelTemplates = [
    {
        map: [
            "##########.........6......####",  
            "########...................###",
            "##,,,,|....................,,,", 
            "#,p,,,.....................,P,",
            "#,,,,,.....................,,,",
            "#######...................####",  
            "#######...................####",
            "######....................####", 
            "####.......................###",
            "####.......................###",
            "###........................,##",  
            "###........................,,,",
            "#,@........................,,,", 
            ",,,....6...................,,,",
            ",,§........................,*,",
            ",###.......................###",  
            "####.......................###",
            "####......................####", 
            "####......................####",
            "###.......................####",
        ],
    },
    {
        map: [//20
            "######............6....#######",  
            "#####....................#####",
            "####.................P....,,##", 
            "####......................,,,#",
            "####......................,H,#",
            "####......................####",  
            "###......................#####",
            "###......................#####", 
            "###......................#####",
            "###.......................####",
            "###........................###",  
            "##.........................###",
            "##.........................,##", 
            ",@...6.....................,,,",
            ",,......P..................,P,",
            ",§.........................,,,",  
            "###.......................####",
            "###.......................####", 
            "###.......................####",
            "##.........................###",
        ],
        helps: ["Hello!"],
    },
    {
        map: [//19
            "#######...########....########",  
            "####.......#####,.......######",
            "###.........###,,........#####", 
            "###.........,,,,,.........,,,#",
            "##..........,,,,,.........,,,#",
            "##..........,,P,,....5....,*,#",  
            "..........##,,,,,.......######",
            "..........##,,,,##..##########", 
            ".@......H#########..##########",
            ".......###########..##########",
            ".§......#########....#########",  
            "###.......#####........#######",
            "###........###............####", 
            "####.......,,,............|,,,",
            "####.......,,,.............,p,",
            "####.......,,,.............,,,",  
            "####.......,,,............####",
            "#####......###............####", 
            "#####......####...........####",
            "######....#####............###",
        ],
        helps: ["Save that poor fellow!"],
    },
    {
        map: [//18
            "#######..................#####",  
            "####......................####",
            "##...........................#", 
            ",@..........................p#",
            ",,..........................##",
            ",§...........................#",  
            "###...................#####...",
            "###..................######...", 
            "###....................###....",
            "##.............###............",
            "##............########........",  
            "##.............######........#",
            "#..............,,,,,,.......##", 
            "#..............,,,,,,.......##",
            "...............,,,,,,......###",
            "...............,,,,,##########",  
            "##...........#################",
            "##..........##################", 
            "###.........##################",
            "###.........##################",
        ],
    },
    {
        map: [//17
            "#####.........######...#######",  
            "###.............###.....######",
            ",@.............####.......####", 
            ",,...........#####........|,,,",
            ",§..........######.........,P,",
            "###.........,,,##,.........,,,",  
            "##....#..#..,,,,,,........####",
            "###..##2.##,,,,,1,#...2...####", 
            "#######..##,,,,,,,##.....#####",
            "##############################",
            "##..##########################",  
            "##........#########....#######",
            "...........##,,,##.......#####", 
            ".5..........,,,,,............#",
            "............,,,,,.............",
            "####........,,,,,..........*..",  
            "####........#####.........####",
            "###.........#####..........###", 
            "###.........####...........###",
            "###..........###............##",
        ],
    },
    {
        map: [//16
            "#####..#####......#####....###",  
            "####.....##.........##......##",
            ",@,.......#.........#.......,,", 
            ",,,.......|.........I....P..,,",
            ",§,...........P.............,,",
            "###........................###",  
            "###.......#.........##########",
            "##.......##........###########", 
            "##.......###.....#############",
            "#........#####################",
            "#.......*############...######",  
            "###....##########..........###",
            "###....########..............#", 
            "##......######................",
            "#.......#####...............3.",
            "#.......#####.o...............",  
            "#......#########...........###",
            "##.....########............###", 
            "##.....#######..............##",
            "###....#######...............#",
        ],
    },
    {
        map: [//15
            "#####...................######",  
            "####......................####",
            ",,,........................,,,", 
            ",5,........................,P,",
            ",,,........................,,,",
            "###........................###",  
            "###........................###",
            "##.....................#######", 
            "##.P.................#########",
            "#................P....,,,#####",
            "######................,,,,,,,#",  
            "###################...,,,,,,,#",
            "#######################,,,,,,#", 
            "#########################,,,,#",
            "################,,,,,###,,,,##",
            ",@,,,,,,,,,,,,,,,,,,,,,,,,,,##",  
            ",,,,,,,,,,,,,,,,,,,,,,,,,,,,##",
            ",§,,,,,,,,,,,,,,,,,,,,,,,,,###", 
            "##################,,,,########",
            "###################,,,########",
        ],
    },
    {
        map: [//14
            "#####.....................#####",  
            "###........................###",
            "##.........................###", 
            "@,..........................,,",
            ",,...............5........P.,,",
            "§,..........................##",  
            "###..B..#####...##...#########",
            "###......####...##...#########", 
            "###.......##..........########",
            "###........................###",
            "##.............P...........###",  
            "##.........................###",
            "####.........######.........##", 
            "########....#######......#####",
            "########,,,,,,###,,,,,,,,,####",
            "###,,,,,,,,,,,,,,,,,,,,,,,,,,,",  
            "##,,P,,,,,,,,,,,,,,,,,,,,,,,P,",
            "##,,,,,,,,,,,,,,,,,,,,,,,,,,,,", 
            "#########,,,##################",
            "#########,,,##################",
        ],
    },
    {
        map: [//13
            "########..#########....#######",  
            "######.....########......#####",
            "#####.......######........####", 
            "#####.......,,,,,..........,,,",
            "#,,,........,,P,,..........,P,",
            "#5P,........,,,,,..........,,,",  
            "#,,,........,,,,,..........###",
            "#########..#######..##########", 
            "#########..#######..##########",
            "########....#####....#########",
            "###.........,,,,,......#######",  
            "##..........,,,,,......##.####",
            "##..........,,P,,.....###..###", 
            "#...........,,,,,########..###",
            "@...........,,,,#########..###",
            ",..........#############...###",  
            "§.........#############.....##",
            "##.........####.#######.....##", 
            "##..........##...#####......##",
            "###........###...#####.......#",
        ],
    },
    {
        map: [//12
            ".....#########################",  
            "........,,,,,,,,##############",
            ".....@..,,,,,,,,,,,,,#########", 
            "..#.....,,,,,,,,,,,,,#########",
            "..##.§..,,,,,,,,,,,,,#########",
            "..#######,,,,,,,,,,,,#########",  
            "..#######,,,,,,,,,,,,#########",
            "..,######,,,,,,,,,,,,,,#######", 
            "..######,,,,,,,,,,,,H,,,######",
            "...,####,,,,,,,,,,,,##,,######",
            "...,,###,,,,,,,,,,,,##,,######",  
            "...,,,,,,,,,,,,,,,,,,,,,######",
            "..##,,,,,,,,,,,,,,,,,,,#######", 
            "2.######,,,,,,,,,,,,,#########",
            "...####,,,,,,,,,,,,,,,,,,,,,,,",
            "##.,,,,,,,,,,,,,,,,,,,,,,,,P3,",  
            "##.,P,,,,,,,,,,,,,,,,,,,,,,,,,",
            "###,,,,,,,,,,,,,,,############", 
            "########,,,,,,,,,#############",
            "########,,,,,,,,,#############",
        ],
        helps: ["Do you think I can make that jump?"],
    },
    {
        map: [//11
            "......########################",  
            "......########..##############",
            ".@....########...##########...", 
            "......###,,###...###,,,,##....",
            "#§.....#,,,,,,....#,,,,,,,....",
            "##......,,,,,,....,,,,,,,,....",  
            "###.....,,P,,,....,,,,,,,,..P.",
            "###.....,,,,,,....,,,,,,,,....", 
            "##......,,,,##....,,,,,,,,..##",
            "##......######..B.,,,,,,,,..##",
            "#.......######....,,,,,,,,...#",  
            "#......#######....,,,,,,,,....",
            ".......#######....,,,,,,,,....", 
            ".......########...,,,,,,,,....",
            ".......########...#,,,,,,,....",
            "##.....########..##,,,,,,,,...",  
            "##....#########..##,,,,,,,,...",
            "###...#########..##,,,,,,,,..#", 
            "###...##########.##,,,,,,,,###",
            "####..#############,,,,,,,,###",
        ],
    },
    {
        map: [//10
            "..............################",  
            "................##############",
            ".@...............###..........", 
            "............................P.",
            ".§............................",
            "###......H...........H########",  
            "###.....###....###############",
            "###....####......#############", 
            "##.....###..........##########",
            "##......##...............#####",
            "##......##................$###",  
            "##......##H................###",
            "#.......####.............#####", 
            "#.......####..............####",
            "#.......###................###",
            "##.....####................###",  
            "##.....####................###",
            "##.....#####..............####", 
            "###...######............######",
            "#############.........########",
        ],
        helps: [
            "We are very social here.", 
            "Press H on your keyboard to return to our home.",
            "Talk to my friend over there to get ya pay.",
        ],
    },
    {
        map: [//9
            "..............................",  
            "..............................",
            "..............................", 
            "...........................P3.",
            "..............................",
            ".........................#####",  
            "......................########",
            "...............4......########", 
            "H.......................######",
            "##........................####",
            "###.........................##",  
            "#............................#",
            "..............................", 
            ".@............B.............3P",
            ".§............................",
            "###..............3P........###",  
            "####......................####",
            "####........##################", 
            "###.....######################",
            "###.....######################",
        ],
        helps: ["Timing is key."],
    },
    {
        map: [//8
            "######........................",  
            "####..........................",
            "####..........................", 
            "###...........................",
            "###...........................",
            "###...........................",  
            "###.................3P........",
            "##............................", 
            "##..............#######.......",
            "##.............#########.....#",
            "#...............#######...####",  
            "#.................###......###",
            "#.................##..........", 
            "...........................3P.",
            "..............................",
            "...........................###",  
            ".@.....................#######",
            ".§............################", 
            "####.B.....###################",
            "####.......###################",
        ],
    },
    {
        map: [//7
            "..........################..##",           
            "..........###############...##",
            "...........###########......##",
            ".@.......#..........1.....2..#",
            ".§......##......P......###...#",
            "###.....###..........####....#",
            "###....##################...##",
            "###....###############.....###",
            "##.....#######..............##",
            ".......######..P.1.....###..H#",
            "......########..........######",
            "......###.############..######",
            "......###..##########....#####",
            ".....####..#########..........",
            ".....###...##....##...........",
            ".....###P..#..................",
            ".....###...................1P.",
            "....#####2..##................",
            "....#####..#############B#####",
            "....###################..#####",
        ],
        helps: ["Hey ol' chap!"],
    },
    {
        map: [//6
            "........###############.......",
            "........###############.......",
            ".........############.........",
            ".@........##########........P.",
            ".§........####..###...........",
            "###........##...###........###",
            "###........##..............###",
            "###.....................B..###",
            "##.........2...P............##",
            "##............................",
            "##............................",
            "##......###..#####..##........",
            "#......####...###.2.###.......",
            "#......####.........###.......",
            "#......######..P..######......",
            "##....########..H#######......",
            "##....##################......",
            "###...###################.....",
            "###...###################.....",
            "###..####################.....",
        ],
        helps: ["I'm stuck!"],
    },
    {
        map: [//5
            "..............................",
            "..............................",
            "..............................",
            ".@..........................P.",
            ".§............................",
            "###......................H####",
            "###...................########",
            "###...................########",
            "##...........P.......#########",
            ".....................####...##",
            ".........B..###.......##.....#",
            "............####..........P..#",
            "...........#####..........1..#",
            "...........#####.............#",
            "...........###################",
            "...........###################",
            "..........####################",
            "..........####################",
            "..........####################",
            "..........####################",
        ],
        helps: ["Think outside the box!"],
    },
    {
        map: [//4
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
            ".§............................",
            "###...........................",
            "####..........................",
            "####..........................",
            "###...........................",
            "###...........................",
            "###H..........................",
            "#####.........................",
        ],
        helps: ["Only a true master can clear this gap!"],
    },
    {
        map: [//3
            "..............................",
            ".@............................",
            "..............................",
            "......................P.......",
            "#§............................",
            "###...........H......###....##",
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
        helps: ["You can go through the sides and bottom of your box!", "Mind the gap!"],
    },
    {
        map: [//2
            "..............................",
            "..............................",
            "..........................P...",
            ".@..........P.................",
            "............................##",
            "#§.........####..........#####",
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
        helps: ["Wish ya good luck!"],
    },
    {
        map: [//1
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
            "§...................H#########",
            "##................############",
            "##...........#################",
            "##...........#################",
            "##...........#################",
            "###.........##################",
            "####.......###################",
            "##############################",
            "##############################",
        ],
        helps: ["Click to move the box!"],
    },
];

levelTemplates.reverse();

export default levelTemplates;