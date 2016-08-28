import { assert } from 'chai';
import { DoorState, doorStateFromGarageState, doorStateFromString, stringifyDoorState } from './doorState';
import { GarageState } from './gpio/garageController';

describe('DoorState enum', function() {
    it('should create enum from string', function() {
        assert.equal(doorStateFromString('open'), DoorState.Open, 'lower case test');
        assert.equal(doorStateFromString('opening'), DoorState.Opening);
        assert.equal(doorStateFromString('close'), DoorState.Close);
        assert.equal(doorStateFromString('closing'), DoorState.Closing);

        assert.equal(doorStateFromString('Open'), DoorState.Open, 'case should not matter');
        assert.equal(doorStateFromString('opening'), DoorState.Opening, 'case should not matter');
        assert.equal(doorStateFromString('CLOSE'), DoorState.Close, 'case should not matter');
        assert.equal(doorStateFromString('closING'), DoorState.Closing, 'case should not matter');

        assert.equal(doorStateFromString(''), DoorState.Unknown);
        assert.equal(doorStateFromString('123'), DoorState.Unknown);
        assert.equal(doorStateFromString(undefined), DoorState.Unknown);
        assert.equal(doorStateFromString(null), DoorState.Unknown);
    });

    it('should create enum by garage state', function() {
        assert.equal(doorStateFromGarageState(<GarageState>{ isDoorOpen: true }),  DoorState.Open);
        assert.equal(doorStateFromGarageState(<GarageState>{ isDoorOpen: false }),  DoorState.Close);
    });

    it('stringify door state', function() {
        assert.equal(stringifyDoorState(DoorState.Open), 'open');
        assert.equal(stringifyDoorState(DoorState.Opening), 'opening');
        assert.equal(stringifyDoorState(DoorState.Close), 'close');
        assert.equal(stringifyDoorState(DoorState.Closing), 'closing');
    });
});
