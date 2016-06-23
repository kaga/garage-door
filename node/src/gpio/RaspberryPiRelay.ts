import { DoorController as IDoorController, GpioController } from './garageController';
import { log } from './log';
var Gpio = require('onoff').Gpio;

//17 for light output relay
//25 for garage door output relay,
//21 for door input
export class DoorController implements IDoorController {
	onStateChange: (state: boolean) => void = () => { };
	private doorSwitch: any;
	private doorRelay: OutputGpioController;

	constructor() {
		this.doorSwitch = new Gpio(21, 'in', 'both');		
		this.doorRelay = new OutputGpioController(25);

		var previousDoorState = this.doorSwitch.readSync();
		this.doorSwitch.watch((error, value) => {
			if (error) {
				log("Error on door switch:" + error);
				return
			}

			log("doorSwitch watch updated: " + value);
			if (value !== previousDoorState) {
				previousDoorState = value;
				this.onStateChange(this.isOpen());
			}
		});
	}

    isOpen(): boolean {
		return this.doorSwitch.readSync() === 1 ? true : false;
	}

    open() {
		if (this.isOpen() === false) {
			this.toggleDoorRelay()
		}
	}

    close() {
		if (this.isOpen() === true) {
			this.toggleDoorRelay()
		}
	}

	toggleDoorRelay() {
		this.doorRelay.switchOn();
		setTimeout(() => {
			this.doorRelay.switchOff();
		}, 1000);
	}
}

export class OutputGpioController implements GpioController {
	garageRelay: any;
	constructor(gpioPin: number) {
		this.garageRelay = new Gpio(gpioPin, 'out');
		this.garageRelay.writeSync(0);
	}

	isSwitchOn(): boolean {
		return this.garageRelay.readSync() === 1 ? true : false;
	}

    switchOn(): void {
		this.garageRelay.writeSync(1);
	}

    switchOff(): void {
		this.garageRelay.writeSync(0);
	}
}
