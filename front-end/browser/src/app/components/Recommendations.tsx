import { useState } from "react";
import {
  Brain,
  ChevronDown,
  ChevronRight,
  Zap,
  Star,
  Minus,
  Calendar,
  BookOpen,
  Unlock,
  Tag,
} from "lucide-react";
import { generateRecommendations, type Recommendation } from "../engine/recommendationEngine";

type FilterPriority = "All" | "High" | "Medium" | "Low";

function PriorityBadge({ priority }: { priority: Recommendation["priority"] }) {
  const config = {
    High: { icon: Zap, bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500" },
    Medium: { icon: Star, bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", dot: "bg-yellow-500" },
    Low: { icon: Minus, bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600", dot: "bg-gray-400" },
  };
  const c = config[priority];
  const Icon = c.icon;
  return (
    <span className={`flex items-center gap-1.5 ${c.bg} ${c.border} ${c.text} border rounded-full px-2.5 py-0.5`} style={{ fontSize: "0.72rem", fontWeight: 600 }}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      <Icon className="w-3 h-3" />
      {priority} Priority
    </span>
  );
}

function DifficultyPill({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Introductory: "bg-green-50 text-green-700",
    Intermediate: "bg-blue-50 text-blue-700",
    Advanced: "bg-purple-50 text-purple-700",
  };
  return (
    <span className={`text-xs rounded-full px-2 py-0.5 ${colors[level] ?? "bg-gray-50 text-gray-600"}`}>
      {level}
    </span>
  );
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const { course, priority, reasons, unlockedCourses, satisfiedGroups } = rec;

  const priorityColors = {
    High: "border-l-red-400",
    Medium: "border-l-yellow-400",
    Low: "border-l-gray-300",
  };

  return (
    <div
      className={`border border-gray-100 border-l-4 ${priorityColors[priority]} rounded-xl overflow-hidden hover:shadow-sm transition-shadow`}
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start gap-4 px-4 py-4 hover:bg-gray-50/60 transition-colors text-left"
      >
        {/* Rank badge */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white"
          style={{
            backgroundColor:
              priority === "High" ? "#CC0000" : priority === "Medium" ? "#F59E0B" : "#9CA3AF",
            fontSize: "0.78rem",
            fontWeight: 700,
          }}
        >
          #{index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-gray-800" style={{ fontSize: "0.92rem", fontWeight: 600 }}>
              {course.id}
            </span>
            <span className="text-gray-400">—</span>
            <span className="text-gray-700" style={{ fontSize: "0.9rem" }}>{course.name}</span>
            <PriorityBadge priority={priority} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>
              {course.units} units
            </span>
            <span className="text-gray-200">|</span>
            <DifficultyPill level={course.difficulty} />
            {course.offered.map((sem) => (
              <span key={sem} className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                {sem}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 text-gray-400 mt-1">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-4 bg-gray-50/30">
          {/* Course description */}
          <p className="text-gray-600" style={{ fontSize: "0.82rem" }}>{course.description}</p>

          {/* AI Reasoning */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-[#CC0000]" />
              <span className="text-gray-800" style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                AI Reasoning
              </span>
            </div>
            <ul className="space-y-2">
              {reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center" style={{ fontSize: "0.6rem", fontWeight: 700 }}>
                    {i + 1}
                  </span>
                  <span className="text-gray-700" style={{ fontSize: "0.82rem" }}>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Satisfies */}
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-gray-600" style={{ fontSize: "0.72rem", fontWeight: 600 }}>Satisfies Requirements</span>
              </div>
              <div className="flex flex-col gap-1">
                {satisfiedGroups.map((g) => (
                  <span key={g} className="text-blue-700 bg-blue-50 rounded-lg px-2 py-0.5" style={{ fontSize: "0.72rem" }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Unlocks */}
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Unlock className="w-3.5 h-3.5 text-green-500" />
                <span className="text-gray-600" style={{ fontSize: "0.72rem", fontWeight: 600 }}>Unlocks Courses</span>
              </div>
              {unlockedCourses.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {unlockedCourses.map((name) => (
                    <span key={name} className="text-green-700 bg-green-50 rounded-lg px-2 py-0.5" style={{ fontSize: "0.72rem" }}>
                      {name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400" style={{ fontSize: "0.72rem" }}>No immediate unlocks</span>
              )}
            </div>

            {/* Prerequisites & tags */}
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-gray-600" style={{ fontSize: "0.72rem", fontWeight: 600 }}>Topics</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {course.tags.map((tag) => (
                  <span key={tag} className="bg-purple-50 text-purple-700 rounded-full px-2 py-0.5" style={{ fontSize: "0.7rem" }}>
                    {tag}
                  </span>
                ))}
              </div>
              {course.prerequisites.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <span className="text-gray-500" style={{ fontSize: "0.7rem" }}>
                    Prereqs: {course.prerequisites.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Availability note */}
          <div className="flex items-center gap-2 text-gray-500" style={{ fontSize: "0.78rem" }}>
            <Calendar className="w-3.5 h-3.5" />
            <span>Typically offered in: <strong className="text-gray-700">{course.offered.join(", ")}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

export function Recommendations() {
  const [filter, setFilter] = useState<FilterPriority>("All");
  const all = generateRecommendations();
  const filtered = filter === "All" ? all : all.filter((r) => r.priority === filter);

  const counts = {
    All: all.length,
    High: all.filter((r) => r.priority === "High").length,
    Medium: all.filter((r) => r.priority === "Medium").length,
    Low: all.filter((r) => r.priority === "Low").length,
  };

  const filterButtons: { label: FilterPriority; color: string }[] = [
    { label: "All", color: "bg-gray-800 text-white" },
    { label: "High", color: "bg-red-600 text-white" },
    { label: "Medium", color: "bg-yellow-500 text-white" },
    { label: "Low", color: "bg-gray-400 text-white" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#CC0000]" />
          <h2 className="text-gray-800">AI Course Recommendations</h2>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {filterButtons.map(({ label, color }) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className={`px-3 py-1.5 rounded-full transition-all ${
                filter === label
                  ? color + " shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={{ fontSize: "0.78rem" }}
            >
              {label}
              <span className="ml-1.5 opacity-75">({counts[label]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Explanatory note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
        <Brain className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-blue-700" style={{ fontSize: "0.8rem" }}>
          Recommendations are ranked by priority score based on: prerequisite readiness, requirement urgency,
          course availability, and how many future courses they unlock.
          Courses with unmet prerequisites are automatically excluded.
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No {filter.toLowerCase()} priority recommendations found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((rec, i) => (
            <RecommendationCard
              key={rec.course.id}
              rec={rec}
              index={filter === "All" ? i : all.indexOf(rec)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
