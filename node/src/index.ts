import express = require('express');
import _ = require('lodash');

import { OutputGpioController, DoorController } from './gpio/RaspberryPiRelay';
import { GarageController } from './gpio/garageController';
import { log } from './gpio/log';

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

var doorController = new DoorController();
var lightController = new OutputGpioController(17);
var garageController = new GarageController(doorController, lightController, (state) => {
	log("doorSwitch watch updated: " + state);
	fireGarageEvents();
});

app.get('/v2/garage/state', (request, response) => {
	log('/v2/garage/state');
	response.send(garageController.getGarageState());
});

app.post('/v2/garage/toggle/', (request, response) => {
	log('/v2/garage/toggle/');
	if (garageController.getGarageState().isDoorOpen) {
		garageController.closeGarageDoor();
	} else {
		garageController.openGarageDoor();
	}
	response.send('successfull');
});

app.post('/v2/light/toggle', (request, response) => {
	log('/v2/light/toogle');
	garageController.switchOnLightsForDuration(1);
	response.send('successfull');
})

setInterval(fireGarageEvents, 5000);

app.listen(3000, function () {
	log("Service Running");
});

function fireGarageEvents() {
	var data = garageController.getGarageState();
	log('writing /events/garage' + JSON.stringify(data));
    garageEvents.broadcast(data);
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
