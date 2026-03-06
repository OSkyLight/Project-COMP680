import { useState } from "react";
import { Share2, Eye, EyeOff } from "lucide-react";
import { courseCatalog } from "../data/degreeData";
import { getCompletedIds, generateRecommendations } from "../engine/recommendationEngine";

// Simple visual prerequisite tree for top recommendations
export function PrerequisiteGraph() {
  const [showCompleted, setShowCompleted] = useState(true);
  const completedIds = getCompletedIds();
  const recommendations = generateRecommendations().slice(0, 6);

  // Build a flat list of relevant courses (recommendations + their prereqs)
  const relevantIds = new Set<string>();
  recommendations.forEach((r) => {
    relevantIds.add(r.course.id);
    r.course.prerequisites.forEach((p) => relevantIds.add(p));
  });

  const nodes = courseCatalog.filter(
    (c) =>
      relevantIds.has(c.id) &&
      (showCompleted ? true : !completedIds.has(c.id))
  );

  function nodeColor(id: string): string {
    if (completedIds.has(id)) return "#D1FAE5"; // green
    const rec = recommendations.find((r) => r.course.id === id);
    if (rec) {
      if (rec.priority === "High") return "#FEE2E2";
      if (rec.priority === "Medium") return "#FEF3C7";
      return "#F3F4F6";
    }
    return "#EDE9FE"; // prereq not yet done
  }

  function nodeBorder(id: string): string {
    if (completedIds.has(id)) return "#10B981";
    const rec = recommendations.find((r) => r.course.id === id);
    if (rec) {
      if (rec.priority === "High") return "#CC0000";
      if (rec.priority === "Medium") return "#F59E0B";
      return "#9CA3AF";
    }
    return "#8B5CF6";
  }

  function nodeLabel(id: string): string {
    if (completedIds.has(id)) return "✓ Completed";
    const rec = recommendations.find((r) => r.course.id === id);
    if (rec) return `${rec.priority} Priority`;
    return "Prereq needed";
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#CC0000]" />
          <h2 className="text-gray-800">Prerequisite Map</h2>
          <span className="text-gray-400 text-sm">(Top Recommendations)</span>
        </div>
        <button
          onClick={() => setShowCompleted((s) => !s)}
          className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
          style={{ fontSize: "0.78rem" }}
        >
          {showCompleted ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          {showCompleted ? "Hide completed" : "Show completed"}
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { color: "#D1FAE5", border: "#10B981", label: "Completed" },
          { color: "#FEE2E2", border: "#CC0000", label: "High Priority Rec" },
          { color: "#FEF3C7", border: "#F59E0B", label: "Medium Priority Rec" },
          { color: "#F3F4F6", border: "#9CA3AF", label: "Low Priority Rec" },
          { color: "#EDE9FE", border: "#8B5CF6", label: "Prerequisite (unmet)" },
        ].map(({ color, border, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: color, borderColor: border }}
            />
            <span className="text-gray-600" style={{ fontSize: "0.72rem" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-wrap gap-3">
        {nodes.map((course) => {
          const color = nodeColor(course.id);
          const border = nodeBorder(course.id);
          const label = nodeLabel(course.id);
          const isRec = recommendations.some((r) => r.course.id === course.id);
          const prereqIds = course.prerequisites.filter((p) => relevantIds.has(p));

          return (
            <div
              key={course.id}
              className="rounded-xl border-2 p-3 min-w-[180px] max-w-[230px] flex-1"
              style={{ backgroundColor: color, borderColor: border }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>
                  {course.id}
                </span>
                {isRec && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-white"
                    style={{ backgroundColor: border, fontSize: "0.58rem", fontWeight: 700, whiteSpace: "nowrap" }}
                  >
                    REC
                  </span>
                )}
              </div>
              <div className="text-gray-700 mb-2" style={{ fontSize: "0.75rem", lineHeight: 1.4 }}>
                {course.name}
              </div>
              <div
                className="rounded-full px-2 py-0.5 inline-block"
                style={{ backgroundColor: border + "22", color: border, fontSize: "0.65rem", fontWeight: 600 }}
              >
                {label}
              </div>
              {prereqIds.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/60">
                  <span className="text-gray-500" style={{ fontSize: "0.65rem" }}>
                    Requires: {prereqIds.join(", ")}
                  </span>
                </div>
              )}
              <div className="mt-1 text-gray-500" style={{ fontSize: "0.65rem" }}>
                {course.units} units · {course.difficulty}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-gray-400 mt-4" style={{ fontSize: "0.72rem" }}>
        Showing prerequisites and top-6 recommended courses. Courses with unfulfilled prerequisites are highlighted in purple.
      </p>
    </div>
  );
}
