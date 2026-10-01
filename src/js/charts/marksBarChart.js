let currentData = [];

export function createMarksBarChart(data) {

    currentData = data;

    const container = d3.select("#marks-chart");

    const width = 1000;
    const height = 500;

    const margin = {
        top: 40,
        right: 30,
        bottom: 80,
        left: 60
    };

    const innerWidth =
        width - margin.left - margin.right;

    const innerHeight =
        height - margin.top - margin.bottom;


    const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    const chart = svg
        .append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );


    const x = d3.scaleBand()
        .range([0, innerWidth])
        .padding(0.15);


    const y = d3.scaleLinear()
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
        .text("Final Marks");


    updateChart(data);
}


function updateChart(data) {

    const svg = d3.select("#marks-chart svg");

    const chart = svg.select("g");

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const margin = {
        top: 40,
        right: 30,
        bottom: 80,
        left: 60
    };

    const innerWidth =
        width - margin.left - margin.right;

    const innerHeight =
        height - margin.top - margin.bottom;


    const x = d3.scaleBand()
        .domain(data.map(d => d.student_id))
        .range([0, innerWidth])
        .padding(0.15);


    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([innerHeight, 0]);


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
        .selectAll(".bar")
        .data(data, d => d.student_id);


    // Remove old bars
    bars
        .exit()
        .transition()
        .duration(500)
        .attr("height", 0)
        .attr("y", innerHeight)
        .remove();


    // Add new bars
    bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.student_id))
        .attr("width", x.bandwidth())
        .attr("y", innerHeight)
        .attr("height", 0)

        .merge(bars)

        .transition()
        .duration(1000)

        .attr("x", d => x(d.student_id))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.final_marks))
        .attr(
            "height",
            d => innerHeight - y(d.final_marks)
        );
}


export function changeMarksDataset(data) {

    currentData = data;

    updateChart(data);
}

export function sortMarksAscending() {
    const sortedData = [...currentData].sort(
        (a, b) => a.final_marks - b.final_marks
    );

    updateChart(sortedData);
}

export function sortMarksDescending() {
    const sortedData = [...currentData].sort(
        (a, b) => b.final_marks - a.final_marks
    );

    updateChart(sortedData);
}