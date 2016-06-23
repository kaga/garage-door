import when = require('when');

export interface GarageState {
    timestamp: Date;	
    isOpen: boolean;
    isGarageLightSwitchOn: boolean;
    automaticallyTimeSwitchOff?: Date;

    //Old formate
    isDoorOpen: boolean;
    isLightSwitchOn: boolean;
}

export interface GpioController {
    isSwitchOn(): boolean;
    switchOn(): void;
    switchOff(): void;  
}

export class MockGpioController implements GpioController {
    private state: boolean = false;
    private callback: ((state: boolean) => void);

    isSwitchOn(): boolean {
        return this.state;
    }

    switchOn(): void {
        this.state = true;
    }

    switchOff(): void {
        this.state = false;
    }

    watch(onStateChange: (state: boolean) => void): void {
        this.callback = onStateChange;
    }
} 

export interface DoorController {
    onStateChange: (state: boolean) => void
    isOpen(): boolean;
    open();
    close();
}

export class MockDoorController implements DoorController {
    private isDoorOpen: boolean = false;
    onStateChange: ((state: boolean) => void) = () => {};

    isOpen(): boolean {
        return this.isDoorOpen;
    }

    open() {
        this.isDoorOpen = true;
        this.onStateChange(this.isDoorOpen);
    }

    close() {
        this.isDoorOpen = false;
        this.onStateChange(this.isDoorOpen);
    }
}

export class DebounceRelay {
    private timeoutReference: any;

    constructor(private maximumSwitchOnTimeInMinutes: number,
                private callback: (state: boolean) => void) {        
    }

    switchOn = (durationInMinutes: number) => {
        //Math.min(durationInMinutes, this.maximumSwitchOnTimeInMinutes)  
        this.callback(true);

        if (this.timeoutReference) {
            clearTimeout(this.timeoutReference);
        }
        this.timeoutReference = setTimeout(this.switchOff, durationInMinutes * 1000 * 60);        
    }

    switchOff = () => {
        this.callback(false);
    }
}

export class GarageController {
    private lightDebounceSwitch: DebounceRelay;

    constructor(private doorController: DoorController, 
                private lightController: GpioController,
                private onGarageStateChange: (state: GarageState) => void) {

        this.lightDebounceSwitch = new DebounceRelay(1, (state) => {
            if (state) {
                this.lightController.switchOn();
            } else {
                this.lightController.switchOff();
            }
        });
        doorController.onStateChange = (state: boolean) => {
            this.lightDebounceSwitch.switchOn(1);            
            this.fireOnGarageStateChange();
        }
    }

    switchOnLightsForDuration(durationInMinutes: number) {
        this.lightDebounceSwitch.switchOn(durationInMinutes);
        return when.resolve(this.getGarageState())  
            .tap(this.fireOnGarageStateChange)
    }

    switchOffLights(): when.Promise<GarageState> {
        this.lightDebounceSwitch.switchOff();
        return when.resolve(this.getGarageState())
            .tap(this.fireOnGarageStateChange)    
    }

    openGarageDoor(): when.Promise<GarageState> {
        this.doorController.open();
        return this.switchOnLightsForDuration(1);
    }

    closeGarageDoor(): when.Promise<GarageState> {
        this.doorController.close();
        return this.switchOnLightsForDuration(1);
    }

    getGarageState(): GarageState {
        var doorOpen = this.doorController.isOpen();
        var isLightSwitchOn = this.lightController.isSwitchOn() 
        return {
            timestamp: new Date(),
		    isDoorOpen: doorOpen,
		    isLightSwitchOn: isLightSwitchOn,
            isOpen: doorOpen,
            isGarageLightSwitchOn: isLightSwitchOn
        }
    }

    private fireOnGarageStateChange = () => {
        this.onGarageStateChange(this.getGarageState());        
    }
} 