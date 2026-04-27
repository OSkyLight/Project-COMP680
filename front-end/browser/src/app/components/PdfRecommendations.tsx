import { useState, useRef } from "react";
import { UploadCloud, Loader2, AlertCircle, FileText, CheckCircle2, GraduationCap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import type { PdfStudentInfo } from "../App";
import { apiUrl } from "../utils/api";

interface RecommendedCourse {
  course_id: number;
  course_code: string;
  course_name: string;
  units: number;
  day: string;
  start_time: string;
  end_time: string;
  instructor: string | null;
  mode: string;
  reason?: string;
}

interface DegreeProgress {
  completed_required_core: string[];
  missing_required_core: string[];
  completed_lower_division_major: string[];
  missing_lower_division_major: string[];
  life_science_requirement_satisfied: boolean;
  physical_science_requirement_satisfied: boolean;
  completed_science_requirements: string[];
  missing_science_requirements: string[];
  completed_senior_electives: string[];
  senior_elective_units_completed: number;
  senior_elective_units_remaining: number;
  notes: string[];
}

interface PdfResult {
  filename: string;
  student_name: string;
  student_id: string;
  degree_program: string;
  excluded_course_codes: string[];
  recommended: RecommendedCourse[];
  reasoning: string[];
  degree_progress?: DegreeProgress;
}

interface CourseSection {
  course_id: number;
  day: string;
  start_time: string;
  end_time: string;
  instructor: string | null;
  mode: string;
}

interface GroupedCourse {
  course_code: string;
  course_name: string;
  units: number;
  reason?: string;
  sections: CourseSection[];
}

function groupByCourseCode(courses: RecommendedCourse[]): GroupedCourse[] {
  const map = new Map<string, GroupedCourse>();
  for (const c of courses) {
    if (!map.has(c.course_code)) {
      map.set(c.course_code, {
        course_code: c.course_code,
        course_name: c.course_name,
        units: c.units,
        reason: c.reason,
        sections: [],
      });
    }
    map.get(c.course_code)!.sections.push({
      course_id: c.course_id,
      day: c.day,
      start_time: c.start_time,
      end_time: c.end_time,
      instructor: c.instructor,
      mode: c.mode,
    });
  }
  return Array.from(map.values());
}

interface PdfRecommendationsProps {
  onPdfResult?: (info: PdfStudentInfo) => void;
}

export function PdfRecommendations({ onPdfResult }: PdfRecommendationsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PdfResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
    setResult(null);
  }

  async function handleUpload() {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(apiUrl("/api/recommend-from-pdf"), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: HTTP ${response.status}`);
      }

      const data = await response.json();

      if ("error" in data) {
        throw new Error(data.error as string);
      }

      setResult(data as PdfResult);
      onPdfResult?.({
        student_name: data.student_name,
        student_id: data.student_id,
        degree_program: data.degree_program,
      });
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <UploadCloud className="w-5 h-5 text-[#CC0000]" />
            Upload Progress Report PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-[#CC0000] hover:text-[#CC0000] transition-colors"
            >
              <FileText className="w-4 h-4" />
              {file ? file.name : "Choose PDF file"}
            </label>
            <input
              id="pdf-upload"
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="flex items-center gap-2 bg-[#CC0000] text-white rounded-lg px-5 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Get Recommendations
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Accepts PDF progress reports only. The file is sent to the backend for AI extraction.
          </p>
        </CardContent>
      </Card>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Student summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Extracted Student Info
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <InfoRow label="File" value={result.filename} />
                <InfoRow label="Student Name" value={result.student_name} />
                <InfoRow label="Student ID" value={result.student_id} />
                <InfoRow label="Degree Program" value={result.degree_program} />
              </div>
            </CardContent>
          </Card>

          {/* Degree Progress Summary */}
          {result.degree_progress && (
            <DegreeProgressCard dp={result.degree_progress} />
          )}

          {/* Reasoning */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800 text-base">
                How Recommendations Were Made
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-1">
                {result.reasoning.map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#CC0000] flex-shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recommended courses */}
          {(() => {
            const grouped = groupByCourseCode(result.recommended);
            return (
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-800">
                    Recommended Courses
                    <span className="ml-2 text-sm font-normal text-gray-400">
                      ({grouped.length} {grouped.length === 1 ? "course" : "courses"} ·{" "}
                      {result.recommended.length}{" "}
                      {result.recommended.length === 1 ? "section" : "sections"})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  {grouped.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      No recommendations found after filtering.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {grouped.map((group) => (
                        <GroupedCourseCard key={group.course_code} group={group} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()}
        </>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <p className="text-gray-800 font-medium">{value || "—"}</p>
    </div>
  );
}

function DegreeProgressCard({ dp }: { dp: DegreeProgress }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <GraduationCap className="w-5 h-5 text-[#CC0000]" />
          Degree Progress Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 space-y-5">
        {/* Missing Required Core */}
        <ProgressSection
          label="Missing Required Core Courses"
          items={dp.missing_required_core}
          emptyMessage="No missing required core courses detected."
        />

        {/* Missing Lower Division */}
        <ProgressSection
          label="Missing Lower Division Major Courses"
          items={dp.missing_lower_division_major}
          emptyMessage="No missing lower-division major courses detected."
        />

        {/* Science Requirements */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            Science Requirements
          </p>
          <div className="space-y-1.5">
            <ScienceRow label="Life Science" satisfied={dp.life_science_requirement_satisfied} />
            <ScienceRow label="Physical Science" satisfied={dp.physical_science_requirement_satisfied} />
          </div>
        </div>

        {/* Senior Elective Progress */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            Senior Elective Progress
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Completed</p>
              <p className="text-gray-800 font-semibold">
                {dp.senior_elective_units_completed} units
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Remaining</p>
              <p className={`font-semibold ${dp.senior_elective_units_remaining === 0 ? "text-green-600" : "text-gray-800"}`}>
                {dp.senior_elective_units_remaining === 0
                  ? "Complete"
                  : `${dp.senior_elective_units_remaining} units`}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {dp.notes.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Notes</p>
            <ul className="space-y-1">
              {dp.notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#CC0000] flex-shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProgressSection({
  label,
  items,
  emptyMessage,
}: {
  label: string;
  items: string[];
  emptyMessage: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">{label}</p>
      {items.length === 0 ? (
        <p className="flex items-center gap-1.5 text-sm text-green-600">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          {emptyMessage}
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((code) => (
            <span
              key={code}
              className="text-xs bg-red-50 text-red-700 border border-red-200 rounded-full px-2.5 py-0.5"
            >
              {code}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ScienceRow({ label, satisfied }: { label: string; satisfied: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {satisfied ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
      )}
      <span className="text-gray-600">{label}:</span>
      <span className={`font-medium ${satisfied ? "text-green-600" : "text-amber-600"}`}>
        {satisfied ? "Satisfied" : "Missing"}
      </span>
    </div>
  );
}

function GroupedCourseCard({ group }: { group: GroupedCourse }) {
  return (
    <div className="border border-gray-100 border-l-4 border-l-[#CC0000] rounded-xl p-4 hover:shadow-sm transition-shadow">
      {/* Course header */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <span className="text-xs font-semibold text-[#CC0000] uppercase tracking-wide">
            {group.course_code}
          </span>
          <p className="text-sm font-medium text-gray-800 mt-0.5">{group.course_name}</p>
          {group.reason && (
            <p className="text-xs text-gray-400 mt-0.5">{group.reason}</p>
          )}
        </div>
        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 whitespace-nowrap">
          {group.units} {group.units === 1 ? "unit" : "units"}
        </span>
      </div>

      {/* Sections */}
      <div className="mt-3 space-y-1.5">
        {group.sections.length > 1 && (
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Available Sections
          </p>
        )}
        {group.sections.map((s) => (
          <div
            key={s.course_id}
            className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2"
          >
            <span>{s.day} · {s.start_time}–{s.end_time}</span>
            {s.instructor && <span>Instructor: {s.instructor}</span>}
            <span>Mode: {s.mode}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
