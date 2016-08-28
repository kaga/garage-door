import express = require('express');
import _ = require('lodash');

import { OutputGpioController, DoorController } from './gpio/RaspberryPiRelay';
import { GarageController } from './gpio/garageController';
import { log } from './gpio/log';

import { readConfiguration, FirebaseBridge } from './firebaseBridge';

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

const firebaseConfig = readConfiguration();
let firebaseBridge: FirebaseBridge;
if (firebaseConfig) {
	firebaseBridge = new FirebaseBridge(garageController, firebaseConfig);
}

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

app.use(express.static(__dirname + '/html-app'));

setInterval(fireGarageEvents, 5000);

app.listen(process.env.PORT || 3000, function () {
	log("Service Running");
	log("Firebase bridge: " + (firebaseBridge ? "On" : "Off"));
});

function fireGarageEvents() {
	var data = garageController.getGarageState();
	log('writing /events/garage' + JSON.stringify(data));
    garageEvents.broadcast(data);
	firebaseBridge.setNeedSynchronize();
}
