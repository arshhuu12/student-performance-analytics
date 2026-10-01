let svg;
let chart;

let x;
let y;

let innerWidth;
let innerHeight;

const width = 1000;
const height = 600;

const margin = {
    top: 40,
    right: 40,
    bottom: 70,
    left: 70
};


export function createScatterPlot(data) {

    innerWidth =
        width - margin.left - margin.right;

    innerHeight =
        height - margin.top - margin.bottom;


    // ------------------------------------------------
    // SVG
    // ------------------------------------------------

    svg = d3
        .select("#scatter-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    chart = svg
        .append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );


    // ------------------------------------------------
    // SCALES
    // ------------------------------------------------

    x = d3.scaleLinear()
        .domain([40, 100])
        .range([0, innerWidth]);


    y = d3.scaleLinear()
        .domain([0, 50])
        .range([innerHeight, 0]);


    // ------------------------------------------------
    // X AXIS
    // ------------------------------------------------

    chart
        .append("g")
        .attr(
            "class",
            "scatter-x-axis"
        )
        .attr(
            "transform",
            `translate(0, ${innerHeight})`
        )
        .call(
            d3.axisBottom(x)
        );


    // ------------------------------------------------
    // Y AXIS
    // ------------------------------------------------

    chart
        .append("g")
        .attr(
            "class",
            "scatter-y-axis"
        )
        .call(
            d3.axisLeft(y)
        );


    // ------------------------------------------------
    // X LABEL
    // ------------------------------------------------

    chart
        .append("text")
        .attr(
            "x",
            innerWidth / 2
        )
        .attr(
            "y",
            innerHeight + 55
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text("Attendance (%)");


    // ------------------------------------------------
    // Y LABEL
    // ------------------------------------------------

    chart
        .append("text")
        .attr(
            "transform",
            "rotate(-90)"
        )
        .attr(
            "x",
            -innerHeight / 2
        )
        .attr(
            "y",
            -50
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text("Internal Marks");


    // ------------------------------------------------
    // POINTS
    // ------------------------------------------------

    chart
        .selectAll(".scatter-point")
        .data(data, d => d.student_id)
        .enter()
        .append("circle")
        .attr(
            "class",
            "scatter-point"
        )
        .attr(
            "cx",
            d => x(d.attendance_percentage)
        )
        .attr(
            "cy",
            d => y(d.internal_marks)
        )
        .attr(
            "r",
            5
        )
        .on(
            "mouseover",
            function(event, d) {

                showTooltip(event, d);

                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("r", 9);
            }
        )
        .on(
            "mousemove",
            function(event) {

                moveTooltip(event);
            }
        )
        .on(
            "mouseout",
            function() {

                hideTooltip();

                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("r", 5);
            }
        )
        .on(
            "click",
            function(event, d) {

                selectStudent(this, d);
            }
        )
        .transition()
        .duration(1000)
        .attr(
            "r",
            5
        );


    // ------------------------------------------------
    // RESET BUTTON
    // ------------------------------------------------

    document
        .querySelector("#reset-scatter")
        .addEventListener(
            "click",
            resetSelection
        );
}


// ====================================================
// TOOLTIP
// ====================================================

function showTooltip(event, d) {

    const tooltip =
        d3.select("#scatter-tooltip");


    tooltip
        .style("display", "block")
        .html(`
            <strong>${d.student_name}</strong><br>
            ID: ${d.student_id}<br>
            Attendance: ${d.attendance_percentage}%<br>
            Internal Marks: ${d.internal_marks}
        `);


    moveTooltip(event);
}


function moveTooltip(event) {

    d3.select("#scatter-tooltip")
        .style(
            "left",
            `${event.pageX + 15}px`
        )
        .style(
            "top",
            `${event.pageY - 30}px`
        );
}


function hideTooltip() {

    d3.select("#scatter-tooltip")
        .style(
            "display",
            "none"
        );
}


// ====================================================
// SELECT STUDENT
// ====================================================

function selectStudent(element, d) {

    d3.selectAll(".scatter-point")
        .classed(
            "selected",
            false
        );


    d3.select(element)
        .classed(
            "selected",
            true
        );


    console.log(
        "Selected student:",
        d
    );
}


// ====================================================
// RESET
// ====================================================

function resetSelection() {

    d3.selectAll(".scatter-point")
        .classed(
            "selected",
            false
        );

    console.log(
        "Scatter selection reset"
    );
}

export function updateScatterPlot(data) {

    const points = chart
        .selectAll(".scatter-point")
        .data(data, d => d.student_id);

    points.exit()
        .transition()
        .duration(500)
        .attr("r", 0)
        .remove();

    points.enter()
        .append("circle")
        .attr("class", "scatter-point")
        .attr("cx", d => x(d.attendance_percentage))
        .attr("cy", d => y(d.internal_marks))
        .attr("r", 0)
        .on("mouseover", function(event, d) {
            showTooltip(event, d);

            d3.select(this)
                .transition()
                .duration(150)
                .attr("r", 9);
        })
        .on("mousemove", function(event) {
            moveTooltip(event);
        })
        .on("mouseout", function() {
            hideTooltip();

            d3.select(this)
                .transition()
                .duration(150)
                .attr("r", 5);
        })
        .on("click", function(event, d) {
            selectStudent(this, d);
        })
        .transition()
        .duration(700)
        .attr("r", 5);

    points
        .transition()
        .duration(700)
        .attr("cx", d => x(d.attendance_percentage))
        .attr("cy", d => y(d.internal_marks))
        .attr("r", 5);
}