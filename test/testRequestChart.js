const chart = require('../service/requestChart.service');
const { close } = require('../service/mongo.service');

//chart.findGaps()
chart.buildHisto(10)
.then(function success(result) {
    console.log('-- success:', result);
    close();
}, function error(e) {
    console.log('-- error:', e);
    close();
});