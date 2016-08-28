import * as firebase from 'firebase';
import * as nconf from 'nconf';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as when from 'when';

import { GarageController, GarageState } from './gpio/garageController';
import { DoorState, doorStateFromGarageState, doorStateFromString, stringifyDoorState } from './doorState';

export function readConfiguration() {
    nconf.file({
        file: 'config.json'
    });

    const firebaseConfig = nconf.get('garage:firebase');
    console.log('firebase config: ' + JSON.stringify(firebaseConfig, null, 4));
    return firebaseConfig;
}

interface DoorStateEvent {
    timestamp: string;
    state: string;
    source?: string;
}

export class FirebaseBridge {
    garage: GarageController;
    private doorStateRef: firebase.database.Reference;

    constructor(garageController: GarageController, firebaseConfig: Object) {
        this.garage = garageController;

        firebase.initializeApp(firebaseConfig);
        const ref = firebase.database().ref('door-state');
        ref.on('value', this.onDoorStateUpdated);
        this.doorStateRef = ref;
    }

    onDoorStateUpdated = (value) => {
        const body: DoorStateEvent = value.val();        
        console.log("onDoorStateUpdated" + JSON.stringify(body, null, 4));

        if (this.isStateFromDevice(body) && this.isFreshEvent(body)) {
            const state = body.state;
            const doorState = doorStateFromString(state);
            switch (doorState) {
                case DoorState.Open:
                    console.log("should open garage");
                    this.garage.openGarageDoor();
                    break;
                case DoorState.Close:
                    console.log("should close garage");
                    this.garage.closeGarageDoor();
                    break;
            }
        }
    }

    isFreshEvent(doorState: DoorStateEvent): boolean {
        const timestampIsoString = doorState.timestamp;
        if (_.isString(timestampIsoString) == false) {
            return false;
        }

        const timestamp = moment(timestampIsoString);
        return (moment().diff(timestamp, 'seconds') <= 60);
    }

    isStateFromDevice(doorState: DoorStateEvent): boolean {
        return _.isString(doorState.source);
    }

    setNeedSynchronize() {
        const currentState = this.garage.getGarageState();

        this.doorStateRef.once('value').then((snapshot) => {
            return this.shouldUpdateFirebaseState(currentState, snapshot);
        })
            .then((shouldUpdate) => {
                if (shouldUpdate) {
                    this.synchronizeSevice();
                }
            });
    }  

    synchronizeSevice() {
        const currentState = this.garage.getGarageState();
        this.doorStateRef.set({
            timestamp: new Date().toISOString(),
            state: stringifyDoorState(doorStateFromGarageState(currentState))
        });
    }

    shouldUpdateFirebaseState(garageState: GarageState, snapshot: firebase.database.DataSnapshot): boolean {
        const body = snapshot.val();
        const state = body.state;
        const firebaseDoorState = doorStateFromString(state);
        const localDoorState = doorStateFromGarageState(garageState);          
        console.log('local state: ' + stringifyDoorState(localDoorState));
        console.log('firebase state: ' + stringifyDoorState(firebaseDoorState));      
        return (firebaseDoorState !== localDoorState);
    }
}