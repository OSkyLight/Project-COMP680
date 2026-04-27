import { GraduationCap, Brain, ChevronRight } from "lucide-react";
import { student } from "../data/degreeData";
import type { PdfStudentInfo } from "../App";

interface HeaderProps {
  pdfStudent?: PdfStudentInfo | null;
}

export function Header({ pdfStudent }: HeaderProps) {
  const breadcrumb = pdfStudent ? pdfStudent.degree_program || "—" : student.major;

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
          </div>
        </div>
      </div>
    </header>
  );
}
