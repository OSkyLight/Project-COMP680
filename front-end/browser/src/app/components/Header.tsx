import { GraduationCap, Brain, ChevronRight } from "lucide-react";
import { student } from "../data/degreeData";
import type { PdfStudentInfo } from "../App";

interface HeaderProps {
  pdfStudent?: PdfStudentInfo | null;
}

interface InfoBox {
  value: string;
  label: string;
}

export function Header({ pdfStudent }: HeaderProps) {
  const boxes: InfoBox[] = pdfStudent
    ? [
        { value: pdfStudent.student_name, label: "Student" },
        { value: pdfStudent.student_id || "N/A", label: "Student ID" },
        { value: pdfStudent.degree_program || "N/A", label: "Program" },
        { value: "N/A", label: "Current Semester" },
      ]
    : [
        { value: student.name.split(" ")[0], label: "Student" },
        { value: student.gpa.toFixed(2), label: "GPA" },
        { value: student.standing, label: "Standing" },
        { value: student.current_semester, label: "Current Semester" },
      ];

  const breadcrumb = pdfStudent ? pdfStudent.degree_program || "—" : student.major;

  function valueFontSize(value: string): string {
    if (value.length <= 12) return "1.1rem";
    if (value.length <= 24) return "0.88rem";
    return "0.75rem";
  }

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
              <span>{breadcrumb}</span>
            </div>
            <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
              AI Degree Audit & Course Planner
            </h1>
            <p className="text-red-200 mt-1" style={{ fontSize: "0.85rem" }}>
              Intelligent course recommendations based on your academic history
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {boxes.map((box) => (
              <div key={box.label} className="bg-red-700/60 rounded-xl px-4 py-2 text-center min-w-[100px] max-w-[220px]">
                <div
                  className="text-white leading-tight break-words"
                  style={{ fontSize: valueFontSize(box.value), fontWeight: 700 }}
                >
                  {box.value}
                </div>
                <div className="text-red-200 mt-0.5" style={{ fontSize: "0.7rem" }}>{box.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
