import IRelay = require('./IRelay');

//17, 25
export function executeCommand(outputRelay: IRelay.IOutputRelay) {
	var Gpio = require('onoff').Gpio;
	var garageRelay = new Gpio(outputRelay.gpioOutputPin, 'out');

	garageRelay.writeSync(1);
	setTimeout(() => {
		garageRelay.writeSync(0);
	}, <number>outputRelay.activateDurationInSeconds*1000);
}
