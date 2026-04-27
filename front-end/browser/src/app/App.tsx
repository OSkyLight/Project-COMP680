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
import { Recommendations } from "./components/Recommendations";
import { BackendDemoPanel } from "./components/BackendDemoPanel";
import { PdfRecommendations } from "./components/PdfRecommendations";
import {
  Brain,
  LayoutDashboard,
  FileText,
} from "lucide-react";

type Tab = "dashboard" | "pdf";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
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
