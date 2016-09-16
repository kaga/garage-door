const bleno = require('bleno');
const nconf = require('nconf');

nconf.env().argv();
nconf.file({
  file: 'config.json'
});

const uuid = nconf.get('iBeaconUuid');
const major = nconf.get('major');
const minor = nconf.get('minor');
const measuredPower = nconf.get('measuredPower'); // -128 - 127

nconf.required(['iBeaconUuid', 'major', 'minor', 'measuredPower']);

bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower);
  }
});

bleno.on('advertisingStart', function () {
  console.log('on -> advertisingStart');
});

bleno.on('advertisingStop', function () {
  console.log('on -> advertisingStop');
});