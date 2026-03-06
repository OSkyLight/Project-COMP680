import {
  student,
  requirementGroups,
  courseCatalog,
  type Course,
  type RequirementGroup,
} from "../data/degreeData";

// ─── Helper: get completed course IDs ────────────────────────────────────────

export function getCompletedIds(): Set<string> {
  return new Set(student.completed_courses.map((c) => c.id));
}

// ─── Check if prerequisites are satisfied ────────────────────────────────────

export function prerequisitesMet(course: Course, completedIds: Set<string>): boolean {
  return course.prerequisites.every((prereq) => completedIds.has(prereq));
}

// ─── Compute unmet requirements ───────────────────────────────────────────────

export interface UnmetRequirement {
  group: RequirementGroup;
  completedCourses: string[];
  completedUnits: number;
  remainingUnits: number;
  missingRequired: string[]; // required courses not yet completed
  availableElectives: string[]; // elective courses that satisfy this req and prereqs met
  status: "Not Started" | "In Progress" | "Nearly Complete";
}

export function computeUnmetRequirements(): UnmetRequirement[] {
  const completedIds = getCompletedIds();
  const unmet: UnmetRequirement[] = [];

  for (const group of requirementGroups) {
    const allRequired = group.required_courses ?? [];
    const allElectives = group.elective_courses ?? [];
    const neededElectiveUnits = group.required_elective_units ?? 0;

    // Completed required courses
    const completedRequired = allRequired.filter((id) => completedIds.has(id));
    const missingRequired = allRequired.filter((id) => !completedIds.has(id));

    // Completed elective courses (for this group)
    const completedElectives = allElectives.filter((id) => completedIds.has(id));
    const completedElectiveUnits = completedElectives.reduce((sum, id) => {
      const course = courseCatalog.find((c) => c.id === id);
      return sum + (course?.units ?? 0);
    }, 0);

    // Compute completed units for this group
    const completedRequiredUnits = completedRequired.reduce((sum, id) => {
      const course = courseCatalog.find((c) => c.id === id);
      return sum + (course?.units ?? 0);
    }, 0);

    const totalCompletedUnits = completedRequiredUnits + completedElectiveUnits;

    // Is this group fully satisfied?
    const requiredSatisfied = missingRequired.length === 0;
    const electiveSatisfied = completedElectiveUnits >= neededElectiveUnits;
    const isSatisfied =
      requiredSatisfied && (allElectives.length === 0 ? true : electiveSatisfied);

    if (isSatisfied) continue;

    // Available electives (not yet taken, prereqs met)
    const availableElectives = allElectives.filter(
      (id) => !completedIds.has(id) && (() => {
        const course = courseCatalog.find((c) => c.id === id);
        return course ? prerequisitesMet(course, completedIds) : false;
      })()
    );

    const remaining = group.required_units - totalCompletedUnits;

    let status: UnmetRequirement["status"] = "Not Started";
    if (totalCompletedUnits > 0 && remaining <= group.required_units * 0.4) {
      status = "Nearly Complete";
    } else if (totalCompletedUnits > 0) {
      status = "In Progress";
    }

    unmet.push({
      group,
      completedCourses: [...completedRequired, ...completedElectives],
      completedUnits: totalCompletedUnits,
      remainingUnits: Math.max(0, remaining),
      missingRequired,
      availableElectives,
      status,
    });
  }

  return unmet;
}

// ─── Recommendation ───────────────────────────────────────────────────────────

export interface Recommendation {
  course: Course;
  priority: "High" | "Medium" | "Low";
  reasons: string[];
  unlockedCourses: string[]; // courses this unlocks
  satisfiedGroups: string[]; // requirement group labels
  urgency_score: number;
}

