/*import IRelay = require('../../gpio/IRelay');
import RaspberryPiRelay = require('../../gpio/RaspberryPiRelay');

class ToggleGarage {
	outputRelay: IRelay.IOutputRelay;

	constructor(outputRelay: IRelay.IOutputRelay) {
		this.outputRelay = outputRelay;
	}
	
	onRequest(request, response) {
		RaspberryPiRelay.executeCommand(this.outputRelay);
		response.send('successfull');
	}
}

export = ToggleGarage;
*/