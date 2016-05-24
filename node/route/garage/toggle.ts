export = function(request, response) {
	//toggleGarageDoor();
	response.send('successfull');
};

/*
function toggleGarageDoor() {
	var Gpio = require('onoff').Gpio;
	var garageRelay = new Gpio(17, 'out');

	garageRelay.writeSync(1);
	setTimeout(function() {
		garageRelay.writeSync(0);
	}, 1000);
}
*/