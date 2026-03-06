import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronRight, Circle, CheckCircle2 } from "lucide-react";
import { computeUnmetRequirements, type UnmetRequirement } from "../engine/recommendationEngine";
import { courseCatalog } from "../data/degreeData";

function StatusBadge({ status }: { status: UnmetRequirement["status"] }) {
  const styles = {
    "Not Started": "bg-red-50 text-red-700 border-red-200",
    "In Progress": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Nearly Complete": "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function RequirementRow({ unmet }: { unmet: UnmetRequirement }) {
  const [open, setOpen] = useState(false);
  const { group, completedCourses, remainingUnits, missingRequired, availableElectives, status } = unmet;

  const pct = Math.min(
    100,
    Math.round((unmet.completedUnits / group.required_units) * 100)
  );

  const trackColor =
    status === "Nearly Complete"
      ? "#3B82F6"
      : status === "In Progress"
      ? "#F59E0B"
      : "#EF4444";

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-shrink-0">
          {status === "Nearly Complete" ? (
            <Circle className="w-5 h-5 text-blue-400" />
          ) : (
            <AlertTriangle className={`w-5 h-5 ${status === "In Progress" ? "text-yellow-400" : "text-red-400"}`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-gray-800 font-medium" style={{ fontSize: "0.88rem" }}>
              {group.label}
            </span>
            <StatusBadge status={status} />
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: trackColor }}
              />
            </div>
            <span className="text-gray-500 text-xs whitespace-nowrap">
              {unmet.completedUnits}/{group.required_units} units
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-gray-400">
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-50 pt-3 bg-gray-50/50">
          <p className="text-gray-500" style={{ fontSize: "0.8rem" }}>{group.description}</p>

          {/* Missing required */}
          {missingRequired.length > 0 && (
            <div>
              <div className="text-gray-600 mb-2" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Missing Required Courses ({missingRequired.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {missingRequired.map((id) => {
                  const course = courseCatalog.find((c) => c.id === id);
                  return (
                    <span
                      key={id}
                      className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-2.5 py-1"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {id} — {course?.name ?? "Unknown"}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed courses */}
          {completedCourses.length > 0 && (
            <div>
              <div className="text-gray-600 mb-2" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Completed ({completedCourses.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {completedCourses.map((id) => {
                  const course = courseCatalog.find((c) => c.id === id);
                  return (
                    <span
                      key={id}
                      className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg px-2.5 py-1"
                      style={{ fontSize: "0.78rem" }}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {id} — {course?.name ?? "Unknown"}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available electives */}
          {availableElectives.length > 0 && (
            <div>
              <div className="text-gray-600 mb-2" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Electives Available Now ({availableElectives.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {availableElectives.map((id) => {
                  const course = courseCatalog.find((c) => c.id === id);
                  return (
                    <span
                      key={id}
                      className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-2.5 py-1"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {id} — {course?.name ?? "Unknown"}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-orange-600 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2" style={{ fontSize: "0.78rem" }}>
            ⚠️ <strong>{remainingUnits} units</strong> still needed to complete this requirement.
          </div>
        </div>
      )}
    </div>
  );
}

export function UnmetRequirements() {
  const unmet = computeUnmetRequirements();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#CC0000]" />
          <h2 className="text-gray-800">Unmet Requirements</h2>
        </div>
        <span className="bg-red-50 text-red-700 border border-red-100 rounded-full px-3 py-0.5 text-xs font-medium">
          {unmet.length} remaining
        </span>
      </div>

      {unmet.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
          <p>All requirements are satisfied! 🎉</p>
        </div>
      ) : (
        <div className="space-y-2">
          {unmet.map((u) => (
            <RequirementRow key={u.group.id} unmet={u} />
          ))}
        </div>
      )}
    </div>
  );
}
