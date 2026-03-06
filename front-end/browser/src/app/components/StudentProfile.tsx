import { User, BookOpen, Award, MapPin, Calendar } from "lucide-react";
import { student } from "../data/degreeData";

export function StudentProfile() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-[#CC0000]" />
        <h2 className="text-gray-800">Student Profile</h2>
      </div>

      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white flex-shrink-0" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
          {student.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <div className="text-gray-900" style={{ fontSize: "1.05rem", fontWeight: 600 }}>{student.name}</div>
          <div className="text-gray-500" style={{ fontSize: "0.8rem" }}>Student ID: {student.id}</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <BookOpen className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Major</div>
            <div className="text-gray-800" style={{ fontSize: "0.85rem" }}>{student.major}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Award className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Concentration</div>
            <div className="text-gray-800" style={{ fontSize: "0.85rem" }}>{student.concentration}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Academic Advisor</div>
            <div className="text-gray-800" style={{ fontSize: "0.85rem" }}>{student.advisor}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Current Semester</div>
            <div className="text-gray-800" style={{ fontSize: "0.85rem" }}>{student.current_semester}</div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 gap-3">
        {[
          { label: "GPA", value: student.gpa.toFixed(2), color: "#10B981" },
          { label: "Standing", value: student.standing, color: "#3B82F6" },
          { label: "Units Done", value: student.units_completed, color: "#F59E0B" },
          { label: "Units Left", value: student.units_required - student.units_completed, color: "#CC0000" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
            <div style={{ color, fontSize: "1.2rem", fontWeight: 700 }}>{value}</div>
            <div className="text-gray-500" style={{ fontSize: "0.7rem" }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center text-gray-400" style={{ fontSize: "0.7rem" }}>
        Catalog Year: {student.catalog_year}
      </div>
    </div>
  );
}
