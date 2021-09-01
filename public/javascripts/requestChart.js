/* Histogram of the number of requests (server load).
 */

var numSteps = 20;
$.get(`/req_hist?n=${numSteps}`).then(createChart);

function createChart(cdata) {
    var labels = cdata.map(it => it.t);

    var data = cdata.map(it => it.count);
    var color = 'rgb(255, 99, 132)';

    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "count",
                    backgroundColor: color,
                    borderColor: color,
                    data: data,
                }
            ]
        },
        options: {
            responsive: true,
        }
    };

    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}