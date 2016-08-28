import * as _ from 'lodash';

import { GarageState } from './gpio/garageController';

export enum DoorState {
    Open = 1,
    Opening,
    Close,
    Closing,
    Unknown
}

const doorStateMap = {
    "open": DoorState.Open,
    "opening": DoorState.Opening,
    "close": DoorState.Close,
    "closing": DoorState.Closing
}

export function doorStateFromString(state: String): DoorState {
    const lowerCaseState = state.toLowerCase();
    return _.has(doorStateMap, lowerCaseState) ? doorStateMap[lowerCaseState] : DoorState.Unknown;
}

export function doorStateFromGarageState(state: GarageState): DoorState {
    return state.isDoorOpen ? DoorState.Open : DoorState.Close;
}

export function stringifyDoorState(state: DoorState) {
    return _.findKey(doorStateMap, state.toString());
}