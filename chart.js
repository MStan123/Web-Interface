function createChart(canvasId, label, borderColor) {
    var data = [];
    var prev = 100;
    for (var i = 0; i < 1000; i++) {
        prev += 5 - Math.random() * 10;
        data.push({ x: i, y: prev });
    }

    var delayBetweenPoints = 10;
    var started = {};
    var ctx = document.getElementById(canvasId).getContext("2d");
    var chart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    label: label,
                    backgroundColor: "transparent",
                    borderColor: borderColor,
                    borderWidth: 1,
                    pointRadius: 0,
                    data: data,
                    fill: true,
                    animation: (context) => {
                        var delay = 0;
                        var index = context.dataIndex;
                        var chart = context.chart;
                        if (!started[index]) {
                            delay = index * delayBetweenPoints;
                            started[index] = true;
                        }
                        var { x, y } = index > 0 ? chart.getDatasetMeta(0).data[index - 1].getProps(['x', 'y'], true) : { x: 0, y: chart.scales.y.getPixelForValue(100) };

                        return {
                            x: {
                                easing: "linear",
                                duration: delayBetweenPoints,
                                from: x,
                                delay
                            },
                            y: {
                                easing: "linear",
                                duration: delayBetweenPoints * 500,
                                from: y,
                                delay
                            },
                            skip: {
                                type: 'boolean',
                                duration: delayBetweenPoints,
                                from: true,
                                to: false,
                                delay: delay
                            }
                        };
                    }
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'linear'
                }
            }
        },
        plugins: [{
            id: 'force_line_update',
            beforeDatasetDraw(chart, ctx) {
                ctx.meta.dataset.points = ctx.meta.data;
            }
        }]
    });
}