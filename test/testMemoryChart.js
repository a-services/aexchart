const mongo = require('../service/memoryChart.service');
const { addMinutes, df } = require('../service/utils.service');
const debug = require('debug')('test');

//mongo.findFrom(new Date('2021-08-31T16:00:00.000+00:00'),1,50);
//console.log(mongo.df(new Date()));

//mongo.findGaps().then(() => { mongo.close() })

/* `calcHourlyAverage` is called by `GET /avg`
 */
mongo.calcHourlyAverage('2021-08-31T16:00:00.000+00:00',1,50).then(() => { mongo.close() });

//testParseDate('2021-07-12T00:00:00.000-04:00');

// ------------------

//mongo.close();

function testParseDate(dateStamp) {
    let t = Date.parse(dateStamp);
    t = addMinutes(t, -60);
    console.log(df(t));
}


