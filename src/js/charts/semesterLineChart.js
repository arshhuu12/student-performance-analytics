let svg;
let chart;
let linePath;
let points;

let animationTimer = null;
let currentStep = 1;

let x;
let y;

let innerWidth;
let innerHeight;

const width = 1000;
const height = 500;

const margin = {
    top: 40,
    right: 40,
    bottom: 70,
    left: 70
};

export function createSemesterLineChart(data) {

    innerWidth = width - margin.left - margin.right;
    innerHeight = height - margin.top - margin.bottom;

    svg = d3
        .select("#semester-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    chart = svg
        .append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );

    x = d3.scaleLinear()
        .domain([1, 5])
        .range([0, innerWidth]);

    y = d3.scaleLinear()
        .domain([0, 100])
        .range([innerHeight, 0]);

    chart
        .append("g")
        .attr("class", "semester-x-axis")
        .attr(
            "transform",
            `translate(0, ${innerHeight})`
        )
        .call(
            d3.axisBottom(x)
                .ticks(5)
                .tickFormat(d => `Semester ${d}`)
        );

    chart
        .append("g")
        .attr("class", "semester-y-axis")
        .call(d3.axisLeft(y));

    chart
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 55)
        .attr("text-anchor", "middle")
        .text("Semester");

    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Average Marks");

    const line = d3.line()
        .x(d => x(d.semester))
        .y(d => y(d.average_marks));

    linePath = chart
        .append("path")
        .datum(data)
        .attr("class", "semester-line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", line);

    points = chart
        .selectAll(".semester-point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "semester-point")
        .attr("cx", d => x(d.semester))
        .attr("cy", d => y(d.average_marks))
        .attr("r", 6)
        .style("opacity", 0);

    resetAnimation(data);
}

function showStep(data, step) {

    const visibleData = data.slice(0, step);

    const line = d3.line()
        .x(d => x(d.semester))
        .y(d => y(d.average_marks));

    linePath
        .datum(visibleData)
        .attr("d", line);

    points
        .style("opacity", (d, i) => {
            return i < step ? 1 : 0;
        });
}

function resetAnimation(data) {

    stopAnimation();

    currentStep = 1;

    showStep(data, 1);
}

export function playSemesterAnimation(data) {

    stopAnimation();

    if (currentStep >= data.length) {
        currentStep = 1;
        showStep(data, currentStep);
    }

    animationTimer = setInterval(() => {

        showStep(data, currentStep);

        currentStep++;

        if (currentStep > data.length) {
            stopAnimation();
        }

    }, 1000);
}

export function pauseSemesterAnimation() {
    stopAnimation();
}

export function restartSemesterAnimation(data) {

    stopAnimation();

    currentStep = 1;

    showStep(data, currentStep);

    playSemesterAnimation(data);
}

function stopAnimation() {

    if (animationTimer !== null) {

        clearInterval(animationTimer);

        animationTimer = null;
    }
}