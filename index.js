// BAR CHART
var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

var svgWidth = 500,
    svgHeight = 400,
    barPadding = 5;

var barWidth = (svgWidth / dataset.length);

var svg = d3.select('svg')
    .attr('width', '100%')
    .attr('height', svgHeight)
    .attr('fill', '#C0D3D5');

var xScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, svgWidth]);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([svgHeight, 0]);

var x_axis = d3.axisBottom()
    .scale(xScale);

var y_axis = d3.axisLeft()
    .scale(yScale);

var barchart = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('y', function (d) {
        return svgHeight - yScale(d);
    })
    .attr('height', function (d) {
        return yScale(d);
    })
    .attr('width', barWidth - barPadding)
    .attr('fill', '#105181')
    .attr('transform', function (d, i) {
        var translate = [barWidth * i + 50, -20];
        return 'translate(' + translate + ')';
    });

var text = svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(function (d) {
        return d;
    })
    .attr('y', function (d) {
        return svgHeight - yScale(d) - 22;
    })
    .attr('x', function (d, i) {
        return (barWidth * i + (barWidth - barPadding) / 2) - ((barWidth - barPadding) / 2) / 2 + 50;
    })
    .attr('fill', '#a64c38');

svg.append('g')
    .attr('transform', 'translate(50, -20)')
    .call(y_axis);
svg.append('g')
    .attr('transform', 'translate(50, ' + (svgHeight - 20) + ')')
    .call(x_axis);
// d3.select('body')
// .selectAll('p')
// .data(dataset)
// .enter()
// .append('p')
// // .text('D3 is awesome');
// .text(function (d) {
//     return d;
// })


// SVG SHAPE
// var svgShape = d3.select('.svg-shape')
//     .attr('width', '100%')
//     .attr('height', svgHeight)
//     .attr('fill', '#C0D3D5');
//
// var line = svgShape.append('line')
//     .attr('x1', 100)
//     .attr('x2', 500)
//     .attr('y1', 50)
//     .attr('y2', 50)
//     .attr('stroke', 'red')
//     .attr('stroke-width', 5);
// var rect = svgShape.append('rect')
//     .attr('x1', 100)
//     .attr('x2', 100)
//     .attr('width', 200)
//     .attr('height', 100)
//     .attr('fill', '#9b95ff');
// var circle = svgShape.append('circle')
//     .attr('cx', 100)
//     .attr('cy', 200)
//     .attr('r', 80)
//     .attr('fill', '#9b95ff');

// PIE CHART

var data2 = [
    {'platform': 'Android', 'percentage': 40.11},
    {'platform': 'Windows', 'percentage': 36.69},
    {'platform': 'iOS', 'percentage': 13.06}
];
var radius = Math.min(svgWidth, svgHeight) / 2;
var piechart = d3.select('.svg-piechart')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var g = piechart.append('g')
    .attr('transform', 'translate(' + radius + ', ' + radius + ')');

var pieColor = d3.scaleOrdinal(d3.schemeCategory10);

var pie = d3.pie().value(function (d) {
    return d.percentage;
});

var path = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);
var arc = g.selectAll('arc')
    .data(pie(data2))
    .enter()
    .append('g');

arc.append('path')
    .attr('d', path)
    .attr('fill', function (d) {
        return pieColor(d.data.percentage);
    });

// LINE CHART

const api = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-12-31&end=2018-04-01';

document.addEventListener('DOMContentLoaded', function (event) {
    fetch(api)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var parsedData = parseData(data);
            drawChart(parsedData);
            drawBarChart(parsedData);
        })
        .catch(function (err) {
            console.log(err);
        })
});

function parseData(data) {
    var arr = [];
    for (var i in data.bpi) {
        arr.push({
            date: new Date(i),
            value: +data.bpi[i] // Convert String to number
        });
    }
    return arr;
}

function drawChart(data) {
    var svgWidth1 = 600,
        svgHeight1 = 400;
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var width1 = svgWidth1 - margin.left - margin.right;
    var height1 = svgHeight1 - margin.top - margin.bottom;

    var lineChart = d3.select('.svg-linechart')
        .attr('width', svgWidth1)
        .attr('height', svgHeight1);

    var g = lineChart.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    var x = d3.scaleTime()
        .rangeRound([0, width1]);
    var y = d3.scaleLinear()
        .rangeRound([height1, 0]);

    var line = d3.line()
        .x(function (d) {
            return x(d.date)
        })
        .y(function (d) {
            return y(d.value)
        });

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain(d3.extent(data, function (d) {
        return d.value;
    }));

    g.append('g')
        .attr('transform', 'translate(0, ' + height1 + ')')
        .call(d3.axisBottom(x))
        .select('.domain')
        .remove();
    g.append('g')
        .call(d3.axisLeft(y))
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Price ($)');
    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.5)
        .attr('d', line);
}

function drawBarChart(data) {
    var svgWidth = 500,
        svgHeight = 400,
        barPadding = 2;

    var barWidth = (svgWidth / data.length);

    var x = d3.scaleTime()
        .rangeRound([0, svgWidth]);
    var y = d3.scaleLinear()
        .rangeRound([svgHeight, 0]);

    var barchartAPI = d3.select('.svg-barchartAPI')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    var g = barchartAPI.append('g')
        .attr('transform', function (d, i) {
            var translate = [barWidth * i + 50, -20];
            return 'translate(' + translate + ')';
        });

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain(d3.extent(data, function (d) {
        return d.value;
    }));

    var xScale = d3.scaleTime()
        .domain((d3.extent(data, function (d) {
            return d.date;
        })))
        // .range([barPadding, svgWidth - barPadding]);
        .range([barPadding, 1000 - barPadding]);

    var x_axis = d3.axisBottom()
        .scale(xScale)

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + svgHeight + ")")
        // .call(d3.axisBottom(x))
        .call(x_axis);
        // .select('.domain')
        // .remove();

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

    g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function (d) {
            return x(d.date);
        })
        .attr('y', function (d) {
            return y(d.value);
        })
        .attr('height', function (d) {
            return svgHeight - y(d.value);
        })
        .attr('width', barWidth - barPadding)
        .attr('transform', function (d, i) {
            var translate = [barWidth * i, 0];
            return 'translate(' + translate + ')';
        });
}