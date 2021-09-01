const express = require('express');
const path = require('path');
const memoryChart = require('./service/memoryChart.service');
const requestChart = require('./service/requestChart.service');
const config = require('./service/config.service');
const debug = require('debug')('app');

let app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/data', (req, res, next) => {
  let tstamp = req.query.t;
  let limit = parseInt(req.query.limit);
  let jump = parseInt(req.query.jump);
  debug(tstamp);
  debug(limit);
  debug(jump);
  memoryChart.findFrom(new Date(tstamp), limit, jump).then(result => {
    res.send(result);
  })
});

/* Calculate hourly average values for the specified date.
 */
app.get('/avg', (req, res, next) => {
  var dateStamp = req.query.t;
  var stepMins = parseInt(req.query.m);
  var numSteps = parseInt(req.query.n);
  memoryChart.calcHourlyAverage(dateStamp, stepMins, numSteps).then(result => {
    res.send(result);
  })
});

/* Histogram of the number of requests (server load).
 */
app.get('/req_hist', (req, res, next) => {
  var numSteps = parseInt(req.query.n);
  requestChart.buildRequestsHistogram(numSteps).then(result => {
    res.send(result);
  })
});

/* Return configuration settings.
 */
app.get('/config', (req, res, next) => {
  res.send(config);
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({
      message: err.message,
      error: {}
  });
});

module.exports = app;
