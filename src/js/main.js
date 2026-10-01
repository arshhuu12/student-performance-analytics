import {
    createPerformancePieChart,
    updatePerformancePieChart
} from "./charts/performancePieChart.js";

import {
    loadSemesterData
} from "./data/loadData.js";

import {
    createSemesterLineChart,
    playSemesterAnimation,
    pauseSemesterAnimation,
    restartSemesterAnimation
} from "./charts/semesterLineChart.js";

import {
    createScatterPlot
} from "./charts/scatterPlot.js";

import {
    loadStudentData,
    loadAttendanceData
} from "./data/loadData.js";


import {
    createMarksBarChart,
    changeMarksDataset,
    sortMarksAscending,
    sortMarksDescending
} from "./charts/marksBarChart.js";


import {
    createAttendanceChart,
    updateAttendanceChart
} from "./charts/attendanceChart.js";


async function initializeDashboard() {

    console.log("Loading datasets...");


    // ------------------------------------------------
    // STUDENT DATA
    // ------------------------------------------------

    const studentData =
        await loadStudentData();




    console.log(
        "Students loaded:",
        studentData.length
    );

    createPerformancePieChart(studentData);

    const sectionSelect =
        document.querySelector("#section-select");

    sectionSelect.addEventListener("change", () => {

        const selectedSection =
            sectionSelect.value;

        updatePerformancePieChart(
            studentData,
            selectedSection
        );
    });

    let currentStart = 0;


    createMarksBarChart(
        studentData.slice(0, 20)
    );

    

    createScatterPlot(
    studentData.slice(0, 200)
    );   

    const semesterData =
    await loadSemesterData();

    createSemesterLineChart(
        semesterData
    );

    document
        .querySelector("#play-semesters")
        .addEventListener("click", () => {
            playSemesterAnimation(semesterData);
        });

    document
        .querySelector("#pause-semesters")
        .addEventListener("click", () => {
            pauseSemesterAnimation();
        });

    document
        .querySelector("#restart-semesters")
        .addEventListener("click", () => {
            restartSemesterAnimation(semesterData);
        });


    const datasetButton =
        document.querySelector(
            "#change-dataset"
        );


    datasetButton.addEventListener(
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

            document
                .querySelector("#sort-ascending")
                .addEventListener("click", () => {
                    sortMarksAscending();
                });

            document
                .querySelector("#sort-descending")
                .addEventListener("click", () => {
                    sortMarksDescending();
                });
        }
    );


    // ------------------------------------------------
    // ATTENDANCE DATA
    // ------------------------------------------------

    const attendanceData =
        await loadAttendanceData();


    console.log(
        "Attendance records:",
        attendanceData.length
    );


    // ------------------------------------------------
    // MONTH STATE
    // ------------------------------------------------

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


    function getMonthData() {

        const month =
            months[currentMonthIndex];


        return attendanceData
            .filter(
                d => d.month === month
            )
            .slice(0, 20);
    }


    // ------------------------------------------------
    // CREATE ATTENDANCE CHART
    // ------------------------------------------------

    createAttendanceChart(
        getMonthData()
    );


    // ------------------------------------------------
    // UPDATE MONTH LABEL
    // ------------------------------------------------

    const monthLabel =
        document.querySelector(
            "#current-month"
        );


    function updateMonth() {

        const month =
            months[currentMonthIndex];


        monthLabel.textContent =
            month;


        updateAttendanceChart(
            getMonthData()
        );
    }


    // ------------------------------------------------
    // PREVIOUS MONTH
    // ------------------------------------------------

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


    // ------------------------------------------------
    // NEXT MONTH
    // ------------------------------------------------

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


    console.log(
        "Dashboard initialized!"
    );
}


initializeDashboard();