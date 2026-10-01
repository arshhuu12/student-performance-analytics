import pandas as pd
from pathlib import Path


# ------------------------------------------------------------
# Load dataset
# ------------------------------------------------------------

project_root = Path(__file__).parent.parent

dataset_path = (
    project_root
    / "data"
    / "synthetic"
    / "students_10000.csv"
)

df = pd.read_csv(dataset_path)


# ------------------------------------------------------------
# Basic information
# ------------------------------------------------------------

print("=" * 60)
print("DATASET VALIDATION")
print("=" * 60)

print(f"Rows: {df.shape[0]:,}")
print(f"Columns: {df.shape[1]}")


# ------------------------------------------------------------
# Column names
# ------------------------------------------------------------

print("\nColumns:")
for column in df.columns:
    print(f" - {column}")


# ------------------------------------------------------------
# Missing values
# ------------------------------------------------------------

print("\nMissing values:")

missing_values = df.isnull().sum()

print(missing_values)


# ------------------------------------------------------------
# Duplicate student IDs
# ------------------------------------------------------------

duplicate_ids = df["student_id"].duplicated().sum()

print("\nDuplicate student IDs:")
print(duplicate_ids)


# ------------------------------------------------------------
# Numeric statistics
# ------------------------------------------------------------

print("\nNumeric summary:")

print(
    df[
        [
            "attendance_percentage",
            "assignment_average",
            "internal_marks",
            "midterm_marks",
            "final_marks",
            "previous_gpa",
            "study_hours_per_week",
            "engagement_score",
        ]
    ].describe()
)


# ------------------------------------------------------------
# Department distribution
# ------------------------------------------------------------

print("\nStudents by department:")

print(
    df["department"]
    .value_counts()
)


# ------------------------------------------------------------
# Performance distribution
# ------------------------------------------------------------

print("\nPerformance categories:")

print(
    df["performance_category"]
    .value_counts()
)


# ------------------------------------------------------------
# Range checks
# ------------------------------------------------------------

print("\nRange checks:")

print(
    "Attendance:",
    df["attendance_percentage"].min(),
    "to",
    df["attendance_percentage"].max()
)

print(
    "Final marks:",
    df["final_marks"].min(),
    "to",
    df["final_marks"].max()
)

print(
    "Previous GPA:",
    df["previous_gpa"].min(),
    "to",
    df["previous_gpa"].max()
)

print("\nValidation complete.")
