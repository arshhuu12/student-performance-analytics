
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
    updateMarksForDepartment
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

    let currentStart = 0;

    createMarksBarChart(
        studentData.slice(0, 20)
    );


    // Change Dataset

    document
        .querySelector("#change-dataset")
        .addEventListener(
            "click",
            () => {

                currentStart += 20;

                if (
                    currentStart >=
                    studentData.length
                ) {
                    currentStart = 0;
                }

                const newDataset =
                    studentData.slice(
                        currentStart,
                        currentStart + 20
                    );

                changeMarksDataset(
                    newDataset
                );
            }
        );


    // Sort Ascending

    document
        .querySelector("#sort-ascending")
        .addEventListener(
            "click",
            () => {
                sortMarksAscending();
            }
        );


    // Sort Descending

    document
        .querySelector("#sort-descending")
        .addEventListener(
            "click",
            () => {
                sortMarksDescending();
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

