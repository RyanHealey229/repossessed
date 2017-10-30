var grid = [['_','_','_','O','_','_','_'],
    ['_','B','_','_','G','Y','_'],
    ['_','_','_','B','R','_','_'],
    ['_','_','_','Y','_','_','_'],
    ['_','_','_','_','_','_','_'],
    ['_','_','R','_','_','_','_'],
    ['G','_','_','_','O','_','_']];

var countNeighbors =
    [[0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]];
var countSameNeighbors =
    [[0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]];

var visited = [];
var assignments = 0;

var source =[['_','_','_','O','_','_','_'],
    ['_','B','_','_','G','Y','_'],
    ['_','_','_','B','R','_','_'],
    ['_','_','_','Y','_','_','_'],
    ['_','_','_','_','_','_','_'],
    ['_','_','R','_','_','_','_'],
    ['G','_','_','_','O','_','_']];
var possibilities=     [[[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[]]];

//var PriorityQueue = require('priorityqueuejs');
//var queue = new PriorityQueue(function(a,b){return a.cash = b.cash});
//figure out how to define priority queue
var colors = ['Y','B','G','R','O'];

for (var j = 0; j < countSameNeighbors.length; j++){
    for (var k =0; k< countSameNeighbors.length; k++){
        updateGrid(grid,countNeighbors, countSameNeighbors, j, k);
        possibilities[j][k] = colors;
    }
}

for (var j = 0; j < countSameNeighbors.length; j++){
    for (var k =0; k< countSameNeighbors.length; k++){
        updateForwardcheck(grid,possibilities,j,k);
    }
}

if (solvePipe(grid, colors) == true)
    console.log(grid);
else
    console.log("No Solution");

function solvePipe(grid, colorList, r, c)
{
    var rc = [0,0];
    if (!anyUnassigned(grid, rc))
        return true;
    for (var i = 0; i < colorList.length; i++)
    {
    //    console.log("length", colorList.length);
        var color = colorList[i];
  //      console.log("it's me, mr. meeseeks");
//        console.log(rc);
        if (possibleAssignment(grid, rc[0], rc[1], color)){
            visited.push(rc);
      //      console.log("see me");
            assignments++;
            grid[rc[0]][rc[1]] = color;
        //    console.log(grid);
            if (solvePipe(grid, colorList)) {
                return true;
            }
      //      console.log("old rc", rc);
            //getLast(grid,rc);
            rc = visited.pop();
            grid[rc[0]][rc[1]] = "_";
       //     console.log("tried to back it up");
        }
    }
    //console.log("here");
    //console.log(grid);
    return false;
}


//Searches for any unassigned grid elements
function anyUnassigned(grid, rc) //why do I need row and col?
{
    for (var r = 0; r < grid.length; r++){
        for (var c = 0; c < grid.length; c++){
            if (grid[r][c] == '_') {
                rc[0] = r;
                rc[1] = c;
                return true;
            }
        }
    }
    return false;
}

function updateForwardcheck(grid,fcgrid,r,c) {
    var neighborColors =[];
    if (r + 1 < grid.length) {
        if (grid[r + 1][c]
            counter++;
        if (grid[r + 1][c] != "_")
            neighbors++;
    }
    else neighbors++;
    if (r - 1 >= 0) {
        if (grid[r - 1][c] == val)
            counter++;
        if (grid[r - 1][c] != "_")
            neighbors++;
    }
    else neighbors++;
    if (c + 1 < grid.length) {
        if (grid[r][c + 1] == val)
            counter++;
        if (grid[r][c + 1] != "_")
            neighbors++;
    }
    else neighbors++;
    if (c-1 >= 0) {
        if (grid[r][c - 1] == val)
            counter++;
        if (grid[r][c - 1] != "_")
            neighbors++;
    }
    else neighbors++;
}
//if 1 neighbor --> any color
//if 2 neighbors --> any color
//if 3 colors -->one of neighboring colors if all 3 different
                //anything if pair of neighboring colors
                //broken if 3 neighbors has same color
//if 4 colors --> color that is common with 2 neighbors
function updateGrid (grid,neighborgrid,samegrid,r,c) {
    var neighbors = 0;
    var counter = 0;
    var val = grid[r][c];
    if (r + 1 < grid.length) {
        if (grid[r + 1][c] == val)
            counter++;
        if (grid[r + 1][c] != "_")
            neighbors++;
    }
    else neighbors++;
    if (r - 1 >= 0) {
        if (grid[r - 1][c] == val)
            counter++;
        if (grid[r - 1][c] != "_")
            neighbors++;
    }
    else neighbors++;
    if (c + 1 < grid.length) {
        if (grid[r][c + 1] == val)
            counter++;
        if (grid[r][c + 1] != "_")
            neighbors++;
    }
    else neighbors++;
    if (c-1 >= 0) {
        if (grid[r][c - 1] == val)
            counter++;
        if (grid[r][c - 1] != "_")
            neighbors++;
    }
    else neighbors++;
    neighborgrid[r][c] = neighbors;
    //console.log(samegrid,r,c);
    samegrid[r][c] = counter;
}

//cannot zigzag --> checks for that
function lessThan3Neighbors (grid, r, c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid.length)
        return true;
    val = grid[r][c];
    if (val == "_") {
        return true;
    }
    var neighbors = 0;
    var counter = 0;
    if (r + 1 < grid.length) {
        if (grid[r + 1][c] == val)
            counter++;
        if (grid[r + 1][c] != "_")
            neighbors++;
    }
    else neighbors++;
    if (r - 1 >= 0) {
        if (grid[r - 1][c] == val)
            counter++;
        if (grid[r - 1][c] != "_")
            neighbors++;
    }
    else neighbors++;
    if (c + 1 < grid.length) {
        if (grid[r][c + 1] == val)
            counter++;
        if (grid[r][c + 1] != "_")
            neighbors++;
    }
    else neighbors++;
    if (c-1 >= 0) {
        if (grid[r][c - 1] == val)
            counter++;
        if (grid[r][c - 1] != "_")
            neighbors++;
    }
    else neighbors++;
    //console.log(neighbors,counter);
    if (source[r][c] == "_") {
        if (neighbors == 4)
            return counter == 2;
        return counter <= 2;
    }
    else {
        if (neighbors == 4)
            return counter == 1;
        return counter <= 1;
    }
}

//determines if a location can be assigned a val
function possibleAssignment (grid, r, c, val)
{
    //we need to describe the constraints here
    grid[r][c] = val;
    var check =  lessThan3Neighbors(grid,r,c)&&
        lessThan3Neighbors(grid,r+1, c) && lessThan3Neighbors(grid,r, 1+c)
        &&lessThan3Neighbors(grid,r-1, c)&&lessThan3Neighbors(grid,r, c-1);
    grid[r][c] = "_";
    return check;
}