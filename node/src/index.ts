import express = require('express');
//import GarageToggle = require('./route/garage/toggle');
import RaspberryPiRelay = require('./gpio/RaspberryPiRelay');

var app = express();
app.get('/v1/ping', require('./route/ping'));

var openGarage = {
	activateDurationInSeconds: 1,
	gpioOutputPin: 25
};

var switchLight = {
	activateDurationInSeconds: 60,
	gpioOutputPin: 17
};

app.get('/v1/garage/toggle/', (request, response) => {
	RaspberryPiRelay.executeCommand(openGarage);
	RaspberryPiRelay.executeCommand(switchLight);
	response.send('successfull');
});
//app.get('/v1/garage/light', switchLight.onRequest);

app.listen(3000, function () {
	console.log("Done");
});
