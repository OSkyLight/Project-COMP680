// ─── Types ─────────────────────────────────────────────────────────────────

export type Grade = "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F" | "IP" | "W";

export interface CompletedCourse {
  id: string;
  grade: Grade;
  semester: string;
  units: number;
}

export interface Student {
  id: string;
  name: string;
  major: string;
  concentration: string;
  catalog_year: string;
  advisor: string;
  standing: string;
  gpa: number;
  units_completed: number;
  units_required: number;
  completed_courses: CompletedCourse[];
  current_semester: string;
}

export interface RequirementGroup {
  id: string;
  label: string;
  description: string;
  required_units: number;
  required_courses?: string[]; // specific course IDs that must be completed
  elective_courses?: string[]; // courses that can satisfy this requirement (pick N)
  required_elective_units?: number; // how many units of electives needed
  completed_courses?: string[]; // filled in by engine
}

export interface Course {
  id: string;
  name: string;
  units: number;
  description: string;
  prerequisites: string[]; // course IDs
  corequisites?: string[];
  satisfies: string[]; // requirement group IDs
  offered: ("Fall" | "Spring" | "Summer")[];
  difficulty: "Introductory" | "Intermediate" | "Advanced";
  tags: string[];
}

// ─── Student Profile ────────────────────────────────────────────────────────

export const student: Student = {
  id: "123-456-679",
  name: "Xuanvu Cu",
  major: "Computer Science",
  concentration: "Software Engineering",
  catalog_year: "2025-2026",
  advisor: "Dr. John Smith",
  standing: "Junior",
  gpa: 3.21,
  units_completed: 75,
  units_required: 120,
  current_semester: "Spring 2026",
  completed_courses: [
    // GE — Basic Skills
    { id: "ENGL-150", grade: "B+", semester: "Fall 2022", units: 3 },
    { id: "MATH-150A", grade: "A-", semester: "Fall 2022", units: 5 },
    // GE — Arts & Humanities
    { id: "ART-100", grade: "B", semester: "Spring 2023", units: 3 },
    // GE — Social Sciences
    { id: "SOC-150", grade: "B-", semester: "Fall 2023", units: 3 },
    // GE — Natural Sciences
    { id: "PHYS-220A", grade: "B+", semester: "Spring 2023", units: 4 },
    // GE — Lifelong Learning
    { id: "KIN-100", grade: "A", semester: "Fall 2022", units: 1 },
    // Lower Division Core
    { id: "COMP-110", grade: "A", semester: "Fall 2022", units: 3 },
    { id: "COMP-182", grade: "A-", semester: "Spring 2023", units: 3 },
    { id: "MATH-150B", grade: "B+", semester: "Spring 2023", units: 5 },
    { id: "MATH-280", grade: "B", semester: "Fall 2023", units: 3 },
    { id: "COMP-256", grade: "B+", semester: "Fall 2023", units: 3 },
    { id: "COMP-282", grade: "B", semester: "Spring 2024", units: 3 },
    { id: "MATH-340", grade: "C+", semester: "Spring 2024", units: 3 },
    { id: "COMP-310", grade: "B-", semester: "Fall 2024", units: 3 },
    { id: "COMP-322", grade: "B", semester: "Fall 2024", units: 3 },
    // Upper Division — partial
    { id: "COMP-380", grade: "B+", semester: "Spring 2025", units: 3 },
    { id: "COMP-390", grade: "B", semester: "Spring 2025", units: 3 },
    // GE — Comparative Cultural Studies
    { id: "AFRS-100", grade: "A-", semester: "Fall 2023", units: 3 },
    // GE — US History
    { id: "HIST-170", grade: "B", semester: "Spring 2024", units: 3 },
    // GE — Constitution
    { id: "POLS-155", grade: "B-", semester: "Spring 2024", units: 3 },
    // GE — Oral Communication
    { id: "COMM-101", grade: "B+", semester: "Spring 2023", units: 3 },
    // GE — Computer Application
    { id: "COMP-100", grade: "A", semester: "Fall 2022", units: 3 },
  ],
};

// ─── Degree Requirement Groups ───────────────────────────────────────────────

