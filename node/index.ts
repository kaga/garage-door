import express = require('express');

var app = express();
app.get('/v1/ping', require('./route/ping'));
app.get('/v1/garage/toggle/', require('./route/garage/toggle'));

app.listen(3000, function () {
	console.log("Done");
});
