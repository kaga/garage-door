var assert = require('chai').assert;
import sinon = require('sinon');
import { GarageController, MockGpioController, MockDoorController, GarageState, DebounceRelay } from './garageController';

describe('Garage Controller', () => {
    describe("Garage Door", () => {
        var garageController: GarageController;
        var clock;
        beforeEach(() => {
            var doorGpioController = new MockDoorController();
            var lightGpioController = new MockGpioController();
            garageController = new GarageController(doorGpioController, lightGpioController, () => { });
            clock = sinon.useFakeTimers();
        });

        afterEach(function () {
            clock.restore();
        });

        it("should open garage door", () => {
            var beforeOpenState = garageController.getGarageState();
            assert.equal(beforeOpenState.isDoorOpen, false);

            return garageController.openGarageDoor()
                .then((afterOpenState) => {
                    assert.equal(afterOpenState.isDoorOpen, true);
                    assert.equal(afterOpenState.isLightSwitchOn, true, "switch on lights on garage open");
                });
        });

        it("should close garage door", () => {
            return garageController.openGarageDoor()
                .then((beforeCloseState) => {
                    assert.equal(beforeCloseState.isDoorOpen, true);
                    return garageController.closeGarageDoor();
                })
                .then((afterCloseState) => {
                    assert.equal(afterCloseState.isDoorOpen, false);
                    assert.equal(afterCloseState.isLightSwitchOn, true, "switch off lights on garage close");
                });
        });

        it("should switch on/off garage light", () => {
            var state = garageController.getGarageState();
            assert.equal(state.isLightSwitchOn, false);

            return garageController.switchOnLightsForDuration(10)
                .then((state) => {
                    assert.equal(state.isLightSwitchOn, true);
                    return garageController.switchOffLights();
                })
                .then((state) => {
                    assert.equal(state.isLightSwitchOn, false);
                });
        });

        it("should automatically switch off the garage light", function() {
            var state = garageController.getGarageState();
            assert.equal(state.isLightSwitchOn, false);

            return garageController.switchOnLightsForDuration(1)
                .then((state) => {
                    assert.equal(state.isLightSwitchOn, true);
                    clock.tick(60 * 1000);
                    var afterTimeElapseState = garageController.getGarageState();
                    assert.equal(afterTimeElapseState.isLightSwitchOn, false);
                });
        });
    });
});

describe('DebounceRelay', function () {
    var clock;
    beforeEach(function () {
        clock = sinon.useFakeTimers();
    });

    afterEach(function () {
        clock.restore();
    });

    it('should fire switch off once', function (done) {
        var numberOfStateTrue = 0;
        var numberOfStateFalse = 0;

        var relay = new DebounceRelay(1, (state) => {
            if (state == true) {
                numberOfStateTrue += 1;
            } else {
                numberOfStateFalse += 1;
            }
        });
        assert.equal(numberOfStateTrue, 0);
        assert.equal(numberOfStateFalse, 0);
        relay.switchOn(1);
        assert.equal(numberOfStateTrue, 1);
        assert.equal(numberOfStateFalse, 0);
        clock.tick(30 * 1000);
        assert.equal(numberOfStateTrue, 1);
        assert.equal(numberOfStateFalse, 0, "should not switch it off yet");
        relay.switchOn(1);
        assert.equal(numberOfStateTrue, 2);
        assert.equal(numberOfStateFalse, 0, "still should not switch it off yet");
        clock.tick(40 * 1000);
        assert.equal(numberOfStateTrue, 2);
        assert.equal(numberOfStateFalse, 0, "still should switch it off yet because the second switch on extended it");
        clock.tick(60 * 1000);
        assert.equal(numberOfStateTrue, 2);
        assert.equal(numberOfStateFalse, 1);
        done();
    });
});