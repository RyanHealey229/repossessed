var grid = [['_','_','_','O','_','_','_'],
    ['_','B','_','_','G','Y','_'],
    ['_','_','_','B','R','_','_'],
    ['_','_','_','Y','_','_','_'],
    ['_','_','_','_','_','_','_'],
    ['_','_','R','_','_','_','_'],
    ['G','_','_','_','O','_','_']];

var possibilities= []

var colors = ['o','b','g','r','y'];
if (solvePipe(grid, colors) == true)
    console.log(grid);
else
    console.log("No Solution");


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
    for (var i = 0; i < colorList.length; i++)
    {
        var color = colorList[i];
        if (possibleAssignment(grid, rc[0], rc[1], color)){
            grid[rc[0]][rc[1]] = color;
            if (solvePipe(grid, colorList))
                return true;
            grid[row][col] == '_';
        };
    };
    return false;
};


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
function lessThan3Neighbors (grid, r, c, val)
{
    var counter = 0;
    if (r<0 || c < 0 || r>= grid.length || c >= grid.length)
        return true;
    if (r+1 < grid.length)
        if (grid[r+1][c] == val)
            counter++;
    if (r-1 >= 0)
        if (grid[r-1][c] == val)
            counter++;
    if (c+1 < grid.length)
        if (grid[r][c+1] == val)
            counter++;
    if (c-1 >= 0)
        if (grid[r][c-1] == val)
            counter++;
    console.log(counter);
    return  counter <=2;
}


//determines if a location can be assigned a val
function possibleAssignment (grid, r, c, val)
{
    //we need to describe the constraints here
    grid[r][c] = val;

    var check =  lessThan3Neighbors(grid,r,c, val)&&
        lessThan3Neighbors(grid,r+1, c, val) && lessThan3Neighbors(grid,r, 1+c, val)
        &&lessThan3Neighbors(grid,r-1, c, val)&&lessThan3Neighbors(grid,r, c-1, val);
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