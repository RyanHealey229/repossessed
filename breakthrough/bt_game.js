//===================================================================
//  BT_Game Implementation                                         //
//===================================================================

//===================================================================
// Define Classes

// Define piece member variables
function Piece(rr, cc, pp) {
	this.row = rr;
	this.col = cc;
	this.player = pp;
}

// Define board member variables and initialization
function Board(board) {
	var p;
	var piece;
	this.grid = [];
	this.pieces = [[],[],[]];
	if (!board)
		this.clear();
	else
		this.copy(board);
}

// Define BT_Game Member Variables
// p1str and p2str declare search function and heuristic
// use3 declares if game should use '3 Workers to Base' rules
function BT_Game(p1str, p2str, use3) {
	// Player strings: 'usr1', 'mmD1', 'mmD2', 'abD1', 'abD2', 'abO1', 'abO2'
	this.p1 = p1str;
	this.p2 = p2str;
	this.three_workers = use3;
	this.expanded = 0;
	this.num_moves = 0;
	this.time = 0;
	this.won = false;
	this.winboard = null;
	this.html = [];
}


//===================================================================
// Initialize Board

// Initialize Breakthrough
BT_Game.prototype.start = function() {
	this.expanded = 0;
	this.num_moves = 0;
	this.time = 0;
	this.won = false;
	this.html = [];
	var board = new Board(null);
	this.printGrid(board.grid);
	this.updateHTML(board.grid);
	this.play_r(board, this.p1, this.p2);
}

// Make a fresh board
Board.prototype.clear = function() {
	this.score = 0;
	this.grid = [];
	this.pieces = [[],[],[]];
	for (var row = 0; row < 8; row++) {
		this.grid.push([]);
		if (row < 2) p = 2;
		else if (row > 5) p = 1;
		else p = 0;
		for (var col = 0; col < 8; col++) {
			piece = new Piece(col,row,p)
			this.grid[row].push(piece);
			this.pieces[p].push(piece);
		}
	}
}

// Copy a board
Board.prototype.copy = function(board) {
	this.score = board.score;
	this.grid = [];
	this.pieces = [[],[],[]];
	for (var row = 0; row < 8; row++) {
		this.grid.push([]);
		for (var col = 0; col < 8; col++) {
			p = board.grid[row][col].player;
			piece = new Piece(row, col, p);
			this.grid[row].push(piece);
			this.pieces[p].push(piece);
		}
	}
}

//===================================================================
// Play

// Main loop: Recursively play a move for each player
// Times moves and checks for wins
// Blocks staggered by time to allow visualization
BT_Game.prototype.play_r = function(board, p1, p2) {
	var board_copy = new Board(board);
	var moveChoice = (0, 0, 0, 0); // (row, col, dx, score)
	var start_time, end_time;

	// Player 1 move
	this.num_moves++;
	start_time = new Date().getTime();
	moveChoice = this.getMove(board_copy, p1, p2, true);
	this.move(board_copy, board_copy.grid[moveChoice[0]][moveChoice[1]], moveChoice[2]);

	// Show board
	//this.printGrid(board_copy.grid);
	this.updateHTML(board_copy.grid);

	// Check win
	end_time = new Date().getTime();
	this.time += end_time-start_time;
	if (this.checkWin(board_copy) == 1) {
		this.won = true;
		this.winboard = board_copy;
		this.printWin();
		return;
	} else {
	  var that = this;
	  setTimeout(function() {

	    	// Player 2 move
	   	this.num_moves++;
	    	start_time = new Date().getTime();
	    	moveChoice = that.getMove(board_copy, p2, p1, false);
	  	that.move(board_copy, board_copy.grid[moveChoice[0]][moveChoice[1]], moveChoice[2]);

	  	// Show board
	  	//that.printGrid(board_copy.grid);
	    	that.updateHTML(board_copy.grid);

	    	// Check win
	    	end_time = new Date().getTime();
	    	this.time += end_time-start_time;
	    	if (that.checkWin(board_copy) == 2) {
			that.won = true;
			that.winboard = board_copy;
			that.printWin();
			return;
		} else {
		  var that2 = that;
	     	  setTimeout(function() {
		  	that2.play_r(board_copy, p1, p2);
	      	  }, 300);
		}
	  }, 300);
	}
}

//===================================================================
// Show board

// Print grid to console as text
BT_Game.prototype.printGrid = function(grid) {
	var logtext = "";
	logtext += "  |0 1 2 3 4 5 6 7\n";
	logtext += "--+----------------\n";
	for (var i = 0; i < 8; i++) {
		logtext += i;
		logtext += "|";
		for (var j = 0; j < 8; j++) {
			if      (grid[i][j].player == 1) logtext += " X";
			else if (grid[i][j].player == 2) logtext += " O";
			else                             logtext += " _";
		}
		logtext += "\n";
	}
	console.log(logtext);
}

