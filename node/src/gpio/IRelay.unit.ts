var assert = require('chai').assert;
import IRelay = require('./IRelay');

describe('DebounceRelay', function () {
    it('should fire switch off once', function (done) {
        var numberOfStateTrue = 0;
        var numberOfStateFalse = 0;

        var relay = new IRelay.DebounceRelay({
            activateDurationInSeconds: 1,
            gpioOutputPin: 10
        }, (state) => {
            if (state == true) {
                numberOfStateTrue += 1;
            } else {
                numberOfStateFalse += 1;
            }
        });

        relay.switchOn();
        relay.switchOn();

        setTimeout(() => {
            assert.equal(numberOfStateTrue, 2);
            assert.equal(numberOfStateFalse, 1);
            done();
        }, 1100);
    });
});