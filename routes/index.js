// Routes settings

exports.index = function(req, res) {
	res.sendFile('index.html');
}

exports.pad = function(req, res) {
	res.sendFile('pad.html');
}