export const requirementGroups: RequirementGroup[] = [
  {
    id: "ge-basic-skills",
    label: "GE: Basic Skills",
    description: "English composition and mathematics foundations.",
    required_units: 8,
    required_courses: ["ENGL-150", "MATH-150A"],
  },
  {
    id: "ge-oral-comm",
    label: "GE: Oral Communication",
    description: "Public speaking and communication competency.",
    required_units: 3,
    required_courses: ["COMM-101"],
  },
  {
    id: "ge-computer",
    label: "GE: Computer Applications",
    description: "Introductory computing literacy.",
    required_units: 3,
    required_courses: ["COMP-100"],
  },
  {
    id: "ge-arts",
    label: "GE: Arts & Humanities",
    description: "Courses in fine arts, literature, philosophy, or related fields.",
    required_units: 9,
    elective_courses: ["ART-100", "ENGL-210", "PHIL-100", "MUS-100", "ENGL-231"],
    required_elective_units: 9,
  },
  {
    id: "ge-social",
    label: "GE: Social Sciences",
    description: "Courses exploring human society and social behavior.",
    required_units: 9,
    elective_courses: ["SOC-150", "PSY-150", "ECON-160", "ANTH-150"],
    required_elective_units: 9,
  },
  {
    id: "ge-science",
    label: "GE: Natural Sciences",
    description: "Lab-based natural science courses.",
    required_units: 7,
    elective_courses: ["PHYS-220A", "CHEM-101", "BIOL-100"],
    required_elective_units: 7,
  },
  {
    id: "ge-lifelong",
    label: "GE: Lifelong Learning",
    description: "Health and physical activity.",
    required_units: 2,
    elective_courses: ["KIN-100", "KIN-101", "KIN-200"],
    required_elective_units: 2,
  },
  {
    id: "ge-culture",
    label: "GE: Comparative Cultural Studies",
    description: "Courses examining diverse global cultures.",
    required_units: 3,
    required_courses: ["AFRS-100"],
  },
  {
    id: "ge-history",
    label: "GE: US History",
    description: "United States history survey.",
    required_units: 3,
    required_courses: ["HIST-170"],
  },
  {
    id: "ge-constitution",
    label: "GE: US Constitution & Government",
    description: "American government and constitutional principles.",
    required_units: 3,
    required_courses: ["POLS-155"],
  },
  {
    id: "lower-core",
    label: "Lower Division Core",
    description: "Foundational computer science courses.",
    required_units: 33,
    required_courses: [
      "COMP-110", "COMP-182", "COMP-256", "COMP-282",
      "MATH-150B", "MATH-280", "MATH-340",
      "PHYS-220A", "COMP-310", "COMP-322",
    ],
  },
  {
    id: "upper-core",
    label: "Upper Division Core",
    description: "Advanced CS courses required of all majors.",
    required_units: 21,
    required_courses: [
      "COMP-380", "COMP-390", "COMP-410",
      "COMP-440", "COMP-460", "COMP-490", "COMP-499",
    ],
  },
  {
    id: "concentration-se",
    label: "Concentration: Software Engineering",
    description: "Specialization courses in software engineering.",
    required_units: 12,
    required_courses: ["COMP-484", "COMP-486", "COMP-587", "COMP-589"],
  },
  {
    id: "upper-electives",
    label: "Upper Division CS Electives",
    description: "Additional upper-division COMP electives (choose 9 units).",
    required_units: 9,
    elective_courses: [
      "COMP-467", "COMP-471", "COMP-475",
      "COMP-481", "COMP-530", "COMP-545",
    ],
    required_elective_units: 9,
  },
];

// ─── Course Catalog ──────────────────────────────────────────────────────────

