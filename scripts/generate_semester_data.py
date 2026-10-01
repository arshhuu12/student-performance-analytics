import csv
import random
from pathlib import Path


RANDOM_SEED = 42

random.seed(RANDOM_SEED)


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
    / "semester_performance.csv"
)


# ------------------------------------------------------------
# Read current student data
# ------------------------------------------------------------

final_marks = []

with open(
    STUDENT_FILE,
    "r",
    encoding="utf-8",
    newline=""
) as file:

    reader = csv.DictReader(file)

    for row in reader:
        final_marks.append(
            float(row["final_marks"])
        )


# ------------------------------------------------------------
# Calculate current class average
# ------------------------------------------------------------

current_average = sum(final_marks) / len(final_marks)


# ------------------------------------------------------------
# Generate five semester averages
# ------------------------------------------------------------

records = []

for semester in range(1, 6):

    # Earlier semesters slightly lower,
    # later semesters slightly higher.
    growth = (semester - 5) * 1.8

    noise = random.gauss(0, 0.7)

    average_marks = current_average + growth + noise

    average_marks = max(
        0,
        min(100, average_marks)
    )

    records.append({
        "semester": semester,
        "average_marks": round(
            average_marks,
            2
        )
    })


# ------------------------------------------------------------
# Save
# ------------------------------------------------------------

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8",
    newline=""
) as file:

    fieldnames = [
        "semester",
        "average_marks"
    ]

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()

    writer.writerows(records)


print("=" * 60)
print("SEMESTER PERFORMANCE DATASET")
print("=" * 60)

print(f"Semesters: {len(records)}")
print(f"Current class average: {current_average:.2f}")

print(f"File: {OUTPUT_FILE}")

print("\nGenerated data:")

for record in records:
    print(record)

print("\nDataset generated successfully!")