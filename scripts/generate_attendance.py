import csv
import random
from pathlib import Path


# ------------------------------------------------------------
# Configuration
# ------------------------------------------------------------

NUM_STUDENTS = 10000
RANDOM_SEED = 42

MONTHS = [
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
    "December",
]


random.seed(RANDOM_SEED)


# ------------------------------------------------------------
# Project paths
# ------------------------------------------------------------

PROJECT_ROOT = Path(__file__).parent.parent

STUDENT_FILE = (
    PROJECT_ROOT
    / "data"
    / "synthetic"
    / "students_10000.csv"
)

OUTPUT_FILE = (
    PROJECT_ROOT
    / "data"
    / "synthetic"
    / "attendance_monthly.csv"
)


# ------------------------------------------------------------
# Read student data
# ------------------------------------------------------------

students = []

with open(
    STUDENT_FILE,
    "r",
    encoding="utf-8",
    newline=""
) as file:

    reader = csv.DictReader(file)

    for row in reader:
        students.append(row)


# ------------------------------------------------------------
# Generate monthly attendance
# ------------------------------------------------------------

records = []

for student in students:

    student_id = student["student_id"]

    base_attendance = float(
        student["attendance_percentage"]
    )

    for month in MONTHS:

        # Small monthly variation
        variation = random.gauss(0, 4)

        attendance = base_attendance + variation

        # Keep attendance between 40 and 100
        attendance = max(
            40,
            min(100, attendance)
        )

        records.append({
            "student_id": student_id,
            "month": month,
            "attendance_percentage": round(
                attendance,
                2
            )
        })


# ------------------------------------------------------------
# Save dataset
# ------------------------------------------------------------

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8",
    newline=""
) as file:

    fieldnames = [
        "student_id",
        "month",
        "attendance_percentage"
    ]

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()

    writer.writerows(records)


# ------------------------------------------------------------
# Result
# ------------------------------------------------------------

print("=" * 60)
print("MONTHLY ATTENDANCE DATASET")
print("=" * 60)

print(f"Students: {len(students):,}")
print(f"Months per student: {len(MONTHS)}")
print(f"Records: {len(records):,}")

print(f"File: {OUTPUT_FILE}")

print("\nFirst record:")
print(records[0])

print("\nLast record:")
print(records[-1])

print("\nDataset generated successfully!")