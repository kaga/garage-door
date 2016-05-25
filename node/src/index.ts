import express = require('express');
import IRelay = require('./gpio/IRelay');
import RaspberryPiRelay = require('./gpio/RaspberryPiRelay');
var Gpio = require('onoff').Gpio;
var noble = require('noble');

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
	console.log('Switch Light: ' + state ? "On": "Off" );
	garageRelay.writeSync(state ? 1 : 0);
});

app.get('/v1/garage/toggle/', (request, response) => {
	RaspberryPiRelay.executeCommand(openGarage);
	switchLightRelay.switchOn();
	response.send('successfull');
});

app.listen(3000, function () {
	console.log("Done");
});

var RSSI_THRESHOLD = -46; //~2m

noble.on('discover', function (peripheral) {
	if (peripheral.rssi < RSSI_THRESHOLD) {
		// ignore
		return;
	}

	switchLightRelay.switchOn();
});

noble.on('stateChange', function (state) {
	if (state === 'poweredOn') {
		noble.startScanning([], true);
	} else {
		noble.stopScanning();
	}
});