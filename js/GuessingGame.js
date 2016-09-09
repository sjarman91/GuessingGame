// JavaScript --------------------------------------------------

// returns a random number bewteen 1 and 100
function generateWinningNumber() {
	return Math.floor(Math.random() * 100 + 1);
}

//fisher-yates shuffle function
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  console.log(array);
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
	
    // And swap it with the current element.
    t = array[m];
    console.log(m)
    console.log(t)
    console.log(i)
    array[m] = array[i];
    array[i] = t;
    console.log(array);
  }

  return array;
}

//Game constructor - is used to generate new game instances
function Game() {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();

}

// creates a new game instance
function newGame() {
	return new Game();
}

// difference returns the absolute value of the difference between player
// guess and the winning number
Game.prototype.difference = function() {
	return Math.abs(this.winningNumber - this.playersGuess);
}


// returns true if the player's guess is lower than the winnning number
Game.prototype.isLower = function() {
	if (this.playersGuess < this.winningNumber) {
		return true;
	}
	return false;
}


// checks if the player has already guessed that number and for win/loss
// also checks number of guesses
Game.prototype.checkGuess = function() {
	var diff = this.difference();
	var lower = this.isLower();
	var result = "";

	// better way to write this? Cascading else/ifs to ensure only called once
	if(diff < 10) {result += "You're burning up!"}
		else if(diff < 25) {result += "You're lukewarm."} 
		else if(diff < 50) {result += "You're a bit chilly."}
		else if(diff < 100) {result += "You're ice cold!"}

	if(lower) {result += " (guess higher)" } else {result += " (guess lower)"}

	if (this.playersGuess === this.winningNumber) {
		$('#player-input, #hint, #submit').prop('disabled', true);
		$('#subtitle').text("Congrats! Hit reset to play again!");
		return "You Win";
		} 
		else {
			if (this.pastGuesses.indexOf(this.playersGuess) !== -1) {
				return "You have already guessed that number.";
			} 
			else {
				this.pastGuesses.push(this.playersGuess);
				$('#guess-list li:nth-child('+ this.pastGuesses.length + ')').text(this.playersGuess);
				if (this.pastGuesses.length === 5) {
					$('#subtitle').text("Hit reset to play again!");
					$('#player-input, #hint, #submit').prop('disabled', true);
					return "You Lose!";
				} else {
					return result;
				}
			}

		}
}

// accepts the players guess, assigns it to the object, and checks the guess
// using the checkGuess function
Game.prototype.playersGuessSubmission = function(guess) {
	if (guess < 1 || guess > 100 || isNaN(guess)) {
		throw "That is an invalid guess.";
	}
	this.playersGuess = guess;
	return this.checkGuess();
} 

// random numbers could be the actual winning number or they could both
// be the same. Need to add a test to see if # is already in hint array
// if the number is already in the hint array, another random number
// needs to be generated
Game.prototype.provideHint = function() {
	var hintArray = [];
	hintArray.push(this.winningNumber);
	
	var rand1 = generateWinningNumber();
	var rand2 = generateWinningNumber();

	hintArray.push(rand1);
	hintArray.push(rand2);

	hintArray = shuffle(hintArray);

	var hintMessage = "Try: " + hintArray[0] + " or " + hintArray[1] + " or " + hintArray[2];

	return hintMessage;
}

// jQuery ----------------------------------------------------------------------

function makeAGuess(gameVar) {
	var guess = $('#player-input').val();
	$('#player-input').val('');
	var output = gameVar.playersGuessSubmission(parseInt(guess,10));
	$('#title').text(output);
};

$(document).ready(function (){
	
	var game = new Game();
	var hintGiven = false;
	
	$('img').on('click', function() {
		$(this).hide();
	});

	$('#submit').click(function() {
		makeAGuess(game);
	});

	$('#reset').click(function(){
		game = new Game();

		$('#player-input, #hint, #submit').prop('disabled', false);
		$('#title').text('Guessing Game');
		$('#subtitle').text('Guess a number between 1 and 100');
		$('.guess').text("-");
		$('#player-input').focus();
		$('#userHint').remove();
		hintGiven = false;
	});

	$('#hint').click(function() {
		if(!hintGiven) {
			$('#hint').after('<p id="userHint">'+ game.provideHint() + '</p>');
		}
		hintGiven = true;
	});

	// keyboard to click translation
	$('#player-input').keypress(function(e) {
		if(e.which == 13) {
			$('#submit').click();	
		}

	});

});