export const courseCatalog: Course[] = [
  // ── GE Courses (not yet completed) ──────────────────────────────────────
  {
    id: "ENGL-210",
    name: "Intermediate Composition",
    units: 3,
    description: "Intermediate level academic writing and research.",
    prerequisites: ["ENGL-150"],
    satisfies: ["ge-arts"],
    offered: ["Fall", "Spring"],
    difficulty: "Introductory",
    tags: ["Writing", "GE"],
  },
  {
    id: "PHIL-100",
    name: "Introduction to Philosophy",
    units: 3,
    description: "Foundational concepts in epistemology, ethics, and logic.",
    prerequisites: [],
    satisfies: ["ge-arts"],
    offered: ["Fall", "Spring"],
    difficulty: "Introductory",
    tags: ["Humanities", "GE"],
  },
  {
    id: "PSY-150",
    name: "Introduction to Psychology",
    units: 3,
    description: "Survey of major psychological theories and research.",
    prerequisites: [],
    satisfies: ["ge-social"],
    offered: ["Fall", "Spring", "Summer"],
    difficulty: "Introductory",
    tags: ["Social Science", "GE"],
  },
  {
    id: "ECON-160",
    name: "Introduction to Macroeconomics",
    units: 3,
    description: "National income, economic growth, inflation, and policy.",
    prerequisites: [],
    satisfies: ["ge-social"],
    offered: ["Fall", "Spring"],
    difficulty: "Introductory",
    tags: ["Social Science", "GE"],
  },
  {
    id: "KIN-101",
    name: "Fitness for Life",
    units: 1,
    description: "Physical wellness and fitness planning.",
    prerequisites: [],
    satisfies: ["ge-lifelong"],
    offered: ["Fall", "Spring"],
    difficulty: "Introductory",
    tags: ["Wellness", "GE"],
  },

  // ── Lower Division Core (already completed — included for completeness in catalog) ──
  {
    id: "COMP-110",
    name: "Introduction to Algorithms and Programming",
    units: 3,
    description: "Fundamental algorithms and programming in Python.",
    prerequisites: [],
    satisfies: ["lower-core"],
    offered: ["Fall", "Spring", "Summer"],
    difficulty: "Introductory",
    tags: ["Programming", "Python"],
  },
  {
    id: "COMP-182",
    name: "Data Structures",
    units: 3,
    description: "Arrays, linked lists, stacks, queues, trees, and graphs.",
    prerequisites: ["COMP-110"],
    satisfies: ["lower-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Intermediate",
    tags: ["Data Structures", "Java"],
  },
  {
    id: "COMP-256",
    name: "Computer Organization",
    units: 3,
    description: "Assembly language, memory hierarchy, and digital logic.",
    prerequisites: ["COMP-110"],
    satisfies: ["lower-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Intermediate",
    tags: ["Systems", "Assembly"],
  },
  {
    id: "COMP-282",
    name: "Algorithms",
    units: 3,
    description: "Algorithm design, analysis, sorting, searching, graph algorithms.",
    prerequisites: ["COMP-182", "MATH-280"],
    satisfies: ["lower-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Intermediate",
    tags: ["Algorithms", "Theory"],
  },
  {
    id: "COMP-310",
    name: "Operating Systems",
    units: 3,
    description: "Processes, threads, memory management, and file systems.",
    prerequisites: ["COMP-256", "COMP-182"],
    satisfies: ["lower-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Intermediate",
    tags: ["Systems", "OS"],
  },
  {
    id: "COMP-322",
    name: "Programming Languages",
    units: 3,
    description: "Syntax, semantics, type systems, and paradigms.",
    prerequisites: ["COMP-182"],
    satisfies: ["lower-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Intermediate",
    tags: ["Languages", "Theory"],
  },
  {
    id: "MATH-150A",
    name: "Calculus I",
    units: 5,
    description: "Limits, derivatives, and applications of differentiation.",
    prerequisites: [],
    satisfies: ["ge-basic-skills", "lower-core"],
    offered: ["Fall", "Spring", "Summer"],
    difficulty: "Introductory",
    tags: ["Math", "Calculus"],
  },
  {
    id: "MATH-150B",
    name: "Calculus II",
    units: 5,
    description: "Integration techniques, series, and multivariable intro.",
    prerequisites: ["MATH-150A"],
    satisfies: ["lower-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Intermediate",
    tags: ["Math", "Calculus"],
  },
  {
    id: "MATH-280",
    name: "Discrete Mathematics",
    units: 3,
    description: "Logic, set theory, combinatorics, and graph theory.",
    prerequisites: ["MATH-150A"],
    satisfies: ["lower-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Intermediate",
    tags: ["Math", "Discrete"],
  },
  {
    id: "MATH-340",
    name: "Linear Algebra",
    units: 3,
    description: "Vectors, matrices, linear transformations, and eigenvalues.",
    prerequisites: ["MATH-150B"],
    satisfies: ["lower-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Intermediate",
    tags: ["Math", "Linear Algebra"],
  },

  // ── Upper Division Core ──────────────────────────────────────────────────
  {
    id: "COMP-380",
    name: "Software Engineering I",
    units: 3,
    description: "Software development life cycle, requirements, and design patterns.",
    prerequisites: ["COMP-282", "COMP-322"],
    satisfies: ["upper-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Advanced",
    tags: ["Software Eng", "Design"],
  },
  {
    id: "COMP-390",
    name: "Computer Networks",
    units: 3,
    description: "Network architecture, protocols, TCP/IP, and security basics.",
    prerequisites: ["COMP-310"],
    satisfies: ["upper-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Advanced",
    tags: ["Networks", "Protocols"],
  },
  {
    id: "COMP-410",
    name: "Database Systems",
    units: 3,
    description: "Relational models, SQL, normalization, and transaction management.",
    prerequisites: ["COMP-282"],
    satisfies: ["upper-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Advanced",
    tags: ["Databases", "SQL"],
  },
  {
    id: "COMP-440",
    name: "Artificial Intelligence",
    units: 3,
    description: "Search, knowledge representation, planning, and machine learning intro.",
    prerequisites: ["COMP-282", "MATH-340"],
    satisfies: ["upper-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Advanced",
    tags: ["AI", "ML"],
  },
  {
    id: "COMP-460",
    name: "Computer Architecture",
    units: 3,
    description: "Processor design, pipelining, cache, and parallel computing.",
    prerequisites: ["COMP-256", "COMP-310"],
    satisfies: ["upper-core"],
    offered: ["Fall"],
    difficulty: "Advanced",
    tags: ["Hardware", "Systems"],
  },
  {
    id: "COMP-490",
    name: "Senior Project I",
    units: 3,
    description: "Capstone project proposal, requirements, and design phase.",
    prerequisites: ["COMP-380", "COMP-410"],
    satisfies: ["upper-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Advanced",
    tags: ["Capstone", "Project"],
  },
  {
    id: "COMP-499",
    name: "Senior Project II",
    units: 3,
    description: "Capstone project implementation, testing, and final presentation.",
    prerequisites: ["COMP-490"],
    satisfies: ["upper-core"],
    offered: ["Fall", "Spring"],
    difficulty: "Advanced",
    tags: ["Capstone", "Project"],
  },

  // ── Concentration: Software Engineering ─────────────────────────────────
  {
    id: "COMP-484",
    name: "Software Engineering II",
    units: 3,
    description: "Advanced design patterns, refactoring, and agile development.",
    prerequisites: ["COMP-380"],
    satisfies: ["concentration-se"],
    offered: ["Fall", "Spring"],
    difficulty: "Advanced",
    tags: ["Software Eng", "Agile"],
  },
  {
    id: "COMP-486",
    name: "Human-Computer Interaction",
    units: 3,
    description: "UI/UX principles, usability testing, and interaction design.",
    prerequisites: ["COMP-380"],
    satisfies: ["concentration-se"],
    offered: ["Spring"],
    difficulty: "Advanced",
    tags: ["HCI", "UX"],
  },
  {
    id: "COMP-587",
    name: "Software Testing & Quality Assurance",
    units: 3,
    description: "Testing methodologies, automation, TDD, and CI/CD pipelines.",
    prerequisites: ["COMP-484"],
    satisfies: ["concentration-se"],
    offered: ["Fall"],
    difficulty: "Advanced",
    tags: ["Testing", "QA"],
  },
  {
    id: "COMP-589",
    name: "Distributed Systems",
    units: 3,
    description: "Concurrency, consistency, distributed databases, and microservices.",
    prerequisites: ["COMP-390", "COMP-410"],
    satisfies: ["concentration-se"],
    offered: ["Spring"],
    difficulty: "Advanced",
    tags: ["Distributed", "Cloud"],
  },

  // ── Upper Division Electives ─────────────────────────────────────────────
  {
    id: "COMP-467",
    name: "Computer Graphics",
    units: 3,
    description: "2D/3D rendering, OpenGL, shaders, and geometric transformations.",
    prerequisites: ["COMP-282", "MATH-340"],
    satisfies: ["upper-electives"],
    offered: ["Fall"],
    difficulty: "Advanced",
    tags: ["Graphics", "OpenGL"],
  },
  {
    id: "COMP-471",
    name: "Compiler Design",
    units: 3,
    description: "Lexical analysis, parsing, semantic analysis, and code generation.",
    prerequisites: ["COMP-322", "COMP-282"],
    satisfies: ["upper-electives"],
    offered: ["Spring"],
    difficulty: "Advanced",
    tags: ["Compilers", "Languages"],
  },
  {
    id: "COMP-475",
    name: "Mobile Application Development",
    units: 3,
    description: "iOS and Android development with modern frameworks.",
    prerequisites: ["COMP-380"],
    satisfies: ["upper-electives"],
    offered: ["Fall", "Spring"],
    difficulty: "Advanced",
    tags: ["Mobile", "iOS", "Android"],
  },
  {
    id: "COMP-481",
    name: "Machine Learning",
    units: 3,
    description: "Supervised/unsupervised learning, neural networks, and evaluation.",
    prerequisites: ["COMP-440", "MATH-340"],
    satisfies: ["upper-electives"],
    offered: ["Spring"],
    difficulty: "Advanced",
    tags: ["ML", "AI", "Data Science"],
  },
  {
    id: "COMP-530",
    name: "Cybersecurity",
    units: 3,
    description: "Cryptography, network security, vulnerability analysis, and ethics.",
    prerequisites: ["COMP-390"],
    satisfies: ["upper-electives"],
    offered: ["Fall", "Spring"],
    difficulty: "Advanced",
    tags: ["Security", "Cryptography"],
  },
  {
    id: "COMP-545",
    name: "Cloud Computing",
    units: 3,
    description: "AWS/GCP, containerization, Kubernetes, and serverless architectures.",
    prerequisites: ["COMP-390"],
    satisfies: ["upper-electives"],
    offered: ["Spring"],
    difficulty: "Advanced",
    tags: ["Cloud", "DevOps"],
  },
];
