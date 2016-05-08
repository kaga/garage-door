var Gpio = require('onoff').Gpio;
var express = require('express');

var app = express();
app.get('/v1/garage/toggle/', function(request, response) {
	toggleGarageDoor();
	response.send('successfull');
});

app.listen(3000, function() {
	console.log("Done");
})



function toggleGarageDoor() {
	var garageRelay = new Gpio(17, 'out');

	garageRelay.writeSync(1);
	setTimeout(function() {
		garageRelay.writeSync(0);
	}, 1000);
}