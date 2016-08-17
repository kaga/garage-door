import express = require('express');
var sendevent = require('sendevent');

var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

var events = sendevent('/events/garage');
app.use(events);

app.get('/v2/ping', function(req, res) {
  var body = new Date();
	res.send(body);
});

setInterval(function () {

    var testdata = {
      timestamp: new Date(),
      isOpen: true
    }

    console.log('writing ' + testdata);
    events.broadcast(testdata);
}, 5000);

app.use(express.static(__dirname + '/dist'));

var port = 8080;
app.listen(port, function () {
  console.log("Running at Port " + port);
});