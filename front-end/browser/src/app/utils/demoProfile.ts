export interface DemoProfile {
  major: string;
  concentration: string;
  advisor: string;
  current_semester: string;
  gpa: number;
  standing: string;
  units_completed: number;
  units_required: number;
  catalog_year: string;
  // progress breakdown
  totalCompleted: number;
  totalRequired: number;
  percent: number;
  geCompleted: number;
  geRequired: number;
  coreCompleted: number;
  coreRequired: number;
  upperCompleted: number;
  upperRequired: number;
}

const MAJORS = [
  "Computer Science",
  "Computer Science",
  "Software Engineering",
  "Computer Science",
  "Computer Engineering",
];
const CONCENTRATIONS = [
  "Software Engineering",
  "Cybersecurity",
  "Artificial Intelligence",
  "Data Science",
  "Systems",
  "Networking",
];
const ADVISORS = [
  "Dr. Smith, J.",
  "Dr. Chen, L.",
  "Dr. Johnson, R.",
  "Dr. Williams, M.",
  "Dr. Garcia, P.",
  "Dr. Kim, S.",
];
const SEMESTERS = ["Spring 2025", "Fall 2025", "Spring 2026", "Fall 2024"];
const STANDINGS = ["Freshman", "Sophomore", "Junior", "Senior"];
const CATALOG_YEARS = ["2022-23", "2023-24", "2024-25", "2025-26"];

/** Deterministic integer hash — stable across refreshes, no randomness. */
function h(n: number): number {
  let x = ((n >>> 16) ^ n) * 0x45d9f3b;
  x = ((x >>> 16) ^ x) * 0x45d9f3b;
  x = (x >>> 16) ^ x;
  return Math.abs(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

/** Generate a realistic-looking demo profile from a student_id.
 *  The same student_id always produces the same values. */
export function demoProfile(student_id: number): DemoProfile {
  const seed = h(student_id);
  const units_completed = 12 + (seed % 100);
  const units_required = 120;
  const rawGpa = 2.5 + ((seed % 20) / 10);
  const standingIdx = Math.min(Math.floor(units_completed / 30), 3);

  // Progress breakdown (deterministic from units_completed)
  const geRequired = 48;
  const coreRequired = 24;
  const upperRequired = 48;
  const geCompleted = Math.min(geRequired, Math.floor(units_completed * 0.4));
  const coreCompleted = Math.min(coreRequired, Math.floor(units_completed * 0.2));
  const upperCompleted = Math.min(upperRequired, Math.max(0, units_completed - geCompleted - coreCompleted));
  const totalCompleted = geCompleted + coreCompleted + upperCompleted;
  const percent = Math.round((totalCompleted / units_required) * 100);

  return {
    major: pick(MAJORS, seed),
    concentration: pick(CONCENTRATIONS, seed >>> 4),
    advisor: pick(ADVISORS, seed >>> 8),
    current_semester: pick(SEMESTERS, seed >>> 12),
    gpa: Math.round(rawGpa * 100) / 100,
    standing: STANDINGS[standingIdx],
    units_completed,
    units_required,
    catalog_year: pick(CATALOG_YEARS, seed >>> 16),
    totalCompleted,
    totalRequired: units_required,
    percent,
    geCompleted,
    geRequired,
    coreCompleted,
    coreRequired,
    upperCompleted,
    upperRequired,
  };
}