// Used to visualize pieces via html and css
BT_Game.prototype.updateHTML = function(grid) {
	var htmltext = "";
	for (var i = 0; i < 8; i+=2) {
		htmltext += "<div class='row'>";
		for (var j = 0; j < 7; j+=2) {
			htmltext += "<div class='space space_b'>";
			if (grid[i][j].player == 1)
				htmltext += "<div class='piece p1'></div>";
			if (grid[i][j].player == 2)
				htmltext += "<div class='piece p2'></div>";
			htmltext += "</div><div class='space space_w'>";
			if (grid[i][j+1].player == 1)
				htmltext += "<div class='piece p1'></div>";
			if (grid[i][j+1].player == 2)
				htmltext += "<div class='piece p2'></div>";
			htmltext += "</div>";
		}
		htmltext += "</div><div class='row'>";
		for (var j = 0; j < 7; j+=2) {
			htmltext += "<div class='space space_w'>";
			if (grid[i+1][j].player == 1)
				htmltext += "<div class='piece p1'></div>";
			if (grid[i+1][j].player == 2)
				htmltext += "<div class='piece p2'></div>";
			htmltext += "</div><div class='space space_b'>";
			if (grid[i+1][j+1].player == 1)
				htmltext += "<div class='piece p1'></div>";
			if (grid[i+1][j+1].player == 2)
				htmltext += "<div class='piece p2'></div>";
			htmltext += "</div>";
		}
		htmltext += "</div>";
	}
	this.html.push(htmltext);
	$('#board').html(htmltext);
}

//===================================================================
// Search by strategy

// Switchboard for moves by search function
BT_Game.prototype.getMove = function(board, player, opponent, isP1) {
	//console.log("Getting Move");
	var eval = player[2] + player[3];
	var eval2 = opponent[2] + '1';

	// User
	if (player[0] == 'u') return this.userMove(board, isP1);

	// Minimax
	else if (player[0] == 'm') return this.minimax(board, 3, isP1, eval); 

	// Alpha-Beta
	else if (player[0] == 'a') return this.alphabeta(board, 4, -Infinity, Infinity, isP1, eval);

	// Greedy
	else if (player[0] == 'g') return this.alphabeta(board, 1, -Infinity, Infinity, isP1, eval);

	// Default
	else {
		console.log('Invalid player');
		return [0, 0, 0, 0];
	}
}

// User Move
// Get user input and convert to a move
BT_Game.prototype.userMove = function(board, isP1) {
	//console.log("Getting User Move");
	this.printGrid(board.grid);
	var prompt_txt, invars, row, col, dx, pc;
	var p = (isP1 ? 1 : 2);
	var valid = false;
	while (!valid) {
		prompt_txt = "Player " + p + " move(row col dx): ";
		input = prompt(prompt_txt);
		if (input) {
			invars = input.split(' ');
			row = parseInt(invars[0]);
			col = parseInt(invars[1]);
			dx = parseInt(invars[2]);
			pc = board.grid[row][col];
			//console.log(pc.row, pc.col, dx);
			valid = (pc.player == p && this.validMove(board, pc, dx));
			if (!valid) console.log("invalid move: try again");
		}
	}
	//console.log(pc.row, pc.col, dx, 0);
	var m = [pc.row, pc.col, dx, 0];
	return m;
}

// Minimax Search
// Alternates between maximum and minimum scoring to simulate other player
// Returns a move
BT_Game.prototype.minimax = function(board, depth, isMax, eval) {
	//console.log("Getting Minimax Move");
	if (depth == 0 || this.checkWin(board)) return [0, 0, 0, this.getEval(board, isMax ? 1 : 2, eval)];
	var best, m, m2, board_copy;
	var moves = this.getMoves(board, isMax);
	if (moves.length == 0) console.log('out of moves');
	if (isMax) {
		//console.log('max');
		best = [0, 0, 0, -Infinity];
		for (var i = 0; i < moves.length; i++) {
			m = moves[i];
			board_copy = new Board(board);
			if (this.move(board_copy, board_copy.grid[m[0]][m[1]], m[2])) {
				this.expanded++;
				m2 = this.minimax(board_copy, depth-1, false, eval);
				m[3] = m2[3];
				if (m[3] > best[3]) best = m;
			}
		}
	} else {
		//console.log('min');
		best = [0, 0, 0, Infinity];
		for (var i = 0; i < moves.length; i++) {
			m = moves[i];
			board_copy = new Board(board);
			if (this.move(board_copy, board_copy.grid[m[0]][m[1]], m[2])) {
				this.expanded++;
				m2 = this.minimax(board_copy, depth-1, true, eval);
				m[3] = m2[3];
				if (m[3] < best[3]) best = m;
			}
		}
	}
	//console.log(best);
	return best;
}

