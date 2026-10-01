
import {
    loadStudentData,
    loadAttendanceData,
    loadSemesterData
} from "./data/loadData.js";

import {
    createMarksBarChart,
    changeMarksDataset,
    sortMarksAscending,
    sortMarksDescending,
    updateMarksForDepartment,
    getCurrentMarksData
} from "./charts/marksBarChart.js";

import {
    createAttendanceChart,
    updateAttendanceChart,
    setCurrentAttendanceMonth
} from "./charts/attendanceChart.js";

import {
    createScatterPlot,
    updateScatterPlot
} from "./charts/scatterPlot.js";

import {
    createSemesterLineChart,
    playSemesterAnimation,
    pauseSemesterAnimation,
    restartSemesterAnimation
} from "./charts/semesterLineChart.js";

import {
    createPerformancePieChart,
    updatePerformancePieChart
} from "./charts/performancePieChart.js";

import {
    initializeDashboardControls
} from "./dashboard.js";


async function initializeDashboard() {

    console.log("Loading datasets...");


    // ==================================================
    // LOAD DATA
    // ==================================================

    const studentData =
        await loadStudentData();

    console.log(
        "Students loaded:",
        studentData.length
    );


    const attendanceData =
        await loadAttendanceData();

    console.log(
        "Attendance records:",
        attendanceData.length
    );


    const semesterData =
        await loadSemesterData();

    console.log(
        "Semester records:",
        semesterData.length
    );


    // ==================================================
    // MONTH STATE
    // ==================================================

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    let currentMonthIndex = 0;


    function getMonthData(data = attendanceData) {

        const month =
            months[currentMonthIndex];

        return data
            .filter(
                d => d.month === month
            )
            .slice(0, 20);
    }


    // ==================================================
    // PERFORMANCE PIE CHART
    // ==================================================

    createPerformancePieChart(
        studentData
    );

    const sectionSelect =
        document.querySelector(
            "#section-select"
        );

    sectionSelect.addEventListener(
        "change",
        () => {

            const selectedSection =
                sectionSelect.value;

            updatePerformancePieChart(
                studentData,
                selectedSection
            );
        }
    );


    // ==================================================
    // MARKS BAR CHART
    // ==================================================

    const marksPageSize = 20;
    let currentStart = 0;
    let marksSourceData = studentData;

    createMarksBarChart(
        marksSourceData.slice(0, marksPageSize)
    );
    updateMarksStudentDetails();

    function updateMarksStudentDetails() {
        const displayedData = getCurrentMarksData();
        const total = marksSourceData.length;
        const start = total === 0 ? 0 : currentStart + 1;
        const end = Math.min(currentStart + displayedData.length, total);

        document.querySelector("#marks-dataset-status").textContent =
            `Showing students ${start}–${end} of ${total}`;

        document.querySelector("#marks-student-details tbody")
            .selectAll("tr")
            .data(displayedData, d => d.student_id)
            .join("tr")
            .html(d => `
                <td>${d.student_id}</td>
                <td>${d.student_name}</td>
                <td>${d.department}</td>
                <td>${d.section}</td>
                <td>${d.final_marks.toFixed(2)}</td>
            `);
    }


    // Change Dataset

    document
        .querySelector("#change-dataset")
        .addEventListener(
            "click",
            () => {

                currentStart += marksPageSize;

                if (
                    currentStart >=
                    marksSourceData.length
                ) {
                    currentStart = 0;
                }

                const newDataset =
                    marksSourceData.slice(
                        currentStart,
                        currentStart + marksPageSize
                    );

                changeMarksDataset(
                    newDataset
                );

                updateMarksStudentDetails();
            }
        );


    // Sort Ascending

    document
        .querySelector("#sort-ascending")
        .addEventListener(
            "click",
            () => {
                sortMarksAscending();
                updateMarksStudentDetails();
            }
        );


    // Sort Descending

    document
        .querySelector("#sort-descending")
        .addEventListener(
            "click",
            () => {
                sortMarksDescending();
                updateMarksStudentDetails();
            }
        );


    // ==================================================
    // ATTENDANCE CHART
    // ==================================================

    createAttendanceChart(
        getMonthData()
    );


    const monthLabel =
        document.querySelector(
            "#current-month"
        );


    function updateMonth() {

        const month =
            months[currentMonthIndex];

        monthLabel.textContent =
            month;

        setCurrentAttendanceMonth(
            month
        );

        updateAttendanceChart(
            getMonthData()
        );
    }


    // Previous Month

    document
        .querySelector("#previous-month")
        .addEventListener(
            "click",
            () => {

                currentMonthIndex--;

                if (
                    currentMonthIndex < 0
                ) {
                    currentMonthIndex =
                        months.length - 1;
                }

                updateMonth();
            }
        );


    // Next Month

    document
        .querySelector("#next-month")
        .addEventListener(
            "click",
            () => {

                currentMonthIndex++;

                if (
                    currentMonthIndex >=
                    months.length
                ) {
                    currentMonthIndex = 0;
                }

                updateMonth();
            }
        );


    // ==================================================
    // SCATTER PLOT
    // ==================================================

    createScatterPlot(
        studentData.slice(0, 200)
    );


    // ==================================================
    // SEMESTER LINE CHART
    // ==================================================

    createSemesterLineChart(
        semesterData
    );


    // Play

    document
        .querySelector("#play-semesters")
        .addEventListener(
            "click",
            () => {

                playSemesterAnimation(
                    semesterData
                );
            }
        );


    // Pause

    document
        .querySelector("#pause-semesters")
        .addEventListener(
            "click",
            () => {

                pauseSemesterAnimation();
            }
        );


    // Restart

    document
        .querySelector("#restart-semesters")
        .addEventListener(
            "click",
            () => {

                restartSemesterAnimation(
                    semesterData
                );
            }
        );


    // ==================================================
    // DEPARTMENT DASHBOARD FILTER
    // ==================================================

    initializeDashboardControls(
        studentData,
        (filteredData) => {

            // ------------------------------------------
            // MARKS
            // ------------------------------------------

            updateMarksForDepartment(
                filteredData
            );
            marksSourceData = filteredData;
            currentStart = 0;
            updateMarksStudentDetails();


            // ------------------------------------------
            // SCATTER
            // ------------------------------------------

            updateScatterPlot(
                filteredData.slice(0, 200)
            );


            // ------------------------------------------
            // ATTENDANCE
            // ------------------------------------------

            const studentIds =
                new Set(
                    filteredData.map(
                        d => d.student_id
                    )
                );


            const filteredAttendance =
                attendanceData.filter(
                    d =>
                        studentIds.has(
                            d.student_id
                        )
                );


            updateAttendanceChart(
                filteredAttendance
                    .filter(
                        d =>
                            d.month ===
                            months[currentMonthIndex]
                    )
                    .slice(0, 20)
            );


            // ------------------------------------------
            // PERFORMANCE PIE
            // ------------------------------------------

            const selectedSection =
                document.querySelector(
                    "#section-select"
                ).value;


            updatePerformancePieChart(
                filteredData,
                selectedSection
            );
        }
    );


    console.log(
        "Dashboard initialized!"
    );
}


// ======================================================
// START APPLICATION
// ======================================================

initializeDashboard();
