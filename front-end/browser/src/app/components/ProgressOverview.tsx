import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { computeProgressStats } from "../engine/recommendationEngine";
import { student } from "../data/degreeData";

function RadialProgress({ percent, size = 80 }: { percent: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fee2e2" strokeWidth={8} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#CC0000"
        strokeWidth={8}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

function BarProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function ProgressOverview() {
  const stats = computeProgressStats();

  const categories = [
    {
      label: "General Education",
      completed: stats.geCompleted,
      required: stats.geRequired,
      color: "#3B82F6",
      icon: "📚",
    },
    {
      label: "Lower Division Core",
      completed: stats.coreCompleted,
      required: stats.coreRequired,
      color: "#10B981",
      icon: "🔧",
    },
    {
      label: "Upper Division",
      completed: stats.upperCompleted,
      required: stats.upperRequired,
      color: "#8B5CF6",
      icon: "🎓",
    },
  ];

  const remainingUnits = stats.totalRequired - stats.totalCompleted;
  const semestersLeft = Math.ceil(remainingUnits / 15); // ~15 units/semester

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-[#CC0000]" />
        <h2 className="text-gray-800">Degree Progress Overview</h2>
      </div>

      {/* Overall progress ring + stats */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-gray-100">
        <div className="relative flex-shrink-0">
          <RadialProgress percent={stats.percent} size={110} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[#CC0000]" style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
              {stats.percent}%
            </span>
            <span className="text-gray-400" style={{ fontSize: "0.65rem" }}>Complete</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1 w-full">
          <div className="bg-green-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-700" style={{ fontSize: "0.72rem", fontWeight: 600 }}>COMPLETED</span>
            </div>
            <div className="text-gray-800" style={{ fontSize: "1.4rem", fontWeight: 700 }}>{stats.totalCompleted}</div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem" }}>Units earned</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600" style={{ fontSize: "0.72rem", fontWeight: 600 }}>REMAINING</span>
            </div>
            <div className="text-gray-800" style={{ fontSize: "1.4rem", fontWeight: 700 }}>{remainingUnits}</div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem" }}>Units left</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700" style={{ fontSize: "0.72rem", fontWeight: 600 }}>ESTIMATED</span>
            </div>
            <div className="text-gray-800" style={{ fontSize: "1.4rem", fontWeight: 700 }}>{semestersLeft}</div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem" }}>Semesters left</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span style={{ fontSize: "0.9rem" }}>🎓</span>
              <span className="text-purple-700" style={{ fontSize: "0.72rem", fontWeight: 600 }}>GPA</span>
            </div>
            <div className="text-gray-800" style={{ fontSize: "1.4rem", fontWeight: 700 }}>{student.gpa.toFixed(2)}</div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem" }}>Cumulative</div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const pct = Math.min(100, Math.round((cat.completed / cat.required) * 100));
          return (
            <div key={cat.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "0.9rem" }}>{cat.icon}</span>
                  <span className="text-gray-700" style={{ fontSize: "0.82rem", fontWeight: 500 }}>{cat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: cat.color, fontSize: "0.82rem", fontWeight: 600 }}>
                    {cat.completed}/{cat.required}
                  </span>
                  <span className="text-gray-400" style={{ fontSize: "0.72rem" }}>units</span>
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{
                      backgroundColor: `${cat.color}15`,
                      color: cat.color,
                      fontSize: "0.68rem",
                      fontWeight: 600,
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
              <BarProgress value={cat.completed} max={cat.required} color={cat.color} />
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
        <div className="text-xs text-gray-400">
          Catalog Year: <span className="text-gray-600 font-medium">{student.catalog_year}</span>
        </div>
        <span className="text-gray-200">·</span>
        <div className="text-xs text-gray-400">
          Advisor: <span className="text-gray-600 font-medium">{student.advisor}</span>
        </div>
      </div>
    </div>
  );
}
