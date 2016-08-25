import * as firebase from 'firebase';
import * as nconf from 'nconf';
import * as moment from 'moment';

import { GarageController } from './gpio/garageController';

export function readConfiguration() {
    nconf.file({
        file: 'config.json'
    });

    const firebaseConfig = nconf.get('garage:firebase');
    console.log('firebase config: ' + JSON.stringify(firebaseConfig, null, 4));
    return firebaseConfig;
}

interface DoorState {
    timestamp: string;
    state: string;
}

export class FirebaseBridge {
    garage: GarageController;

    constructor(garageController: GarageController, firebaseConfig: Object) {
        this.garage = garageController;

        firebase.initializeApp(firebaseConfig);
        const ref = firebase.database().ref('door-state');
        ref.on('value', this.onDoorStateUpdated);
    }

    onDoorStateUpdated = (value) => {
        const body = value.val();
        const state = body.state;
        console.log("onDoorStateUpdated" + JSON.stringify(body, null, 4));

        if (this.isFreshEvent(state)) {
            switch (state) {
                case "Open":
                    console.log("should open garage");
                    this.garage.openGarageDoor();
                    break;
                case "Close":
                    console.log("should close garage");
                    this.garage.closeGarageDoor();
                    break;
            }
        } else {
            console.error('door state is too old, not responsing');
        }
    }

    isFreshEvent(doorState: DoorState): boolean {
        const timestampIsoString = doorState.timestamp;
        const timestamp = moment(timestampIsoString);
        return (moment().diff(timestamp, 'seconds') <= 60);
    }
}