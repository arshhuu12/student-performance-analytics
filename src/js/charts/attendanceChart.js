let svg;
let chart;
let x;
let y;

let innerWidth;
let innerHeight;

const width = 1000;
const height = 500;

const margin = {
    top: 40,
    right: 30,
    bottom: 80,
    left: 60
};


export function createAttendanceChart(data) {

    innerWidth = width - margin.left - margin.right;
    innerHeight = height - margin.top - margin.bottom;

    svg = d3
        .select("#attendance-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    chart = svg
        .append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );

    x = d3.scaleBand()
        .range([0, innerWidth])
        .padding(0.15);

    y = d3.scaleLinear()
        .domain([0, 100])
        .range([innerHeight, 0]);

    chart
        .append("g")
        .attr("class", "x-axis")
        .attr(
            "transform",
            `translate(0, ${innerHeight})`
        );

    chart
        .append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .text("Attendance (%)");

    updateAttendanceChart(data);
}


export function updateAttendanceChart(data) {

    x.domain(
        data.map(d => d.student_id)
    );

    chart
        .select(".x-axis")
        .transition()
        .duration(700)
        .call(
            d3.axisBottom(x)
                .tickFormat((d, i) => `S${i + 1}`)
        )
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");


    const bars = chart
        .selectAll(".attendance-bar")
        .data(
            data,
            d => d.student_id
        );


    bars
        .exit()
        .transition()
        .duration(500)
        .attr("y", innerHeight)
        .attr("height", 0)
        .remove();


    bars
        .enter()
        .append("rect")
        .attr("class", "attendance-bar")
        .attr("x", d => x(d.student_id))
        .attr("width", x.bandwidth())
        .attr("y", innerHeight)
        .attr("height", 0)

        .merge(bars)

        .on("mouseenter", function(event, d) {
            showChartTooltip(event, d);
            d3.select(this).style("fill", "#374151");
        })
        .on("mousemove", moveChartTooltip)
        .on("mouseleave", function() {
            hideChartTooltip();
            d3.select(this).style("fill", null);
        })

        .transition()
        .duration(700)

        .attr("x", d => x(d.student_id))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.attendance_percentage))
        .attr(
            "height",
            d =>
                innerHeight -
                y(d.attendance_percentage)
        );
}

export function filterAttendanceByStudents(
    attendanceData,
    studentData
    ) {
    const studentIds = new Set(
        studentData.map(d => d.student_id)
    );

    const filteredAttendance =
        attendanceData.filter(d =>
            studentIds.has(d.student_id)
        );

    updateAttendanceChart(
        filteredAttendance
            .filter(d => d.month === getCurrentMonth())
            .slice(0, 20)
    );
}

let currentMonth = "January";

export function setCurrentAttendanceMonth(
    month
    ) {
    currentMonth = month;
}

function getCurrentMonth() {
    return currentMonth;
}

function showChartTooltip(event, d) {
    d3.select("#chart-tooltip")
        .style("display", "block")
        .html(`
            <strong>${d.student_id}</strong><br>
            Month: ${d.month}<br>
            Attendance: ${d.attendance_percentage.toFixed(2)}%
        `);

    moveChartTooltip(event);
}

function moveChartTooltip(event) {
    d3.select("#chart-tooltip")
        .style("left", `${event.pageX + 14}px`)
        .style("top", `${event.pageY - 24}px`);
}

function hideChartTooltip() {
    d3.select("#chart-tooltip").style("display", "none");
}
