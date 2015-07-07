//logic

var board = [["", "", "", "", "", "", ""],
			 ["", "", "", "", "", "", ""],
			 ["", "", "", "", "", "", ""],
			 ["", "", "", "", "", "", ""],
			 ["", "", "", "", "", "", ""],
			 ["", "", "", "", "", "", ""]]

var red = false;

function addPiece(column,color){

	// find the current height if the column (the row)
	var row = checkColumn(column)

		//check if a piece can go in the column
		if (row > 0 ){ //&& $("#board").hasClass("free") ){

			//add the piece to the board
			board[row-1][column-1] = color == "red" ? "r" : "y";

			//draw the piece
			drawPiece(row, column, color)

			//show the move was successful
			return true;
		}

}


function checkColumn(column){

	var row = 7;
	var empty = false;

		do {
			row--
				if (row == 0 || board[row-1][column-1] == "") {
					empty = true;
				}
		} while (!empty)

	return row
}


function checkForWin(){

	var win = false;
	var winningPieces =[]

	// check for vertical

	for (var col = 0; col < 7; col++){

		var countUp = 0;
		var countDown = 0;

		var centerColor = board[2][col]

		if (centerColor != ""){

			for (var i = 1; i <= 3; i++){
				if( board[2 + i][col] == centerColor && countDown == (i-1)) countDown++
				if( i <=2 && board[2 - i][col] == centerColor && countUp == (i-1)) countUp++	
			}

			if ((countUp + countDown) >= 3) {
				win = true;
				winningPieces = [[2 - countUp,col],[2 + countDown,col]]
			}
		}

	}

	// check for horizontal

	for (var row = 0; row < 6; row++){

		var countLeft = 0;
		var countRight = 0;

		var centerColor = board[row][3]

		if (centerColor != ""){

			for (var i = 1; i <= 3; i++){
				if( board[row][3 + i] == centerColor && countRight == (i-1)) countRight++
				if( board[row][3 - i] == centerColor && countLeft == (i-1)) countLeft++	
			}

			if ((countLeft + countRight) >= 3) {
				win = true;
				winningPieces = [[row, 3 - countLeft],[row, 3 + countRight]]
			}
		}
	}

	// check for diaganol

	for (var row = 1; row < 5; row++){
		for (var col = 2; col < 5; col *= 2){

			var countUpLeft = 0;
			var countUpRight = 0;
			var countDownLeft = 0;
			var countDownRight = 0;

			var centerColor = board[row][col]

			if (centerColor != ""){

				for (var i = 1; i <= 3; i++){
					if( (row - i >= 0 && col - i >= 0) && board[row - i][col - i] == centerColor && countUpLeft == (i-1)) countUpLeft++
					if( (row - i >= 0 && col + i <= 6) && board[row - i][col + i] == centerColor && countUpRight == (i-1)) countUpRight++
					if( (row + i <= 5 && col - i >= 0) && board[row + i][col - i] == centerColor && countDownLeft == (i-1)) countDownLeft++
					if( (row + i <= 5 && col + i <= 6) && board[row + i][col + i] == centerColor && countDownRight == (i-1)) countDownRight++					
				}

				if ((countUpLeft + countDownRight) >= 3 ){
					win = true;
					winningPieces = [[row - countUpLeft, col - countUpLeft],[row + countDownRight, col + countDownRight]]
				} else if ((countDownLeft + countUpRight) >= 3) {
					win = true;
					winningPieces = [[row + countDownLeft, col - countDownLeft],[row - countUpRight, col + countUpRight]]
				}
			}
		}
	}

	return [win, winningPieces]

}

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function chooseMove(player,currentDepth, maxDepth) {

	var playerColor = player.color == "red" ? "r" : "y"
	if (currentDepth % 2 == 0) {
		var minmax = "max";
		var putColor = playerColor
		var bestValue = -Infinity
		var prevValue = -Infinity	
	} else {
		var minmax = "min";
		var putColor = playerColor == "r" ? "y" : "r"
		var bestValue = Infinity
		var prevValue = Infinity
	}


	var moves = shuffle(findPossibleMoves())
	var moveScores = [];
	var bestMove = 0
	var currentValue = 0;	

	moves.forEach(function(move, index){

		board[move[1] - 1][move[0] - 1] = putColor;

			if (currentDepth < maxDepth) {
				currentValue = chooseMove(player, currentDepth + 1, maxDepth)[0]
			} else {
				currentValue = getBoardValue(board, playerColor)
			}

			bestValue = Math[minmax](currentValue,bestValue)

			if (bestValue != prevValue) {
				bestMove = index
				prevValue = bestValue
			} 

		board[move[1] - 1][move[0] - 1] = "";

		moveScores.push([move[0], currentValue])

	})

/*

	var scoreText = "_"

	moveScores.sort()

	moveScores.forEach(function(score){

		scoreText += Math.floor(score[1]) + "_"

	})

	if (currentDepth == 0) console.log("depth: ", currentDepth, scoreText, "Chose: " + (bestMove + 1), "value: " + Math.floor(bestValue))

*/

	return [bestValue, moves[bestMove][0]]

}


