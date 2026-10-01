export async function loadStudentData() {

    const data = await d3.csv(
        "data/synthetic/students_10000.csv",
        row => ({
            ...row,

            year: +row.year,
            semester: +row.semester,
            age: +row.age,

            attendance_percentage: +row.attendance_percentage,
            assignment_average: +row.assignment_average,
            internal_marks: +row.internal_marks,
            midterm_marks: +row.midterm_marks,
            final_marks: +row.final_marks,
            previous_gpa: +row.previous_gpa,
            study_hours_per_week: +row.study_hours_per_week,
            engagement_score: +row.engagement_score
        })
    );

    return data;
}