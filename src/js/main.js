import { loadStudentData } from "./data/loadData.js";

import {
    createMarksBarChart,
    changeMarksDataset
} from "./charts/marksBarChart.js";


async function initializeDashboard() {

    console.log("Loading student dataset...");

    const data = await loadStudentData();

    console.log("Students loaded:", data.length);


    let currentStart = 0;

    const firstDataset = data.slice(0, 20);

    createMarksBarChart(firstDataset);


    const button = document.querySelector("#change-dataset");


    button.addEventListener("click", () => {

        currentStart += 20;

        if (currentStart >= data.length) {
            currentStart = 0;
        }

        const newDataset =
            data.slice(currentStart, currentStart + 20);

        changeMarksDataset(newDataset);

    });

}


initializeDashboard();