function cpuPlay(player) {

	var column = chooseMove(player, 0, 3)[1]
	addPiece(column, player.color)
}

function findPossibleMoves(){

	var moves = []

	for (var col = 1; col <=7; col++){

		var row = checkColumn(col)

		if (row > 0) moves.push([col,row])
	}

	return moves

}

function getBoardValue(newBoard, color){

	var value = 0;

	var currentColor = "";
	var lastColor = "";
	var lastPosition = 0;
	var currentChain = 0;
	var clearance = 0;
	var airCount = 0;
	var multiplier = 0;

	var goldenZoneWeight = 0.5;
	var heightWeight = 1;
	var verticalWeight = 1.0;
	var horizontalWeight = 1.2;
	var diagonalWeight = 1.1;

	

	//check for golden zone

	for (var row = 0; row < 6; row++){
		for (var col = 0; col < 7; col++){

			if (newBoard[row][col] != ""){

				//check whose piece 
				currentColor = newBoard[row][col]
				multiplier = currentColor == color ? +1 : -1

				//check for golden zone
					//if ( (row >= 2 ) && (col ==3 )) value += goldenZoneWeight * multiplier

				// weight height

					//if ( row <= 6 ) value += heightWeight * multiplier

			}
		}
	}

	//check for horizontal

	for (var row = 0; row < 6; row++){

		currentChain = 0;
		lastColor = "";
		clearance = 0;
		airCount = 0;

		for (var col = 0; col < 7; col++){

			if (newBoard[row][col] != ""){

				//check whose piece 
				currentColor = newBoard[row][col]
				multiplier = currentColor == color ? +1 : -1.5

				clearance += airCount;

				if (lastColor == currentColor == 1 && (col-lastPosition) == 1){
					currentChain++
					clearance ++
				} else if (lastColor != "") {
					if (clearance >= 3) value += scoreChain(currentChain) * -multiplier * horizontalWeight
					currentChain = 0;
					clearance = airCount + 1
				}

				lastColor = currentColor;
				lastPosition = col;
				airCount = 0

			} else {
				airCount ++
			}
		}

		if (currentChain > 0 && clearance >= 3) value += scoreChain(currentChain) * multiplier * horizontalWeight
	}	

	//check for vertical

	for (var col = 0; col < 7; col++){

		currentChain = 0;
		lastColor = "";
		airCount = 0;

		for (var row = 0; row < 6; row++){

			if (newBoard[row][col] != ""){

				//check whose piece 
				currentColor = newBoard[row][col]
				multiplier = currentColor == color ? +1 : -1.5

				if (lastColor == currentColor) {
					currentChain++
					//console.log(currentChain)
				} else if (lastColor != "") {
					
					if ( (airCount + currentChain) >= 3 ) value += scoreChain(currentChain) * -multiplier * verticalWeight
					currentChain = 0;

				}

				lastColor = currentColor;
				airCount = 0;

			} else {
				airCount++
			}
		}

		if (currentChain > 0) value += scoreChain(currentChain) * multiplier * verticalWeight
	}

	//check for diagonal (down right)

	var startingPoints = [[2,0,4],[1,0,5],[0,0,6],[0,1,6],[0,2,5],[0,3,4]]

	startingPoints.forEach(function(start){

		currentChain = 0;
		lastColor = "";
		clearance = 0;
		airCount = 0;
		
		for (var dist = 0; dist < start[2]; dist++){

			if (newBoard[start[0] + dist][start[1] + dist] != ""){

				//check whose piece 
				currentColor = newBoard[start[0] + dist][start[1] + dist]
				multiplier = currentColor == color ? +1 : -1.5

				clearance += airCount;

				if (lastColor == currentColor == 1 && (dist-lastPosition) == 1){
					currentChain++
					clearance ++
				} else if (lastColor != "") {
					if (clearance >= 3) value += scoreChain(currentChain) * -multiplier * diagonalWeight
					currentChain = 0;
					clearance = airCount + 1
				}

				lastColor = currentColor;
				lastPosition = dist;
				airCount = 0

			} else {
				airCount ++
			}
		}

		if (currentChain > 0 && clearance >= 3) value += scoreChain(currentChain) * multiplier * diagonalWeight

	});

	//check for diagonal (down left)

	var startingPoints = [[2,6,4],[1,6,5],[0,6,6],[0,5,6],[0,4,5],[0,3,4]]

	startingPoints.forEach(function(start){

		currentChain = 0;
		lastColor = "";
		clearance = 0;
		airCount = 0;
		
		for (var dist = 0; dist < start[2]; dist++){

			if (newBoard[start[0] + dist][start[1] - dist] != ""){

				//check whose piece 
				currentColor = newBoard[start[0] + dist][start[1] - dist]
				multiplier = currentColor == color ? +1 : -1

				clearance += airCount;

				if (lastColor == currentColor == 1 && (dist-lastPosition) == 1){
					currentChain++
					clearance ++
				} else if (lastColor != "") {
					if (clearance >= 3) value += scoreChain(currentChain) * -multiplier
					currentChain = 0;
					clearance = airCount + 1
				}

				lastColor = currentColor;
				lastPosition = dist;
				airCount = 0

			} else {
				airCount ++
			}
		}

		if (currentChain > 0 && clearance >= 3) value += scoreChain(currentChain) * multiplier

	});



	return value



}

