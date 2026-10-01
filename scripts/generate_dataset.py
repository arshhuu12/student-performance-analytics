"""
Synthetic Indian Higher-Education Student Dataset Generator

Generates realistic synthetic student academic data for:
- D3.js visualization
- Exploratory Data Analysis
- Machine Learning experiments

This dataset is completely synthetic and does not represent real students.
"""

import csv
import random
from pathlib import Path


# ============================================================
# CONFIGURATION
# ============================================================

NUM_STUDENTS = 10000
RANDOM_SEED = 42

random.seed(RANDOM_SEED)


# ============================================================
# DATA OPTIONS
# ============================================================

FIRST_NAMES = [
    "Aarav", "Aditi", "Aditya", "Akash", "Ananya",
    "Arjun", "Aryan", "Bhavya", "Diya", "Ishaan",
    "Isha", "Karan", "Kavya", "Krishna", "Manish",
    "Meera", "Nikhil", "Nisha", "Pooja", "Rahul",
    "Riya", "Rohan", "Sai", "Sanjay", "Shreya",
    "Sneha", "Surya", "Tanvi", "Varun", "Vikram",
    "Yash", "Zoya"
]

LAST_NAMES = [
    "Sharma", "Patel", "Reddy", "Iyer", "Nair",
    "Menon", "Kumar", "Singh", "Gupta", "Rao",
    "Verma", "Joshi", "Mehta", "Shah", "Das",
    "Mishra", "Pillai", "Krishnan", "Bose", "Chatterjee"
]

DEPARTMENTS = [
    "CSE",
    "AI & DS",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "IT"
]

PROGRAMS = [
    "B.Tech",
    "M.Tech"
]

SECTIONS = ["A", "B", "C", "D"]

# Approximate department distribution
DEPARTMENT_WEIGHTS = [
    0.24,   # CSE
    0.16,   # AI & DS
    0.16,   # ECE
    0.10,   # EEE
    0.12,   # Mechanical
    0.10,   # Civil
    0.12    # IT
]


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def clamp(value, minimum, maximum):
    """Keep a number inside a specified range."""
    return max(minimum, min(value, maximum))


def weighted_choice(items, weights):
    """Select an item according to specified probabilities."""
    return random.choices(items, weights=weights, k=1)[0]


def generate_name():
    """Generate a synthetic Indian-style student name."""
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"


def calculate_performance_category(final_marks, attendance):
    """
    Assign a performance category using final marks and attendance.
    """

    if final_marks >= 85 and attendance >= 80:
        return "Excellent"

    if final_marks >= 70 and attendance >= 75:
        return "Good"

    if final_marks >= 55 and attendance >= 65:
        return "Average"

    return "At Risk"


# ============================================================
# GENERATE ONE STUDENT
# ============================================================

