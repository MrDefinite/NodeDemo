// Routes settings

exports.index = function(req, res) {
	res.render('index', { title: 'Snake!'});
}

exports.pad = function(req, res) {
	//res.sendFile('pad.html');
}