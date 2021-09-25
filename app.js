const express = require('express');
const path = require('path');
const memoryChart = require('./service/memoryChart.service');
const config = require('./service/config.service');
const debug = require('debug')('app');

let app = express();

app.use(express.static(path.join(__dirname, 'public')));

/* Extract memory data from database.
 */
app.get('/data', async (req, res, next) => {
  let tstamp = req.query.t;
  let limit = parseInt(req.query.limit);
  let jump = parseInt(req.query.jump);
  debug(tstamp);
  debug(limit);
  debug(jump);
  await memoryChart.findFrom(new Date(tstamp), limit, jump).then(result => {
    res.send(result);
  })
});

/* Print time intervail when memory data is available.
 */
app.get('/gaps', async (req, res, next) => {
  await memoryChart.findGaps();
});

/* Calculate hourly average values for the specified date.
 */
app.get('/avg', async (req, res, next) => {
  var dateStamp = req.query.t;
  var stepMins = parseInt(req.query.m);
  var numSteps = parseInt(req.query.n);
  await memoryChart.calcHourlyAverage(dateStamp, stepMins, numSteps).then(result => {
    res.send(result);
  })
});

/* Return configuration settings.
 */
app.get('/config', (req, res, next) => {
  console.log("------------- config ----------");
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