def generate_student(student_number):
    """Generate one realistic synthetic student."""

    student_id = f"STU{student_number:06d}"

    department = weighted_choice(
        DEPARTMENTS,
        DEPARTMENT_WEIGHTS
    )

    program = random.choices(
        PROGRAMS,
        weights=[0.90, 0.10],
        k=1
    )[0]

    # Most students are in undergraduate years.
    if program == "B.Tech":
        year = random.randint(1, 4)
        semester = year * 2 - random.choice([0, 1])

        # Correct semester boundaries
        semester = clamp(semester, 1, 8)

        age = 17 + year + random.randint(0, 2)

    else:
        year = random.randint(1, 2)
        semester = year * 2 - random.choice([0, 1])
        semester = clamp(semester, 1, 4)
        age = 21 + year + random.randint(0, 3)

    section = random.choice(SECTIONS)

    # --------------------------------------------------------
    # LATENT STUDENT PROFILE
    # --------------------------------------------------------
    #
    # We create a hidden "academic tendency" so that variables
    # are related rather than completely random.
    #

    academic_ability = random.gauss(70, 10)
    academic_ability = clamp(academic_ability, 40, 95)

    discipline = random.gauss(70, 12)
    discipline = clamp(discipline, 30, 98)

    # --------------------------------------------------------
    # PREVIOUS GPA
    # --------------------------------------------------------

    previous_gpa = (
        5.5
        + academic_ability * 0.035
        + random.gauss(0, 0.45)
    )

    previous_gpa = clamp(previous_gpa, 4.0, 10.0)

    # --------------------------------------------------------
    # STUDY HOURS
    # --------------------------------------------------------

    study_hours = (
        5
        + discipline * 0.18
        + academic_ability * 0.05
        + random.gauss(0, 3)
    )

    study_hours = clamp(study_hours, 2, 40)

    # --------------------------------------------------------
    # ATTENDANCE
    # --------------------------------------------------------

    attendance = (
        45
        + discipline * 0.42
        + academic_ability * 0.08
        + random.gauss(0, 7)
    )

    attendance = clamp(attendance, 45, 100)

    # --------------------------------------------------------
    # ENGAGEMENT
    # --------------------------------------------------------

    engagement = (
        25
        + discipline * 0.40
        + academic_ability * 0.18
        + attendance * 0.12
        + random.gauss(0, 6)
    )

    engagement = clamp(engagement, 20, 100)

    # --------------------------------------------------------
    # ASSIGNMENTS
    # --------------------------------------------------------

    assignment_average = (
        20
        + academic_ability * 0.48
        + study_hours * 0.55
        + engagement * 0.10
        + random.gauss(0, 5)
    )

    assignment_average = clamp(assignment_average, 20, 100)

    # --------------------------------------------------------
    # INTERNAL MARKS / 50
    # --------------------------------------------------------

    internal_marks = (
        5
        + academic_ability * 0.22
        + assignment_average * 0.12
        + attendance * 0.06
        + random.gauss(0, 3)
    )

    internal_marks = clamp(internal_marks, 10, 50)

    # --------------------------------------------------------
    # MIDTERM / 100
    # --------------------------------------------------------

    midterm_marks = (
        10
        + academic_ability * 0.55
        + study_hours * 0.45
        + engagement * 0.08
        + random.gauss(0, 6)
    )

    midterm_marks = clamp(midterm_marks, 20, 100)

    # --------------------------------------------------------
    # FINAL MARKS / 100
    # --------------------------------------------------------

    final_marks = (
        8
        + academic_ability * 0.45
        + study_hours * 0.35
        + assignment_average * 0.12
        + attendance * 0.08
        + midterm_marks * 0.18
        + random.gauss(0, 7)
    )

    final_marks = clamp(final_marks, 20, 100)

    performance_category = calculate_performance_category(
        final_marks,
        attendance
    )

    return {
        "student_id": student_id,
        "student_name": generate_name(),
        "department": department,
        "program": program,
        "year": year,
        "semester": semester,
        "section": section,
        "age": age,
        "attendance_percentage": round(attendance, 2),
        "assignment_average": round(assignment_average, 2),
        "internal_marks": round(internal_marks, 2),
        "midterm_marks": round(midterm_marks, 2),
        "final_marks": round(final_marks, 2),
        "previous_gpa": round(previous_gpa, 2),
        "study_hours_per_week": round(study_hours, 2),
        "engagement_score": round(engagement, 2),
        "performance_category": performance_category,
    }


# ============================================================
# SAVE CSV
# ============================================================

def save_to_csv(students, output_path):
    """Save generated students to CSV."""

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    fieldnames = list(students[0].keys())

    with open(
        output_path,
        "w",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )

        writer.writeheader()
        writer.writerows(students)


# ============================================================
# MAIN PROGRAM
# ============================================================

def main():

    print("=" * 60)
    print("STUDENT PERFORMANCE DATASET GENERATOR")
    print("=" * 60)

    print(f"Generating {NUM_STUDENTS:,} students...")

    students = []

    for i in range(1, NUM_STUDENTS + 1):
        student = generate_student(i)
        students.append(student)

    output_path = (
        Path(__file__).parent.parent
        / "data"
        / "synthetic"
        / "students_10000.csv"
    )

    save_to_csv(
        students,
        output_path
    )

    print()
    print("Dataset generated successfully!")
    print(f"Rows: {len(students):,}")
    print(f"Columns: {len(students[0])}")
    print(f"File: {output_path}")

    print()
    print("First student:")
    print(students[0])

    print()
    print("Last student:")
    print(students[-1])


if __name__ == "__main__":
    main()