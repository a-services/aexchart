const { client } = require('./mongo.service');
const config = require('./config.service');
const { addMinutes, df } = require('./utils.service');

const COLL_REQ = "exclogs-2021-07-27";

var db = client.db(config.req_db);

/**
 * Memory data reports from Mongo.
 */
async function findGaps() {
    const DELTA = 50000;

    /* Print the number of documents in the collection.
     */
    let coll = db.collection(COLL_REQ);
    let memCount = await coll.countDocuments();
    console.log("mem count: " + memCount);

    /* Get the cursor to a sorted collection.
     */
    console.log("------------- Gap -------------");
    var cursor = await coll.find({}, { sort: { tstamp: 1 } });
    var d1 = null;
    var t1 = null;

    /* Go through the entries and print the intervals for tstamp.
     */
    await cursor.forEach(d2 => {
        var t2 = d2.tstamp.getTime();
        if (t1) {

            /* Find out consecutive values with a difference greater than the specified
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
 * Histogram of the number of requests (server load).
 * @param {number} numSteps  Number of steps
 * @returns Array of data
 */
async function buildRequestsHistogram(numSteps) {
    let coll = db.collection(COLL_REQ);

    /* Find the minimum
     */
    let min = await coll.aggregate([
        { $group: { _id: null, min: { $min: "$tstamp" } } }
    ]).toArray();
    console.log('-- min:', min[0].min);
    let tmin = min[0].min.getTime();

    /* Find the maximum
     */
    let max = await coll.aggregate([
        { $group: { _id: null, max: { $max: "$tstamp" } } }
    ]).toArray();
    console.log('-- max:', max[0].max);
    let tmax = max[0].max.getTime();

    let step = (tmax - tmin) / numSteps;
    console.log('-- step: ' + (step/1000).toFixed(2) + ' sec ~ ' + Math.round(step/1000/60) + ' min');

    /* Count the number of requests on each interval
     */
    let result = [];
    let t1 = tmin;
    for (let i = 0; i < numSteps; i++) {
        let t2 = t1 + step;
        let match = { $and: [{ tstamp: { $gte: new Date(t1) } }, { tstamp: { $lt: new Date(t2) } }] };

        let count = await coll.find(match).count();

        result.push({
            t: new Date(t1).toISOString(),
            count: count
        });
        t1 = t2;
    }
    return result;
}

module.exports.findGaps = findGaps;
module.exports.buildRequestsHistogram = buildRequestsHistogram;