import express = require('express');
import IRelay = require('./gpio/IRelay');
import RaspberryPiRelay = require('./gpio/RaspberryPiRelay');
var Gpio = require('onoff').Gpio;

var app = express();
app.get('/v1/ping', require('./route/ping'));

var openGarage = {
	activateDurationInSeconds: 1,
	gpioOutputPin: 25
};

var switchLight = {
	activateDurationInSeconds: 60,
	gpioOutputPin: 17
}
var garageRelay = new Gpio(switchLight.gpioOutputPin, 'out');
var switchLightRelay = new IRelay.DebounceRelay(switchLight, (state) => {
	garageRelay.writeSync(state);
});

app.get('/v1/garage/toggle/', (request, response) => {
	RaspberryPiRelay.executeCommand(openGarage);
	switchLightRelay.switchOn();
	response.send('successfull');
});

app.listen(3000, function () {
	console.log("Done");
});