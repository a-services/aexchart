/*
var daystr = '2021-07-08';
var limit = 200000;
var jump = 500;
$.get(`/data?t=${daystr}T09:01:42&limit=${limit}&jump=${jump}`).then(createChart);
*/

var daystr = '2021-07-12';
var stepMins = 30;
var numSteps = 50;
$.get(`/avg?t=${daystr}&m=${stepMins}&n=${numSteps}`).then(createChart);

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
                    text: `Free Memory, MB. Average per ${stepMins} mins, MIT PROD (mykpaempap001v.mid.northwell.edu)`
                }
            }
        }
    };

    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}