var levels = {
    table:[
        0,
        2000,
        4000,
        6000,
        8000,
        10000,
        15000,
        20000,
        25000,
        30000,
        40000,
        50000,
        60000,
        80000,
        100000,
        120000,
        170000,
        220000,
        270000,
        320000,
        400000,
        500000,
        600000,
        700000,
        800000,
        1000000,
        1400000,
        2200000,
        2800000,
        3400000,
        4000000,
        4400000,
        4800000,
        5200000,
        5800000,
        6000000,
        7000000,
        8000000,
        9000000,
        10000000,
    ],
    whatLevel:function(xp) {
        var table = levels.table;
        for(var level=0;level<table.length;level++) {
            if(parseInt(xp)<parseInt(table[level])) {
                return level;
            }
        }
    }
}
exports.levels = levels;