var Direction = {
	up: "up",
	down: "down",
	left: "left",
	right: "right"
};

var Setting = {
	// Default setting
	col: 50,
	row: 30,
	speed: 250,
	workThread: null
};

function Control() {
	this.snake = new Snake();
	this.food = new Food();
}

Control.prototype.init = function(pannelId) {
	var map = '',
		x,
		y;

	for (x = 0; x < Setting.row; x++) {
		map += '<tr>';
		for (y = 0; y < Setting.col; y++) {
			if (x == 0 && y == 0) {
				map += '<td id="map_' + x + '_' + y + '" class="dot up left"></td>';
			}
			else if (x == 0 && y == Setting.col - 1) {
				map += '<td id="map_' + x + '_' + y + '" class="dot up right"></td>';
			}
			else if (x == Setting.row - 1 && y == 0) {
				map += '<td id="map_' + x + '_' + y + '" class="dot bottom left"></td>';
			}
			else if (x == Setting.row - 1 && y == Setting.col - 1) {
				map += '<td id="map_' + x + '_' + y + '" class="dot bottom right"></td>';
			}
			else if(x == 0) {
				map += '<td id="map_' + x + '_' + y + '" class="dot up"></td>';
			}
			else if (x == Setting.row - 1) {
				map += '<td id="map_' + x + '_' + y + '" class="dot bottom"></td>';
			}
			else if (y == 0) {
				map += '<td id="map_' + x + '_' + y + '" class="dot left"></td>';
			}
			else if (y == Setting.col - 1) {
				map += '<td id="map_' + x + '_' + y + '" class="dot right"></td>';
			}
			else {
				map += '<td id="map_' + x + '_' + y + '" class="dot"></td>';
			}
		}
		map += '</tr>';
	}

	$("#" + pannelId).html(map);
}

Control.prototype.start = function() {
	var self = this,
		socket = io();

	socket.on('game', function(dir) {
		self.snake.setDir(dir);
	});

	this.food.create();
	Setting.workThread = setInterval(function() {
		self.snake.eat(self.food);
		self.snake.move();
	}, Setting.speed);
}

function Position(x, y) {
	this.x = x;
	this.y = y;
}

Position.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
}

function Food() {
	this.pos = new Position(0, 0);
}

Food.prototype.create = function(snakePos) {
	Food.prototype.remove.call(this);
	var x,
		y,
		i,
		isCover = true;

	while(isCover) {
		x = parseInt(Math.random() * (Setting.row - 1));
		y = parseInt(Math.random() * (Setting.col - 1));
		isCover = false;
		if(snakePos instanceof Array) {
			for(i = 0; i < snakePos.length; i++) {
				if(x == snakePos[i].x && y == snakePos[i].y) {
					isCover = true;
					break;
				}
			};
		}
	}
	this.pos = new Position(x, y);
	$("#map_" + this.pos.x + "_" + this.pos.y).attr("class", "food");
}

Food.prototype.remove = function() {
	$("#map_" + this.pos.x + "_" + this.pos.y).attr("class", "dot");
}

function Snake() {
	this.isDone = false;
	this.direction = Direction.right;
	this.pos = new Array(new Position(0, 0));
}

Snake.prototype.move = function() {
	var i,
		j,
		head,
		isOver,
		snakeBody;

	$("#map_" + this.pos[0].x + "_" + this.pos[0].y).attr("class", "dot");

	for(i = 0; i < this.pos.length - 1; i++) {
		this.pos[i].x = this.pos[i + 1].x;
		this.pos[i].y = this.pos[i + 1].y;
	}

	head = this.pos[this.pos.length - 1];
	switch(this.direction) {
		case Direction.left:
			head.y--;
			break;
		case Direction.right:
			head.y++;
			break;
		case Direction.up:
			head.x--;
			break;
		case Direction.down:
			head.x++;
			break;
	}
	this.pos[this.pos.length - 1] = head;

	for(i = 0; i < this.pos.length; i++) {
		isOver = false;
		for(j = i + 1; j < this.pos.length; j++) {
			if(this.pos[j].x == this.pos[i].x && this.pos[j].y == this.pos[i].y) {
				isOver = true;
				break;
			}
		}
		if(isOver) {
			Snake.prototype.over.call(this);
			break;
		}

		snakeBody = $("#map_" + this.pos[i].x + "_" + this.pos[i].y);
		if (!!snakeBody.length) {
			snakeBody.attr("class", "snake-body");
		}
		else {
			Snake.prototype.over.call(this);
			break;
		}
	}
	this.isDone = true;
}

Snake.prototype.over = function() {
	clearInterval(Setting.workThread);
	alert("游戏结束！"); 
}

Snake.prototype.eat = function(food) {
	var head = this.pos[this.pos.length - 1],
		isEat = false;

	switch(this.direction) {
		case Direction.left:
			if(head.x == food.pos.x + 1 && head.y == food.pos.y) isEat = true;
			break;
		case Direction.right:
			if(head.x == food.pos.x - 1 && head.y == food.pos.y) isEat = true;
			break;
		case Direction.up:
			if(head.x == food.pos.x && head.y == food.pos.y + 1) isEat = true;
			break;
		case Direction.down:
			if(head.x == food.pos.x && head.y == food.pos.y - 1) isEat = true;
			break;
	}

	if(isEat) {
		this.pos.push(new Position(food.pos.x, food.pos.y));
		food.create(this.pos);
	}
}

Snake.prototype.setDir = function(dir) {
	switch(dir) {
		case Direction.up:
			if(this.isDone && this.direction != Direction.down) {
				this.direction = dir;
				this.isDone = false;
			}
			break;
		case Direction.right:
			if(this.isDone && this.direction != Direction.left) {
				this.direction = dir;
				this.isDone = false;
			}
			break;
		case Direction.down:
			if(this.isDone && this.direction != Direction.up) {
				this.direction = dir;
				this.isDone = false;
			}
			break;
		case Direction.left:
			if(this.isDone && this.direction != Direction.right) {
				this.direction = dir;
				this.isDone = false;
			}
			break;
	}
}


$(document).ready(function() {
	var control = new Control();
	control.init("pannel");

	$("#startBtn").on('click', function() {
		control.start();
	});
});




