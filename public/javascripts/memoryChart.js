/* Calculate hourly average values for the specified date.
   Set parameters in specific section of `args`
   and specify section for `a` variable.

   `daystr` should be specified in `Date.parse()` format
   @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
 */

var args = {
    aexmem_dev: {
        daystr: '2021-08-31T16:00:00.000+00:00',
        stepMins: 10,
        numSteps: 120
    },
    aexmem_prod: {
       daystr: '2021-09-01T01:00:00.000+00:00',
       stepMins: 5,
       numSteps: 3000
    }
};
var a = args['aexmem_prod'];
var form = document.forms.params;
form.elements.daystr.value = a.daystr;
form.elements.stepMins.value = a.stepMins;
form.elements.numSteps.value = a.numSteps;

$(function () {
    $('#findGaps').on('click', findGaps);
    $('#onSubmit').on('click', onSubmit);
});

function onSubmit(event) {
    a.daystr = form.elements.daystr.value;
    a.stepMins = form.elements.stepMins.value;
    a.numSteps = form.elements.numSteps.value;

    $.get('/config').then(config => {
        a.hostName = config.host_name;
        $.get(`/avg?t=${encodeURIComponent(a.daystr)}&m=${a.stepMins}&n=${a.numSteps}`).then(
            createChart
        );
    });
    event.preventDefault();
}

function findGaps(event) {
    $.get('/gaps');
    event.preventDefault();
}

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