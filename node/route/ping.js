module.exports = function(request, response) {
	var body = new Date();
	response.send(body);
}