export function initializeDashboardControls(
    studentData,
    updateCharts
) {

    const departmentSelect =
        document.querySelector("#department-select");

    const totalStudents =
        document.querySelector("#total-students");

    const averageMarks =
        document.querySelector("#average-marks");

    const averageAttendance =
        document.querySelector("#average-attendance");


    function updateSummary(data) {

        const total = data.length;

        const marksAverage =
            d3.mean(
                data,
                d => d.final_marks
            );

        const attendanceAverage =
            d3.mean(
                data,
                d => d.attendance_percentage
            );

        totalStudents.textContent =
            total;

        averageMarks.textContent =
            marksAverage !== undefined
                ? marksAverage.toFixed(2)
                : "0";

        averageAttendance.textContent =
            attendanceAverage !== undefined
                ? attendanceAverage.toFixed(2) + "%"
                : "0%";
    }


    function filterData() {

        const department =
            departmentSelect.value;

        let filteredData;

        if (department === "ALL") {

            filteredData = studentData;

        } else {

            filteredData =
                studentData.filter(
                    d => d.department === department
                );
        }

        updateSummary(filteredData);

        updateCharts(filteredData);
    }


    departmentSelect.addEventListener(
        "change",
        filterData
    );


    updateSummary(studentData);
}