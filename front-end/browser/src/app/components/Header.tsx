import { GraduationCap, Brain, ChevronRight } from "lucide-react";
import { student } from "../data/degreeData";

export function Header() {
  return (
    <header className="bg-[#CC0000] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 border-b border-red-400/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-white" />
              <div>
                <div className="text-white font-semibold tracking-wide" style={{ fontSize: "1.05rem" }}>
                  California State University, Northridge
                </div>
                <div className="text-red-200" style={{ fontSize: "0.72rem", letterSpacing: "0.05em" }}>
                  ACADEMIC PLANNING PORTAL
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-red-700/50 rounded-full px-3 py-1">
            <Brain className="w-4 h-4 text-red-200" />
            <span className="text-red-100" style={{ fontSize: "0.78rem" }}>AI-Powered Planning</span>
          </div>
        </div>

        {/* Student info bar */}
        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-red-200 mb-1" style={{ fontSize: "0.78rem" }}>
              <span>Degree Audit</span>
              <ChevronRight className="w-3 h-3" />
              <span>{student.major}</span>
            </div>
            <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
              AI Degree Audit & Course Planner
            </h1>
            <p className="text-red-200 mt-1" style={{ fontSize: "0.85rem" }}>
              Intelligent course recommendations based on your academic history
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-red-700/60 rounded-xl px-4 py-2 text-center min-w-[100px]">
              <div className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{student.name.split(" ")[0]}</div>
              <div className="text-red-200" style={{ fontSize: "0.7rem" }}>Student</div>
            </div>
            <div className="bg-red-700/60 rounded-xl px-4 py-2 text-center min-w-[100px]">
              <div className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{student.gpa.toFixed(2)}</div>
              <div className="text-red-200" style={{ fontSize: "0.7rem" }}>GPA</div>
            </div>
            <div className="bg-red-700/60 rounded-xl px-4 py-2 text-center min-w-[100px]">
              <div className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{student.standing}</div>
              <div className="text-red-200" style={{ fontSize: "0.7rem" }}>Standing</div>
            </div>
            <div className="bg-red-700/60 rounded-xl px-4 py-2 text-center min-w-[100px]">
              <div className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{student.current_semester}</div>
              <div className="text-red-200" style={{ fontSize: "0.7rem" }}>Current Semester</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
