const config = require('./config.service');
const { addMinutes, df } = require('./utils.service');
const debug = require('debug')('memoryChart');
const { client } = require('./mongo.service');

const COLL_MEM = "meminfo";

var db = client.db(config.mem_db);
debug("connected");


/**
 * Extract memory data from database.
 *
 * @param {Date} date     Results should be after or equal this date
 * @param {number} limit  Max number of results
 * @param {number} jump   Averaging over a specified number of measurements
 * @returns Result list
 */
async function findFrom(date, limit, jump) {
  console.log('findFrom:', date);

  let coll = db.collection(COLL_MEM);
  let cursor = await coll.find({
    t: { $gte: date }
  }).limit(limit);
  debug('cursor');

  let count = 0;
  let result = [];
  let j = 0;
  let sum = 0;
  await cursor.forEach(it => {
    count++;
    j++;
    sum += it.mem;
    //debug(it);
    if (j == jump) {
      it.mem = sum / jump;
      result.push(it);
      j = 0;
      sum = 0;
    }
  });
  debug('=== count:', count);
  return result;
}

/**
 * Memory data reports from Mongo.
 */
async function findGaps() {
  const DELTA = 50000;

  let coll = db.collection(COLL_MEM);
  let memCount = await coll.countDocuments();
  console.log("mem count: " + memCount);

  console.log("------------- Gap -------------");
  var cursor = await coll.find({}, { sort: { t: 1 } });
  var d1 = null;
  var t1 = null;

  await cursor.forEach(d2 => {
    var t2 = d2.t.getTime();
    if (t1) {
      /* Determine consecutive values with a difference greater than the specified
       */
      if (t2 - t1 > DELTA) {
        console.log(df(t1) + " -- " + df(t2) + " \t d: " + (t2 - t1));
      }
    } else {
      console.log(df(t2));
    }
    t1 = t2;
  });
  console.log(df(t1));
}

/**
 * Calculate hourly average values for the specified date.
 * @param {string} dateStamp  date
 * @param {number} stepMins   averaging step in minutes
 * @param {number} numSteps   number of steps
 */
async function calcHourlyAverage(dateStamp, stepMins, numSteps) {

  let coll = db.collection(COLL_MEM);
  let d1 = Date.parse(dateStamp);
  let d2 = addMinutes(d1, stepMins);
  let result = [];
  for (let i = 0; i < numSteps; i++) {
    d1 = d2;
    d2 = addMinutes(d2, stepMins);

    let match = { $and: [{ t: { $gte: new Date(d1) } }, { t: { $lt: new Date(d2) } }] };

    /* Calculate the average over an interval
     */
    let avg = await coll.aggregate([
      { $match:  match},
      { $group: { _id: null, avg: { $avg: "$mem" } } }
    ]).toArray();

    if (avg.length > 0) {

      /* Calculate the maximum over the interval
       */
      let max = await coll.aggregate([
        { $match:  match},
        { $group: { _id: null, max: { $max: "$mem" } } }
      ]).toArray();

      let min = await coll.aggregate([
        { $match:  match},
        { $group: { _id: null, min: { $min: "$mem" } } }
      ]).toArray();

      result.push({
        t: new Date(d1).toISOString(),
        max: Math.round(max[0].max),
        avg: Math.round(avg[0].avg),
        min: Math.round(min[0].min)
      });
    }
  }
  return result;
}

/**
 * Calculating the average over an array.
 * @param {array} b
 * @returns  average value
 */
function avg(b) {
  let s = 0;
  for (let i = 0; i < b.length; i++) {
    s += b[i].mem;
  }
  //console.log("s:",s," -- b.length:",b.length);
  return s / b.length;
}

module.exports.findFrom = findFrom;
module.exports.findGaps = findGaps;
module.exports.calcHourlyAverage = calcHourlyAverage;