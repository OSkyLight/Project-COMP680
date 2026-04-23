import { User, BookOpen, Award, MapPin, Calendar } from "lucide-react";
import { student } from "../data/degreeData";
import type { Student } from "../types/student";
import { Badge } from "./ui/badge";
import { demoProfile } from "../utils/demoProfile";

interface StudentProfileProps {
  currentStudent?: Student | null;
}

export function StudentProfile({ currentStudent }: StudentProfileProps = {}) {
  const profile = currentStudent ? demoProfile(currentStudent.student_id) : null;

  const displayName = currentStudent?.name ?? student.name;
  const displayId = currentStudent?.student_id ?? student.id;
  const displayDegree = currentStudent?.degree ?? null;
  const initials = displayName.split(" ").map((n: string) => n[0]).join("");

  const major           = profile?.major            ?? student.major;
  const concentration   = profile?.concentration    ?? student.concentration;
  const advisor         = profile?.advisor          ?? student.advisor;
  const current_semester = profile?.current_semester ?? student.current_semester;
  const gpa             = profile?.gpa              ?? student.gpa;
  const standing        = profile?.standing         ?? student.standing;
  const units_completed = profile?.units_completed  ?? student.units_completed;
  const units_required  = profile?.units_required   ?? student.units_required;
  const catalog_year    = profile?.catalog_year     ?? student.catalog_year;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-[#CC0000]" />
        <h2 className="text-gray-800">Student Profile</h2>
      </div>

      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white flex-shrink-0" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
          {initials}
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-900" style={{ fontSize: "1.05rem", fontWeight: 600 }}>{displayName}</span>
            {currentStudent ? (
              <Badge className="text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Live (from backend)</Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-gray-400">Sample (static)</Badge>
            )}
          </div>
          <div className="text-gray-500" style={{ fontSize: "0.8rem" }}>Student ID: {displayId}</div>
          {displayDegree && (
            <div className="text-gray-500" style={{ fontSize: "0.8rem" }}>Degree: {displayDegree}</div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <BookOpen className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Major</div>
            <div className="text-gray-800" style={{ fontSize: "0.85rem" }}>{major}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Award className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Concentration</div>
            <div className="text-gray-800" style={{ fontSize: "0.85rem" }}>{concentration}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Academic Advisor</div>
            <div className="text-gray-800" style={{ fontSize: "0.85rem" }}>{advisor}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-gray-500" style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Current Semester</div>
            <div className="text-gray-800" style={{ fontSize: "0.85rem" }}>{current_semester}</div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 gap-3">
        {[
          { label: "GPA", value: gpa.toFixed(2), color: "#10B981" },
          { label: "Standing", value: standing, color: "#3B82F6" },
          { label: "Units Done", value: units_completed, color: "#F59E0B" },
          { label: "Units Left", value: units_required - units_completed, color: "#CC0000" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
            <div style={{ color, fontSize: "1.2rem", fontWeight: 700 }}>{value}</div>
            <div className="text-gray-500" style={{ fontSize: "0.7rem" }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center text-gray-400" style={{ fontSize: "0.7rem" }}>
        Catalog Year: {catalog_year}
      </div>
    </div>
  );
}
