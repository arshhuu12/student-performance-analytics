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
            `translate(${width / 2}, ${height / 2})`
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
        .attr("fill", (d, i) =>
            d3.schemeTableau10[i]
        )
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
        })
        .on("end", function() {
            addPieInteractions(
                d3.select(this),
                data,
                section
            );
        });
}

function addPieInteractions(
    selection,
    data,
    section
) {

    selection
        .on("click", function(event, d) {

            const total = d3.sum(
                d3.selectAll(".performance-arc")
                    .data()
                    .map(item => item.data.count)
            );

            const percentage =
                total === 0
                    ? 0
                    : (d.data.count / total) * 100;

            alert(
                `${d.data.category}: ` +
                `${d.data.count} students\n` +
                `${percentage.toFixed(1)}%`
            );
        });
}