export function generateRecommendations(): Recommendation[] {
  const completedIds = getCompletedIds();
  const unmetReqs = computeUnmetRequirements();
  const unmetGroupIds = new Set(unmetReqs.map((u) => u.group.id));

  // Courses not yet completed
  const candidateCourses = courseCatalog.filter(
    (c) => !completedIds.has(c.id) && prerequisitesMet(c, completedIds)
  );

  const recommendations: Recommendation[] = [];

  for (const course of candidateCourses) {
    // Does this course satisfy any unmet requirement?
    const relevantGroups = course.satisfies.filter((g) => unmetGroupIds.has(g));
    if (relevantGroups.length === 0) continue;

    const satisfiedGroupLabels = relevantGroups.map((gid) => {
      const group = requirementGroups.find((r) => r.id === gid);
      return group?.label ?? gid;
    });

    // Courses this unlocks (not yet completed, this is the only missing prereq)
    const unlockedCourses = courseCatalog
      .filter((c) => {
        if (completedIds.has(c.id)) return false;
        if (c.id === course.id) return false;
        // Would completing this course unlock c?
        const wouldComplete = new Set([...completedIds, course.id]);
        return (
          c.prerequisites.includes(course.id) &&
          c.prerequisites.every((p) => wouldComplete.has(p))
        );
      })
      .map((c) => c.name);

    // Build reason strings
    const reasons: string[] = [];

    for (const gid of relevantGroups) {
      const unmet = unmetReqs.find((u) => u.group.id === gid);
      if (!unmet) continue;
      const g = unmet.group;

      if (g.required_courses?.includes(course.id)) {
        reasons.push(`Required for "${g.label}" — ${unmet.remainingUnits} units still needed.`);
      } else {
        reasons.push(`Counts toward "${g.label}" elective requirement (${unmet.completedUnits}/${g.required_units} units done).`);
      }
    }

    if (unlockedCourses.length > 0) {
      reasons.push(
        `Unlocks ${unlockedCourses.length} course${unlockedCourses.length > 1 ? "s" : ""}: ${unlockedCourses.slice(0, 2).join(", ")}${unlockedCourses.length > 2 ? ", and more" : ""}.`
      );
    }

    if (course.offered.includes("Spring") && !course.offered.includes("Fall")) {
      reasons.push("Only offered in Spring — take it now to avoid a semester delay.");
    }
    if (course.offered.includes("Fall") && !course.offered.includes("Spring")) {
      reasons.push("Only offered in Fall — plan accordingly.");
    }

    // Urgency score (higher = recommend sooner)
    let score = 0;
    score += relevantGroups.length * 20; // satisfies multiple groups
    score += unlockedCourses.length * 15; // unlocks more courses
    // Is it required (not elective)?
    const isRequired = relevantGroups.some((gid) => {
      const g = requirementGroups.find((r) => r.id === gid);
      return g?.required_courses?.includes(course.id);
    });
    if (isRequired) score += 30;
    // Availability
    if (course.offered.length === 1) score += 10; // rare
    // Difficulty — prefer easier courses first if it's low division
    if (course.difficulty === "Introductory") score += 5;
    // Nearly complete group bonus
    const nearlyComplete = relevantGroups.some((gid) => {
      const u = unmetReqs.find((u) => u.group.id === gid);
      return u?.status === "Nearly Complete";
    });
    if (nearlyComplete) score += 25;

    let priority: Recommendation["priority"] =
      score >= 60 ? "High" : score >= 35 ? "Medium" : "Low";

    recommendations.push({
      course,
      priority,
      reasons,
      unlockedCourses,
      satisfiedGroups: satisfiedGroupLabels,
      urgency_score: score,
    });
  }

  // Sort by urgency score descending
  recommendations.sort((a, b) => b.urgency_score - a.urgency_score);

  return recommendations;
}

// ─── Progress stats ───────────────────────────────────────────────────────────

export interface ProgressStats {
  totalRequired: number;
  totalCompleted: number;
  percent: number;
  geCompleted: number;
  geRequired: number;
  coreCompleted: number;
  coreRequired: number;
  upperCompleted: number;
  upperRequired: number;
}

export function computeProgressStats(): ProgressStats {
  const completedIds = getCompletedIds();

  const geGroups = requirementGroups.filter((g) => g.id.startsWith("ge-"));
  const coreGroups = requirementGroups.filter((g) =>
    ["lower-core"].includes(g.id)
  );
  const upperGroups = requirementGroups.filter((g) =>
    ["upper-core", "concentration-se", "upper-electives"].includes(g.id)
  );

  function sumCompleted(groups: RequirementGroup[]): number {
    let total = 0;
    for (const g of groups) {
      const req = g.required_courses ?? [];
      const elec = g.elective_courses ?? [];
      const completedReq = req
        .filter((id) => completedIds.has(id))
        .reduce((s, id) => {
          const c = courseCatalog.find((c) => c.id === id);
          return s + (c?.units ?? 0);
        }, 0);
      const completedElec = elec
        .filter((id) => completedIds.has(id))
        .reduce((s, id) => {
          const c = courseCatalog.find((c) => c.id === id);
          return s + (c?.units ?? 0);
        }, 0);
      total += completedReq + Math.min(completedElec, g.required_elective_units ?? 0);
    }
    return total;
  }

  function sumRequired(groups: RequirementGroup[]): number {
    return groups.reduce((s, g) => s + g.required_units, 0);
  }

  return {
    totalRequired: student.units_required,
    totalCompleted: student.units_completed,
    percent: Math.round((student.units_completed / student.units_required) * 100),
    geCompleted: sumCompleted(geGroups),
    geRequired: sumRequired(geGroups),
    coreCompleted: sumCompleted(coreGroups),
    coreRequired: sumRequired(coreGroups),
    upperCompleted: sumCompleted(upperGroups),
    upperRequired: sumRequired(upperGroups),
  };
}
