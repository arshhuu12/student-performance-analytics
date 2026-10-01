let svg;
let chart;
let pieGroup;

const width = 700;
const height = 500;

const radius = Math.min(width, height) / 2 - 60;

const categories = [
    "Excellent",
    "Good",
    "Average",
    "At Risk"
];

const categoryColors = {
    Excellent: "#4e79a7",
    Good: "#f28e2b",
    Average: "#e15759",
    "At Risk": "#76b7b2"
};

export function createPerformancePieChart(data) {

    svg = d3
        .select("#performance-pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    pieGroup = svg
        .append("g")
        .attr(
            "transform",
            `translate(260, ${height / 2})`
        );

    updatePerformancePieChart(data, "A");
}

export function updatePerformancePieChart(data, section) {

    const sectionData = data.filter(
        d => d.section === section
    );

    const counts = categories.map(category => ({
        category: category,
        count: sectionData.filter(
            d => d.performance_category === category
        ).length
    }));

    const total = d3.sum(counts, d => d.count);

    const pie = d3
        .pie()
        .value(d => d.count)
        .sort(null);

    const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius);

    const arcs = pieGroup
        .selectAll(".performance-arc")
        .data(
            pie(counts),
            d => d.data.category
        );

    arcs
        .exit()
        .transition()
        .duration(500)
        .attrTween("d", function(d) {
            const interpolate = d3.interpolate(
                d,
                {
                    startAngle: d.endAngle,
                    endAngle: d.endAngle
                }
            );

            return function(t) {
                return arc(interpolate(t));
            };
        })
        .remove();

    const newArcs = arcs
        .enter()
        .append("path")
        .attr("class", "performance-arc")
        .attr("fill", d => categoryColors[d.data.category])
        .each(function(d) {
            this._current = {
                startAngle: d.startAngle,
                endAngle: d.startAngle
            };
        });

    newArcs
        .merge(arcs)
        .transition()
        .duration(800)
        .attrTween("d", function(d) {

            const previous = this._current || d;

            const interpolate = d3.interpolate(
                previous,
                d
            );

            this._current = d;

            return function(t) {
                return arc(interpolate(t));
            };
        });

    pieGroup
        .selectAll(".performance-arc")
        .on("mouseenter", function(event, d) {
            showChartTooltip(event, d, total);
            d3.select(this).attr("opacity", 0.8);
        })
        .on("mousemove", moveChartTooltip)
        .on("mouseleave", function() {
            hideChartTooltip();
            d3.select(this).attr("opacity", 1);
        });

    updateSliceLabels(pie(counts), total);
    updateLegend(counts, total);
}

function updateSliceLabels(pieData, total) {
    const labelArc = d3.arc()
        .innerRadius(radius * 0.62)
        .outerRadius(radius * 0.62);

    pieGroup
        .selectAll(".performance-label")
        .data(pieData, d => d.data.category)
        .join("text")
        .attr("class", "performance-label")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .style("pointer-events", "none")
        .text(d => {
            const percentage = total === 0 ? 0 : (d.data.count / total) * 100;
            return percentage >= 8 ? `${percentage.toFixed(1)}%` : "";
        });
}

function updateLegend(counts, total) {
    const legend = svg
        .selectAll(".performance-legend")
        .data([null])
        .join("g")
        .attr("class", "performance-legend")
        .attr("transform", "translate(460, 115)");

    const rows = legend
        .selectAll(".performance-legend-row")
        .data(counts, d => d.category)
        .join("g")
        .attr("class", "performance-legend-row")
        .attr("transform", (d, i) => `translate(0, ${i * 42})`);

    rows
        .selectAll("rect")
        .data(d => [d])
        .join("rect")
        .attr("width", 16)
        .attr("height", 16)
        .attr("rx", 2)
        .attr("fill", d => categoryColors[d.category]);

    rows
        .selectAll("text")
        .data(d => [d])
        .join("text")
        .attr("x", 25)
        .attr("y", 13)
        .attr("font-size", "14px")
        .text(d => {
            const percentage = total === 0 ? 0 : (d.count / total) * 100;
            return `${d.category}: ${d.count} (${percentage.toFixed(1)}%)`;
        });
}

function showChartTooltip(event, d, total) {
    const percentage = total === 0 ? 0 : (d.data.count / total) * 100;

    d3.select("#chart-tooltip")
        .style("display", "block")
        .html(`<strong>${d.data.category}</strong><br>${d.data.count} students (${percentage.toFixed(1)}%)`);

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

export function updatePerformancePieChartData(
    data,
    section
) {
    updatePerformancePieChart(
        data,
        section
    );
}
