$(document).ready(function() {
	var socket = io();
	$("#up").on("click", function() {
		socket.emit('pad', "up");
	});
	$("#down").on("click", function() {
		socket.emit('pad', "down");
	});
	$("#left").on("click", function() {
		socket.emit('pad', "left");
	});
	$("#right").on("click", function() {
		socket.emit('pad', "right");
	});
});