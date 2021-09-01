/* Calculate hourly average values for the specified date.
   Set parameters in specific section of `args`
   and specify section for `a` variable.

   `daystr` should be specified in `Date.parse()` format
   @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
 */

var args = {
    aexmem_dev: {
        daystr: '2021-08-31T16:00:00.000+00:00',
        stepMins: 5,
        numSteps: 120
    },
    aexmem_prod: {
       daystr: '2021-07-12',
       stepMins: 30,
       numSteps: 50
    }
};
var a = args['aexmem_dev'];

$.get('/config').then(config => {
    a.hostName = config.host_name;
    $.get(`/avg?t=${encodeURIComponent(a.daystr)}&m=${a.stepMins}&n=${a.numSteps}`).then(
        createChart
    );
});


function createChart(cdata) {
    var labels = cdata.map(it => it.t /*.substring(11,23)*/);

    var maxData = cdata.map(it => it.max / 1024 / 1024);
    var maxColor = 'rgb(127, 193, 242)';

    var avgData = cdata.map(it => it.avg / 1024 / 1024);
    var avgColor = 'rgb(255, 99, 132)';

    var minData = cdata.map(it => it.min / 1024 / 1024);
    var minColor = maxColor;

    //console.log('labels:', labels);
    //console.log('data:', zdata);

    const data = {
        labels: labels,
        datasets: [
            {
                label: "max",
                backgroundColor: maxColor,
                borderColor: maxColor,
                data: maxData,
            },
            {
                label: "avg",
                backgroundColor: avgColor,
                borderColor: avgColor,
                data: avgData,
            },
            {
                label: "min",
                backgroundColor: minColor,
                borderColor: minColor,
                data: minData,
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Free Memory, MB. Average per ${a.stepMins} mins, ${a.hostName}`
                }
            }
        }
    };

    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}