// Alpha-Beta Pruning Search
// Like minimax, but does not expand nodes which will not produce a better value
// Returns a move
BT_Game.prototype.alphabeta = function(board, depth, a, b, isMax, eval) {
	//console.log("Getting Alpha-Beta Move");
	if (depth == 0 || this.checkWin(board)) return [0, 0, 0, this.getEval(board, isMax ? 1 : 2, eval)];
	var best, m, m2, board_copy;
	var moves = this.getMoves(board, isMax);
	if (moves.length == 0) console.log('out of moves');
	if (isMax) {
		best = [0, 0, 0, -Infinity];
		for (var i = 0; i < moves.length; i++) {
			m = moves[i];
			board_copy = new Board(board);
			if (this.move(board_copy, board_copy.grid[m[0]][m[1]], m[2])) {
				this.expanded++;
				m2 = this.alphabeta(board_copy, depth-1, a, b, false, eval);
				m[3] = m2[3];
				if (a > m[3]) a = m[3];
				if (b <= a) break;
				if (m[3] > best[3]) best = m;
			}
		}
	} else {
		best = [0, 0, 0, Infinity];
		for (var i = 0; i < moves.length; i++) {
			m = moves[i];
			board_copy = new Board(board);
			if (this.move(board_copy, board_copy.grid[m[0]][m[1]], m[2])) {
				this.expanded++;
				m2 = this.alphabeta(board_copy, depth-1, a, b, true, eval);
				m[3] = m2[3];
				if (b < m[3]) b = m[3];
				if (b <= a) break;
				if (m[3] < best[3]) best = m;
			}
		}
	}
	return best;
}

//===================================================================
// Get potential moves from a board

BT_Game.prototype.getMoves = function(board, isP1) {
	var p = isP1 ? 1 : 2;
	var moves = [];
	var pieces = board.pieces[p];
	var len = 0;
	for (var i = 0; i < pieces.length; i++) {
		pc = pieces[i];
		for (var j = -1; j < 2; j++) {
			moves.push([]);
			moves[len].push(pc.row);
			moves[len].push(pc.col);
			moves[len].push(j);
			moves[len].push(0);
			len++;
		}
	}
	//console.log(moves);
	return moves;
}

//===================================================================
// Evaluate board

// Switchboard to use appropriate heuristic based on selected players
BT_Game.prototype.getEval = function(board, p, eval) {
	if (eval[0] == 'D') {
		if (eval[1] == '1') {
			return this.evalD1(board, p);
		} else if (eval[1] == '2') {
			return this.evalD2(board, p);
		}
	} else if (eval[0] == 'O') {
		if (eval[1] == '1') {
			return this.evalO1(board, p);
		} else if (eval[1] == '2') {
			return this.evalO2(board, p);
		}
	}
	return 0;
}

// First Defensive Heuristic
BT_Game.prototype.evalD1 = function(board, p) {
	return 2*(30-board.pieces[3-p].length) + Math.random();
}

// First Offensive Heuristic
BT_Game.prototype.evalO1 = function(board, p) {
	return 2*(board.pieces[p].length) + Math.random();
}

// Second Defensive Heuristic
BT_Game.prototype.evalD2 = function(board, p) {
	// More focused on preventing the enemy from moving into your territory or capturing your pieces
	// Should beat evalO1 3/4 times
	var o = 3-p;
	var pCount = board.pieces[p].length;
	var oCount = board.pieces[o].length;
	var oMinDist = 8;
	var oMaxDist = 0;
	var dist;
	for (var i = 0; i < oCount; i++) {
		dist = (o-1)*7+(3-2*o)*board.pieces[o][i].row;
		if (dist < oMinDist) oMinDist = dist;
		if (dist > oMaxDist) oMaxDist = dist;
	}
	var score = (2*oMinDist + oMaxDist) + Math.pow(pCount, 4);
	return score + Math.random();
}

// Second Offensive Heuristic
BT_Game.prototype.evalO2 = function(board, p) {
	// More focused on moving forward and capturing enemy pieces
	// Should beat evalD2 3/4 times
	var pCount = board.pieces[p].length;
	var oCount = board.pieces[3-p].length;
	var pMinDist = 8;
	var pMaxDist = 0;
	var dist;
	for (var i = 0; i < pCount; i++) {
		dist = (p-1)*7+(3-2*p)*board.pieces[p][i].row;
		if (dist < pMinDist) pMinDist = dist;
		if (dist > pMaxDist) pMaxDist = dist;
	}
	var score = (30-2*pMinDist - pMaxDist) - Math.pow(oCount, 4);
	return score + Math.random();
}
/*
	if (pMinDist < 2) score += 100000;
	if (pMinDist < 1) score += 100000;
	if (oMinDist < 2) score += -100000;
	if (oMinDist < 1) score += -100000;
*/


