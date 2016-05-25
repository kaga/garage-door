import _ = require('lodash');

export interface IOutputRelay {
    activateDurationInSeconds: number;
    gpioOutputPin: number;
}

export class DebounceRelay {
    private outputRelay: IOutputRelay;
    private callback: (state: boolean) => void;
    private debounceSwitchOff: () => void;

    constructor(outputRelay: IOutputRelay, callback: (state: boolean) => void) {
        this.outputRelay = outputRelay;
        this.callback = callback;

        this.debounceSwitchOff = _.debounce(this.switchOff, <number>outputRelay.activateDurationInSeconds * 1000, {
            leading: false,
            trailing: true
        });
    }

    switchOn() {
        this.callback(true);
        this.debounceSwitchOff();
    }

    private switchOff = () => {
        this.callback(false);
    }
}