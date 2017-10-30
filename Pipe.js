var grid = [['_','_','_','O','_','_','_'],
    ['_','B','_','_','G','Y','_'],
    ['_','_','_','B','R','_','_'],
    ['_','_','_','Y','_','_','_'],
    ['_','_','_','_','_','_','_'],
    ['_','_','R','_','_','_','_'],
    ['G','_','_','_','O','_','_']];

var source =[['_','_','_','O','_','_','_'],
    ['_','B','_','_','G','Y','_'],
    ['_','_','_','B','R','_','_'],
    ['_','_','_','Y','_','_','_'],
    ['_','_','_','_','_','_','_'],
    ['_','_','R','_','_','_','_'],
    ['G','_','_','_','O','_','_']];
/*
//8x8
var grid =[['_','_','_','R','_','_','G','_'],
['_','B','Y','P','_','_','_','_'],
['_','_','_','O','_','G','R','_'],
['_','_','_','P','_','_','_','_'],
['_','_','_','_','_','_','Y','_'],
['_','_','_','_','B','O','Q','_'],
['_','Q','_','_','_','_','_','_'],
['_','_','_','_','_','_','_','_']];

var source =[['_','_','_','R','_','_','G','_'],
    ['_','B','Y','P','_','_','_','_'],
    ['_','_','_','O','_','G','R','_'],
    ['_','_','_','P','_','_','_','_'],
    ['_','_','_','_','_','_','Y','_'],
    ['_','_','_','_','B','O','Q','_'],
    ['_','Q','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_']];

/*
var grid = [['B','_','_','R','O'],
['_','_','_','Y','_'],
['_','_','Y','_','_'],
['_','R','O','_','G'],
['_','B','G','_','_']];

var source = [['B','_','_','R','O'],
    ['_','_','_','Y','_'],
    ['_','_','Y','_','_'],
    ['_','R','O','_','G'],
    ['_','B','G','_','_']];
*/
var assignments = 0;
var colors = ['O','B','G','R','Y'];
var visited = [];
if (solvePipe(grid, colors) == true)
    console.log(grid);
else
    console.log("No Solution");
console.log("Assignments: ", assignments);

function readTextFile(path)
{
    var text = null;
    var file = new XMLHttpRequest();
    file.open("GET", path, false);
    file.onreadystatechange = function() {
        if (file.readyState === 4) {
            if (file.status === 200 || file.status == 0) {
                text = file.responseText;
            }
        }
    }
    file.send(null);
    return text;
}

// function getGrid(path)
// {
//     var text = readTextFile(path);
//
// }

function solvePipe(grid, colorList)
{
    var rc = [0,0];
   // console.log(grid);
    if (!anyUnassigned(grid, rc))
        return true;
    //console.log ("new rc", rc);
    //console.log(rc);
    //console.log(colorList);
    // secret.push(rc);
    // console.log(secret);/
    for (var i = 0; i < colorList.length; i++)
    {
        console.log("length", colorList.length);
        var color = colorList[i];
        console.log("it's me, mr. meeseeks");
        console.log(rc);
        if (possibleAssignment(grid, rc[0], rc[1], color)){
            visited.push(rc);
            console.log("see me");
            assignments++;
            grid[rc[0]][rc[1]] = color;
            console.log(grid);
            if (solvePipe(grid, colorList)) {
                return true;
            }
            console.log("old rc", rc);
            //getLast(grid,rc);
            rc = visited.pop();
            grid[rc[0]][rc[1]] = "_";
            console.log("tried to back it up");
        }
    }
    console.log("here");
    console.log(grid);
    return false;
}


//Searches for any unassigned grid elements
function anyUnassigned(grid, rc) //why do I need row and col?
{
    for (var c = 0; c < grid.length; c++){
        for (var r = 0; r < grid.length; r++){
            if (grid[r][c] == '_') {
                rc[0] = r;
                rc[1] = c;
                return true;
            }
        }
    }
    return false;
}

function getLast(grid,rc)
{
    console.log('getting last');
    console.log(rc);
    anyUnassigned(grid, rc);
    if (rc[0]-1 < 0){
        rc[1] --;
        rc[0] = 6;
    }
    else{
        rc[0] = rc[0]-1;
    }
    console.log(rc);
    while(source[rc[0]][rc[1]] != '_') {
        if (rc[0] - 1 < 0) {
            rc[1]--;
            rc[0] = 6;
        }
        else {
            rc[0] = rc[0] - 1;
        }
    }
}
/*
//checks if any element in a row matches val
function anyRow(grid,r,val)
{
        for (var i = 0; i < grid.length; i++)
        {
                if (grid[r][i] == val)
                        return true;
        }
        return false;
}

//checks if any element in a col matches val
function anyCol(grid,c,val)
{
        for (var i = 0; i < grid.length; i++)
        {
                if (grid[i][c] == val)
                        return true;
        }
        return false;
}

//checks if val matches around a location
function anyBox(grid,r,c,val)
{
        for (row = 0; row <3; row ++)
        {
                for (col = 0; col < 3; col ++)
                {
                        if (grid[row+r][col+c] == val)
                                return true;
                }
        }
        return false;
}*/
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
    //console.log("before",r,c);
    var check =  lessThan3Neighbors(grid,r,c)&&
        lessThan3Neighbors(grid,r+1, c) && lessThan3Neighbors(grid,r, 1+c)
        &&lessThan3Neighbors(grid,r-1, c)&&lessThan3Neighbors(grid,r, c-1);
   // console.log("after",r,c);
    grid[r][c] = "_";
    return check;
}

function printPipe(grid)
{
    for (var i =0; i<grid.length; i++)
    {
        for (var j = 0; j<grid.length; j++)
        {
            console.log(grid[i][j]);
        }
        console.log("\n");
    }
}