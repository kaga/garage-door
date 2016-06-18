import express = require('express');
import _ = require('lodash');

import IRelay = require('./gpio/IRelay');
import RaspberryPiRelay = require('./gpio/RaspberryPiRelay');
var Gpio = require('onoff').Gpio;
var noble = require('noble');
var sendevent = require('sendevent');

var app = express();
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.get('/v2/ping', require('./route/ping'));

var garageEvents = sendevent('/events/garage');
app.use(garageEvents);

var openGarage = {
	activateDurationInSeconds: 1,
	gpioOutputPin: 25
};

var switchLight = {
	activateDurationInSeconds: 60,
	gpioOutputPin: 17
}
var garageRelay = new Gpio(switchLight.gpioOutputPin, 'out');
garageRelay.writeSync(0);

var switchLightRelay = new IRelay.DebounceRelay(switchLight, (state) => {
	log('Switch Light: ' + (state ? "On" : "Off"));
	garageRelay.writeSync(state ? 1 : 0);
});

var doorSwitch = new Gpio(21, 'in', 'both');
var previousDoorState = doorSwitch.readSync();

doorSwitch.watch((error, value) => {
	if (error) {
		log("Error on door switch:" + error);
		return
	}

	log("doorSwitch watch updated: " + value);
	if (value !== previousDoorState) {
		previousDoorState = doorSwitch.readSync();
		switchLightRelay.switchOn();
		fireGarageEvents();
	}
});

app.get('/v2/garage/state', (request, response) => {
	log('/v2/garage/state');
	response.send(getGarageJson());
});

app.post('/v2/garage/toggle/', (request, response) => {
	log('/v2/garage/toggle/');
	RaspberryPiRelay.executeCommand(openGarage);
	switchLightRelay.switchOn();
	response.send('successfull');
});

setInterval(fireGarageEvents, 5000);

app.listen(3000, function () {
	log("Service Running");
});

function fireGarageEvents() {
	var data = getGarageJson();
	log('writing /events/garage' + data);
    garageEvents.broadcast(data);
}

function getGarageJson() {
	var doorSwitchState = doorSwitch.readSync();
	return {
		timestamp: new Date(),
		isOpen: (doorSwitchState == 0) ? false : true
	};
}

/*
var RSSI_THRESHOLD = -46; //~2m

noble.on('discover', function (peripheral) {
	log("discoved device: " + JSON.stringify(peripheral, null, 4));
	if (peripheral.rssi < RSSI_THRESHOLD) {
		// ignore
		return;
	}
	
	//switchLightRelay.switchOn();
});

noble.on('stateChange', function (state) {
	if (state === 'poweredOn') {
		noble.startScanning([], true);
	} else {
		noble.stopScanning();
	}
});
*/

function log(message: String) {
	var timestamp = new Date();
	console.log(timestamp + " - " + message);
} 