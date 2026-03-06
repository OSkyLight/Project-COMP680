import { useState } from "react";
import { CheckCircle2, Search, ChevronUp, ChevronDown } from "lucide-react";
import { student } from "../data/degreeData";
import { courseCatalog } from "../data/degreeData";

type SortField = "id" | "semester" | "grade" | "units";

function gradeColor(grade: string) {
  if (["A", "A-"].includes(grade)) return "text-green-700 bg-green-50";
  if (["B+", "B", "B-"].includes(grade)) return "text-blue-700 bg-blue-50";
  if (["C+", "C", "C-"].includes(grade)) return "text-yellow-700 bg-yellow-50";
  if (["D"].includes(grade)) return "text-orange-700 bg-orange-50";
  if (["F"].includes(grade)) return "text-red-700 bg-red-50";
  return "text-gray-600 bg-gray-50";
}

function gradeToGPA(grade: string): number {
  const map: Record<string, number> = {
    A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7,
    "C+": 2.3, C: 2.0, "C-": 1.7, D: 1.0, F: 0.0,
  };
  return map[grade] ?? 0;
}

export function CompletedCourses() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("semester");
  const [sortAsc, setSortAsc] = useState(true);

  const courses = student.completed_courses
    .filter((c) => {
      const catalog = courseCatalog.find((cc) => cc.id === c.id);
      const name = catalog?.name ?? "";
      const q = search.toLowerCase();
      return c.id.toLowerCase().includes(q) || name.toLowerCase().includes(q) || c.semester.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "id") cmp = a.id.localeCompare(b.id);
      else if (sortField === "grade") cmp = gradeToGPA(b.grade) - gradeToGPA(a.grade);
      else if (sortField === "units") cmp = a.units - b.units;
      else cmp = a.semester.localeCompare(b.semester);
      return sortAsc ? cmp : -cmp;
    });

  function toggleSort(field: SortField) {
    if (sortField === field) setSortAsc((a) => !a);
    else { setSortField(field); setSortAsc(true); }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="w-4 h-4 opacity-30">↕</span>;
    return sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <h2 className="text-gray-800">Completed Courses</h2>
          <span className="ml-1 bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-0.5 text-xs font-medium">
            {student.completed_courses.length} courses · {student.units_completed} units
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 w-48"
            style={{ fontSize: "0.82rem" }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {(
                [
                  { label: "Course ID", field: "id" },
                  { label: "Course Name", field: null },
                  { label: "Semester", field: "semester" },
                  { label: "Grade", field: "grade" },
                  { label: "Units", field: "units" },
                ] as { label: string; field: SortField | null }[]
              ).map(({ label, field }) => (
                <th
                  key={label}
                  onClick={() => field && toggleSort(field)}
                  className={`text-left pb-3 pr-4 text-gray-500 select-none ${field ? "cursor-pointer hover:text-gray-800" : ""}`}
                  style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {field && <SortIcon field={field} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {courses.map((c) => {
              const catalog = courseCatalog.find((cc) => cc.id === c.id);
              return (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-2.5 pr-4">
                    <span className="text-gray-800 font-medium" style={{ fontSize: "0.83rem" }}>
                      {c.id}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-600" style={{ fontSize: "0.83rem" }}>
                    {catalog?.name ?? "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500" style={{ fontSize: "0.82rem" }}>
                    {c.semester}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={`rounded-lg px-2 py-0.5 ${gradeColor(c.grade)}`} style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      {c.grade}
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-500" style={{ fontSize: "0.82rem" }}>
                    {c.units}
                  </td>
                </tr>
              );
            })}
            {courses.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400" style={{ fontSize: "0.85rem" }}>
                  No courses match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