function scoreChain(length){
	switch(length){
		case 0:
			return 0;
		break;
		case 1:
			return 5;
		break;
		case 2:
			return 20;
		break;
		default:
			return 100;
		break;
	}
}

//display

function drawPiece(row,column,color){

	var won = checkForWin()
	if (won[0]) $("#board").addClass("won " + color)


	$("#board").removeClass("free")	

	$("#pieces").append("<div class = 'piece " + color + "'></div>")
	var currentPiece = $("#pieces div:last-child")
	currentPiece.css("left", 352 + 50 * column)
	currentPiece.css("display","inline-block")

	currentPiece.animate({top: "+=" + (row * 50 + 2) }, (100 * row ), function(){
		$("#board").addClass("free")
		if (won[0]) {
			drawLine(won[1][0], won[1][1])
			$("#board tr:first-child > td ").off("click");
			setTimeout(function(){
				$("#menu").fadeIn(800);
			},1000)
		}

	})
}

function drawLine(startPiece, endPiece) {

	var canvas = document.getElementById('lineCanvas');
    var context = canvas.getContext('2d');

	var startPoint = [(startPiece[1]+ 1) * 50 - 25, (startPiece[0]+ 1) * 50 - 25]
	var endPoint = [(endPiece[1] + 1) * 50 - 25, (endPiece[0] + 1) * 50 - 25]

    context.beginPath();
    context.moveTo(startPoint[0], startPoint[1]);
    context.lineTo(endPoint[0], endPoint[1]);

    context.strokeStyle = "#1E33E6"
    context.lineWidth = 5
    context.stroke();

}

//system

function runMatch(p1,p2){

	$("#board").removeClass("won")
	$("#board").removeClass("red")

	var canvas = document.getElementById('lineCanvas');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

	board = [["", "", "", "", "", "", ""],
			 ["", "", "", "", "", "", ""],
			 ["", "", "", "", "", "", ""],
			 ["", "", "", "", "", "", ""],
			 ["", "", "", "", "", "", ""],
			 ["", "", "", "", "", "", ""]]

	red = false;

	$("#pieces").html("")

	var player1 = {color: "yellow",
					type: p1    }
	var player2 = {color: "red",
					type: p2    }

	var currentPlayer = player1;

	if(p1 == "cpu" && p2 == "cpu") {
		var play = setInterval(function(){

				cpuPlay(currentPlayer)
				currentPlayer = currentPlayer == player1 ? player2 : player1

				if ($("#board").hasClass("won")) {
					clearInterval(play)
					setTimeout(function(){
						$("#menu").fadeIn(800);
					},1000)
				}

		},100)
	} else {

		$("#board tr:first-child > td ").click(function(){
			if(!$("#board").hasClass("won")){

				//check if player is human
				if (currentPlayer.type == "human"){

					// find the column which was clicked on
					var child = this;
					var i = 0;
					while( (child = child.previousSibling) != null ) 
					  i++;
					var column = Math.floor(i/2) + 1

					if (addPiece(column, currentPlayer.color)) {

						currentPlayer = currentPlayer == player1 ? player2 : player1
						$("#board").hasClass("red") ? $("#board").removeClass("red") : $("#board").addClass("red")

						if (currentPlayer.type == "cpu" && !$("#board").hasClass("won")) {
							setTimeout(function(){
								cpuPlay(currentPlayer)
								currentPlayer = currentPlayer == player1 ? player2 : player1
								$("#board").hasClass("red") ? $("#board").removeClass("red") : $("#board").addClass("red")
							},600)

						}

					}
				}
			}

		});

	}


}

function runGame(){

	$("#menu").fadeIn(800);
	$("#board").fadeIn(500);

	$("#mainMenu button").click(function(){
		var gameMode = this.id
		var p1 = "cpu"
		var p2 = "cpu"

		switch (gameMode){
			case "vsCpu":
				p1 = "human";
			break;
			case "vsPlayer":
				p1 = p2 = "human";
			break;
		}

		$("#menu").fadeOut(400);

		runMatch(p1,p2)

	})

}


$(document).ready(function(){
	runGame()



});



