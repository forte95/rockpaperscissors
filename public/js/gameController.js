angular.module('game', ['ngAnimate']).controller('gameController', function($scope, $timeout) {
	$scope.playerScore = 0;
	$scope.cpuScore = 0;
	$scope.playerThrow = "";
	$scope.cpuThrow = "";
	$scope.cpuMode = "normal";
	$scope.winner = "";
	
	$scope.checkPlayer = function (strToCheck) {
		return strToCheck == $scope.playerThrow;
	}
	
	$scope.checkCpu = function (strToCheck) {
		return strToCheck == $scope.cpuThrow;
	}
	
	$scope.checkWin = function () {
		return winner != "";
	}
	
	$scope.resetScore = function () {
		$scope.playerScore = 0;
		$scope.cpuScore = 0;
	};
	
	$scope.winMessage = function () {
		if ($scope.winner == "player") {
			return "You win!";
		}
		if ($scope.winner == "cpu") {
			return "CPU wins!";
		}
		if ($scope.winner == "draw") {
			return "It's a draw!";
		}
		
		return "";
	}
	
	var playing = false;
	$scope.play = function (chosenThrow) {
		//because of the $timeout inside this function,
		//the app bugs out if the user clicks throws very quickly
		//so I "synchronized" this function as in Java
		//by checking if any previous calls are finished before doing anything
		if (playing) {
			return;
		}
		
		playing = true;
		
		$scope.playerThrow = chosenThrow;
		$scope.cpuThrow = makeCpuThrow($scope.cpuMode, $scope.playerThrow);
		
		$scope.winner = resolveWinner($scope.playerThrow, $scope.cpuThrow);
		
		//give the user a moment, then reset playerThrow, cpuThrow, and winner
		$timeout(function () {
			$scope.playerThrow = "";
			$scope.cpuThrow = "";
			$scope.winner = "";
			
			/*
				signifies the end of this call,
				since this block executes 1.5 seconds later
			*/
			playing = false;
		},1500);
		
		if ($scope.winner == "player") {
			$scope.playerScore++;
		}
		if ($scope.winner == "cpu") {
			$scope.cpuScore++;
		}
		//if draw, I don't want to increase score
	};
	
	var makeCpuThrow = function (mode, playerThrow) {
		if (mode == "normal") {
			return randomizeThrow();
		}
		if (mode == "wimp") {
			return makeLosingThrow(playerThrow);
		}
		if (mode == "cheater") {
			return makeWinningThrow(playerThrow);
		}
	};
	
	var randomizeThrow = function () {
		var random = Math.random() * 3;
			
		if (random < 1) {
			return "rock";
		} else if (random < 2) {
			return "paper";
		} else {
			return "scissors";
		}
	};
	
	var resolveWinner = function (playerThrow, cpuThrow) {
		if (playerThrow == cpuThrow) {
			return "draw";
		}
		/*
			Dev note
			At first, I wanted to check each win case manually,
			but it turns out I already have the win cases
			hiding in my makeLosingThrow and makeWinningThrow
			functions!
		*/
		
		//check if CPU made a losing throw
		if (cpuThrow == makeLosingThrow(playerThrow)) {
			return "player";
		}
		
		//check if CPU made a winning throw
		if (cpuThrow == makeWinningThrow(playerThrow)) {
			return "cpu";
		}
	};
	
	var makeLosingThrow = function (playerThrow) {
		if (playerThrow == "rock") {
			return "scissors";
		} else if (playerThrow == "paper") {
			return "rock";
		} else if (playerThrow == "scissors") {
			return "paper";
		}
	};
	
	var makeWinningThrow = function (playerThrow) {
		if (playerThrow == "rock") {
			return "paper";
		} else if (playerThrow == "paper") {
			return "scissors";
		} else if (playerThrow == "scissors") {
			return "rock";
		}
	};
});