// By Songli, 2014

// Module dependencies
var express = require('express'),
	routes = require('./routes'),
	path = require('path'),
	ejs = require('ejs'),
	http = require('http').Server(app),
	io = require('socket.io')(http);

// Settings
var app = express();
app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');


app.use(express.static(path.join(__dirname, 'public')));



// Routes
app.get('/', routes.index);
app.get('/pad', routes.pad);

io.on('connection', function(socket) {
	socket.on('game', function(msg) {
		//io.emit('chat message', msg);
	});
	socket.on('pad', function(msg) {
		//io.emit('chat message', msg);
	});
});

app.listen(8080);
