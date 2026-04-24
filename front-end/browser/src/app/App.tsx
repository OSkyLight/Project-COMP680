import { useState } from "react";
import type { Student } from "./types/student";

export interface PdfStudentInfo {
  student_name: string;
  student_id: string;
  degree_program: string;
}
import { Header } from "./components/Header";
import { ProgressOverview } from "./components/ProgressOverview";
import { StudentProfile } from "./components/StudentProfile";
import { UnmetRequirements } from "./components/UnmetRequirements";
import { Recommendations } from "./components/Recommendations";
import { CompletedCourses } from "./components/CompletedCourses";
import { PrerequisiteGraph } from "./components/PrerequisiteGraph";
import { BackendDemoPanel } from "./components/BackendDemoPanel";
import { PdfRecommendations } from "./components/PdfRecommendations";
import {
  Brain,
  LayoutDashboard,
  AlertTriangle,
  CheckCircle2,
  Share2,
  FileText,
} from "lucide-react";

type Tab = "dashboard" | "unmet" | "completed" | "prereq" | "pdf";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "unmet", label: "Unmet Requirements", icon: AlertTriangle },
  { id: "completed", label: "Completed Courses", icon: CheckCircle2 },
  { id: "prereq", label: "Prerequisite Map", icon: Share2 },
  { id: "pdf", label: "PDF Recommendations", icon: FileText },
];

function lsGetStudent(): Student | null {
  try {
    const v = localStorage.getItem("demo_student");
    return v ? (JSON.parse(v) as Student) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [currentStudent, setCurrentStudent] = useState<Student | null>(lsGetStudent);
  const [pdfStudent, setPdfStudent] = useState<PdfStudentInfo | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header pdfStudent={pdfStudent} />

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? "border-[#CC0000] text-[#CC0000]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                style={{ fontSize: "0.85rem", fontWeight: activeTab === id ? 600 : 400 }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Dashboard ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <BackendDemoPanel currentStudent={currentStudent} onStudentChange={setCurrentStudent} />
            {/* Top row: profile + progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <StudentProfile currentStudent={currentStudent} />
              </div>
              <div className="lg:col-span-2">
                <ProgressOverview currentStudent={currentStudent} />
              </div>
            </div>

            {/* AI Recommendations (full width) */}
            <div>
              <Recommendations />
            </div>

            {/* Tip banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-6 text-white">
              <div className="flex items-start gap-4">
                <Brain className="w-8 h-8 text-red-200 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>
                    How AI Recommendations Work
                  </div>
                  <p className="text-red-100" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                    The system analyzes your completed courses, identifies unmet degree requirements, verifies
                    prerequisite chains, and ranks available courses using a multi-factor urgency score.
                    Factors include: number of requirements satisfied, courses unlocked, scheduling availability,
                    and how close a requirement group is to being completed.
                    Courses you're not yet eligible for (missing prerequisites) are automatically excluded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Unmet Requirements ── */}
        {activeTab === "unmet" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <StudentProfile currentStudent={currentStudent} />
              </div>
              <div className="lg:col-span-2">
                <ProgressOverview currentStudent={currentStudent} />
              </div>
            </div>
            <UnmetRequirements />
          </div>
        )}

        {/* ── Completed Courses ── */}
        {activeTab === "completed" && (
          <div className="space-y-6">
            <CompletedCourses />
          </div>
        )}

        {/* ── Prerequisite Map ── */}
        {activeTab === "prereq" && (
          <div className="space-y-6">
            <PrerequisiteGraph />
          </div>
        )}

        {/* ── PDF Recommendations ── */}
        {activeTab === "pdf" && (
          <div className="space-y-6">
            <PdfRecommendations onPdfResult={setPdfStudent} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-gray-400" style={{ fontSize: "0.78rem" }}>
            <Brain className="w-3.5 h-3.5" />
            <span>AI-Assisted Degree Audit · CSUN Computer Science</span>
          </div>
          <div className="text-gray-300" style={{ fontSize: "0.72rem" }}>
            Demo system using sample data · Not affiliated with official CSUN systems
          </div>
        </div>
      </footer>
    </div>
  );
}