//===================================================================
// Check validity

BT_Game.prototype.validMove = function(board, pc, dx) {
	if (dx != -1 && dx != 0 && dx != 1) {
		//console.log("Invalid dx");
		return false;
	}
	if (pc.col+dx < 0 || pc.col+dx > 7) {
		//console.log("Invalid destination");
		return false;
	}

	var dy;
	if 	(pc.player == 1) dy = -1;
	else if (pc.player == 2) dy =  1;
	else return false;

	var dest = board.grid[pc.row+dy][pc.col+dx];
	if (dest.player == pc.player || (dest.player != 0 && dx == 0)) {
		console.log("Invalid capture");
		return false;
	}

	return true;
}

//===================================================================
// Make the move

BT_Game.prototype.move = function(board, pc, dx) {

// Check if out of bounds
	if (dx != -1 && dx != 0 && dx != 1) {
		//console.log("Invalid dx");
		return false;
	}
	if (pc.col+dx < 0 || pc.col+dx > 7) {
		//console.log("Invalid destination"); 
		return false;
	}
	if ((pc.player == 1 && pc.row == 0) || (pc.player == 2 && pc.row == 7)) {
		console.log("IN ROW 0 OR ROW 7");
		return false;
	}

// Get direction by player
	var dy;
	if 	(pc.player == 1) dy = -1;
	else if (pc.player == 2) dy =  1;
	else return false;

// Check the destination piece
	var dest = board.grid[pc.row+dy][pc.col+dx];
	if (dest.player == pc.player || (dest.player != 0 && dx == 0)) {
		//console.log("Invalid capture"); 
		return false;
	}

// Move the piece
	dest.row = pc.row;
	dest.col = pc.col;
	dest.player = 0;
	board.grid[pc.row][pc.col] = dest;

	pc.col = pc.col + dx;
	pc.row = pc.row + dy;
	board.grid[pc.row][pc.col] = pc;

// Update the pieces lists
	var p = 3-pc.player;
	for (var i = 0; i < board.pieces[p].length; i++)
		if (board.pieces[p][i] == dest)
			board.pieces[p].splice(i,1);

	return true;
}

//===================================================================
// Check win

// Check win in general case
BT_Game.prototype.checkWin = function(board) {
	if (this.three_workers) return this.checkWin3(board);
	var winner = 0;
	if (board.pieces[1].length == 0) winner = 2;
	if (board.pieces[2].length == 0) winner = 1;
	for (var p = 1; p <= 2; p++)
		for (var i = 0; i < board.pieces[p].length; i++)
			if (board.pieces[p][i].row == (p == 1 ? 0 : 7))
				winner = p;
	//if (winner != 0) this.winboard = new Board(board);
	return winner;
}

// Check win if playing with 3-to-base rules
BT_Game.prototype.checkWin3 = function(board) {
	var winner = 0;
	if (board.pieces[1].length <= 2) winner = 2;
	if (board.pieces[2].length <= 2) winner = 1;
	var count;
	for (var p = 1; p <= 2; p++) {
		count = 0;
		for (var i = 0; i < board.pieces[p].length; i++) {
			if (board.pieces[p][i].row == (p == 1 ? 0 : 7)) {
				count++;
				if (count >= 3)
					winner = p;
			}
		}
	}
	//if (winner != 0) this.winboard = new Board(board);
	return winner;
}

// Verify win and print game statistics to console and html
BT_Game.prototype.printWin = function() {
	var board = this.winboard;
	if (!board) return;
	var winner = this.checkWin(board);
	if (winner != 1 && winner != 2) return;
	var wintxt = "";
	wintxt += "Player " + winner + " Wins!\n";
	wintxt += "Nodes Expanded: " + this.expanded + '\n';
	wintxt += "Average Expansions per Move: " +  this.expanded/this.num_moves + '\n';
	wintxt += "Average Time (in ms) per Move: " +  this.time/this.num_moves + '\n';
	wintxt += "Player 1 workers captured: " +  (16-board.pieces[1].length) + '\n';
	wintxt += "Player 2 workers captured: " +  (16-board.pieces[2].length) + '\n';
	wintxt += "Moves: " +  this.num_moves + '\n';
	console.log(wintxt);
	$('#stats_box').html(wintxt);
}

