var Direction = {
	up: "up",
	down: "down",
	left: "left",
	right: "right"
};

var Setting = {
	// Default setting
	col: 20,
	row: 20,
	speed: 250,
	workThread: null
};

function Control() {
	this.snake = new Snake();
	this.food = new Food();
}

Control.prototype.init = function(pannelId) {
	var map = [],
		x,
		y;

	map.push('<table>');
	for (x = 0; x < Setting.row; x++) {
		map.push('<tr>');
		for (y = 0; y < Setting.col; y++) {
			map.push('<td id="map_' + x + '_' + y + '"></td>');
		}
		map.push('</tr>');
	}
	map.push('</table>');
	this.pannel = document.getElementById(pannelId);
	this.pannel.innerHTML = map.join("");
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
	this.pos = null;
}

Food.prototype.create = function(snakePos) {
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
	document.getElementById('map_' + this.pos.x + '_' + this.pos.y).className = "food";
}

Food.prototype.remove = function() {
	document.getElementById('map_' + this.pos.x + '_' + this.pos.y).className = "";
}

function Snake() {
	this.isDone = false;
	this.direction = Direction.right;
	this.pos = [];
}

Snake.prototype.move = function() {
	var i,
		j,
		head,
		isOver,
		body;

	document.getElementById('map_' + this.pos[0].x + '_' + this.pos[0].y).className = "";

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
			if(isOver) {
				Snake.prototype.over();
			}

			body = document.getElementById('map_' + this.pos[i].x + '_' + this.pos[i].y);
			if (!!body) {
				body.className = "snake";
			}
			else {
				Snake.prototype.over();
			}
		}
	}
	this.isDone = true;
}

Snake.prototype.over = function() {
	clearInterval(Setting.workThread);

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


var control = new Control();

window.onload = function() {
	control.init("pannel");
	document.getElementById("startBtn").onclick = function() {
		control.start();

	}


}

