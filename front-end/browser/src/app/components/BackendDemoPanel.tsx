import { useState, useEffect } from "react";
import type { Student } from "../types/student";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
  units: number;
  day: string;
  start_time: string;
  end_time: string;
  instructor: string;
  mode: string;
}

interface PlanCourseItem {
  course_id: number;
  course_code: string;
  course_name: string;
  units: number;
  day: string;
  start_time: string;
  end_time: string;
}

interface PlanResponse {
  student_id: number;
  recommended: PlanCourseItem[];
  reasoning: string[];
}

const LS = {
  health: "demo_health",
  courses: "demo_courses",
  student: "demo_student",
  plan: "demo_plan",
  planSavedAt: "demo_plan_saved_at",
  collapsed: "demo_collapsed",
  dbTable: "demo_db_table",
  dbRows: "demo_db_rows",
};

function lsGet<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function lsSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded */ }
}

function lsClear(...keys: string[]) {
  keys.forEach((k) => localStorage.removeItem(k));
}

interface BackendDemoPanelProps {
  currentStudent: Student | null;
  onStudentChange: (s: Student | null) => void;
}

export function BackendDemoPanel({ currentStudent, onStudentChange }: BackendDemoPanelProps) {
  // --- collapse ---
  const [collapsed, setCollapsed] = useState<boolean>(() => lsGet<boolean>(LS.collapsed) ?? false);

  function toggleCollapse() {
    setCollapsed((v) => { lsSet(LS.collapsed, !v); return !v; });
  }

  // --- health ---
  const [health, setHealth] = useState<string | null>(() => lsGet<string>(LS.health));
  const [healthError, setHealthError] = useState<string | null>(null);
  const backendOnline = healthError === null && health !== null;

  // --- courses ---
  const [courses, setCourses] = useState<Course[] | null>(() => lsGet<Course[]>(LS.courses));
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // --- create student ---
  const [name, setName] = useState("");
  const [degree, setDegree] = useState("");
  const [studentResult, setStudentResult] = useState<Record<string, unknown> | null>(
    () => lsGet<Record<string, unknown>>(LS.student)
  );
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);

  // --- student picker ---
  const [studentsList, setStudentsList] = useState<Student[] | null>(null);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // --- plan ---
  const savedStudentId = lsGet<Record<string, unknown>>(LS.student)?.student_id;
  const [planStudentId, setPlanStudentId] = useState<string>(
    currentStudent?.student_id != null
      ? String(currentStudent.student_id)
      : savedStudentId != null ? String(savedStudentId) : ""
  );
  const [planResult, setPlanResult] = useState<PlanResponse | null>(() => lsGet<PlanResponse>(LS.plan));
  const [planSavedAt, setPlanSavedAt] = useState<string | null>(() => lsGet<string>(LS.planSavedAt));
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  // --- db viewer ---
  const [dbTables, setDbTables] = useState<string[]>([]);
  const [dbTablesLoading, setDbTablesLoading] = useState(false);
  const [dbTablesError, setDbTablesError] = useState<string | null>(null);
  const [dbSelectedTable, setDbSelectedTable] = useState<string>(() => lsGet<string>(LS.dbTable) ?? "");
  const [dbRows, setDbRows] = useState<Record<string, unknown>[] | null>(() => lsGet<Record<string, unknown>[]>(LS.dbRows));
  const [dbRowsLoading, setDbRowsLoading] = useState(false);
  const [dbRowsError, setDbRowsError] = useState<string | null>(null);

  // auto-fetch health on mount
  useEffect(() => {
    fetch("/api/health")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((json) => { const s = JSON.stringify(json); setHealth(s); setHealthError(null); lsSet(LS.health, s); })
      .catch((e) => setHealthError(String(e)));
  }, []);

  // sync planStudentId when current student changes
  useEffect(() => {
    if (currentStudent?.student_id != null) setPlanStudentId(String(currentStudent.student_id));
  }, [currentStudent]);

  function clearDemoData() {
    lsClear(LS.health, LS.courses, LS.student, LS.plan, LS.planSavedAt);
    setHealth(null);
    setHealthError(null);
    setCourses(null);
    setCoursesError(null);
    setStudentResult(null);
    setStudentError(null);
    setName("");
    setDegree("");
    setPlanResult(null);
    setPlanSavedAt(null);
    setPlanError(null);
    setPlanStudentId("");
    onStudentChange(null);
    lsClear(LS.dbTable, LS.dbRows);
    setDbTables([]);
    setDbSelectedTable("");
    setDbRows(null);
    setDbRowsError(null);
    setDbTablesError(null);
  }

  function loadDbTables() {
    setDbTablesLoading(true);
    setDbTablesError(null);
    fetch("/api/debug/tables")
      .then((r) => { if (!r.ok) throw new Error(`GET /api/debug/tables returned HTTP ${r.status}`); return r.json(); })
      .then((json: string[]) => setDbTables(json))
      .catch((e) => setDbTablesError(String(e)))
      .finally(() => setDbTablesLoading(false));
  }

  function loadDbRows() {
    if (!dbSelectedTable) { setDbRowsError("Select a table first."); return; }
    setDbRowsLoading(true);
    setDbRowsError(null);
    fetch(`/api/debug/table/${encodeURIComponent(dbSelectedTable)}?limit=25`)
      .then((r) => { if (!r.ok) throw new Error(`GET /api/debug/table/${dbSelectedTable} returned HTTP ${r.status}`); return r.json(); })
      .then((json: Record<string, unknown>[]) => {
        setDbRows(json);
        lsSet(LS.dbRows, json);
        lsSet(LS.dbTable, dbSelectedTable);
      })
      .catch((e) => setDbRowsError(String(e)))
      .finally(() => setDbRowsLoading(false));
  }

  function loadCourses() {
    setCoursesLoading(true);
    setCoursesError(null);
    fetch("/api/courses")
      .then((r) => { if (!r.ok) throw new Error(`GET /api/courses returned HTTP ${r.status}`); return r.json(); })
      .then((json: Course[]) => { setCourses(json); lsSet(LS.courses, json.slice(0, 20)); })
      .catch((e) => setCoursesError(String(e)))
      .finally(() => setCoursesLoading(false));
  }

  function loadStudents() {
    setStudentsLoading(true);
    setStudentsError(null);
    fetch("/api/students")
      .then((r) => { if (!r.ok) throw new Error(`GET /api/students returned HTTP ${r.status}`); return r.json(); })
      .then((json: Student[]) => setStudentsList(json))
      .catch((e) => setStudentsError(String(e)))
      .finally(() => setStudentsLoading(false));
  }

  function selectStudent(id: string) {
    setSelectedStudentId(id);
    if (!id) return;
    const found = studentsList?.find((s) => String(s.student_id) === id) ?? null;
    if (found) {
      onStudentChange(found);
      lsSet(LS.student, found);
    }
  }

  function createStudent(e: React.FormEvent) {
    e.preventDefault();
    setStudentLoading(true);
    setStudentError(null);
    setStudentResult(null);
    fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, degree }),
    })
      .then((r) => { if (!r.ok) throw new Error(`POST /api/students returned HTTP ${r.status}`); return r.json(); })
      .then((json: Record<string, unknown>) => {
        setStudentResult(json);
        lsSet(LS.student, json);
        onStudentChange(json as unknown as Student);
      })
      .catch((e) => setStudentError(String(e)))
      .finally(() => setStudentLoading(false));
  }

  // Covers every course day pattern that exists in the DB
  const FREETIME_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Mon/Wed", "Tue/Thu"];

  async function ensureFreetime(student_id: number): Promise<void> {
    const existing = await fetch(`/api/freetime?student_id=${student_id}`)
      .then((r) => r.ok ? r.json() : [])
      .catch(() => []);
    if ((existing as unknown[]).length > 0) return;
    await Promise.all(
      FREETIME_DAYS.map((day) =>
        fetch("/api/freetime", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id, day, start_time: "07:00", end_time: "22:00" }),
        })
      )
    );
  }

  async function runPlan() {
    const idStr = currentStudent ? String(currentStudent.student_id) : planStudentId;
    if (idStr.trim() === "") { setPlanError("Create or select a student first."); return; }
    const id = parseInt(idStr, 10);
    if (isNaN(id)) { setPlanError("Invalid student_id."); return; }
    setPlanLoading(true);
    setPlanError(null);
    setPlanResult(null);
    try {
      await ensureFreetime(id);
      const r = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: id, prefer_missing_only: true }),
      });
      if (!r.ok) throw new Error(`POST /api/plan returned HTTP ${r.status}`);
      const json: PlanResponse = await r.json();
      const ts = new Date().toLocaleString();
      setPlanResult(json); setPlanSavedAt(ts);
      lsSet(LS.plan, json); lsSet(LS.planSavedAt, ts);
    } catch (e) {
      setPlanError(String(e));
    } finally {
      setPlanLoading(false);
    }
  }

  return (
    <Card className="shadow-sm">
      {/* ── Card Header ── */}
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2.5">
          <CardTitle className="text-base font-semibold text-gray-800">Backend Demo</CardTitle>
          {healthError ? (
            <Badge variant="destructive" className="text-xs">Offline</Badge>
          ) : health ? (
            <Badge className="text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Connected</Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-gray-400">Checking…</Badge>
          )}
        </div>
        <CardAction className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDemoData}
            className="text-xs text-gray-400 hover:text-red-500 h-7 px-2"
          >
            Clear demo data
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="text-xs text-gray-400 h-7 px-2"
          >
            {collapsed ? "Expand ▶" : "Collapse ▼"}
          </Button>
        </CardAction>
      </CardHeader>

      {!collapsed && (
        <CardContent className="pt-5 space-y-5">

          {/* ── Section 1: Backend Status ── */}
          <section className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Backend Status</p>
            {healthError ? (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
                <span className="font-semibold">Backend Offline</span>
                <span className="text-red-500 ml-2 font-normal">{healthError}</span>
                {health && (
                  <span className="block text-xs text-gray-400 mt-0.5">Last known: <code>{health}</code></span>
                )}
              </div>
            ) : (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-sm text-green-800 flex items-center gap-3">
                <span className="font-medium">GET /api/health</span>
                <code className="text-green-700 font-mono">{health ?? "…"}</code>
              </div>
            )}
          </section>

          <Separator />

          {/* ── Section 2: Data ── */}
          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Data</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={loadCourses} disabled={coursesLoading}>
                {coursesLoading ? "Loading…" : "Load Courses"}
              </Button>
              {courses && (
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">{courses.length}</span> courses total
                </span>
              )}
            </div>
            {coursesError && (
              <p className="text-xs text-red-500"><span className="font-semibold">GET /api/courses</span> — {coursesError}</p>
            )}
            {courses && courses.length > 0 && (
              <ScrollArea className="h-44 rounded-md border border-gray-100 bg-gray-50">
                <ul className="p-3 space-y-1.5 text-sm">
                  {courses.slice(0, 8).map((c) => (
                    <li key={c.course_id} className="flex items-baseline gap-2">
                      <code className="text-xs font-mono text-[#CC0000] w-20 shrink-0">{c.course_code}</code>
                      <span className="text-gray-700 truncate">{c.course_name}</span>
                      <span className="text-gray-400 text-xs shrink-0 ml-auto">{c.day} {c.start_time}–{c.end_time}</span>
                    </li>
                  ))}
                  {courses.length > 8 && (
                    <li className="text-xs text-gray-400 pt-1">…and {courses.length - 8} more</li>
                  )}
                </ul>
              </ScrollArea>
            )}
          </section>

          <Separator />

          {/* ── Section 3: Actions ── */}
          <section className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Actions</p>

            {/* Pick Existing Student */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">GET /api/students — pick existing</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={loadStudents} disabled={studentsLoading} className="h-8">
                  {studentsLoading ? "Loading…" : "Load Students"}
                </Button>
                {studentsList && (
                  <span className="text-xs text-gray-400">
                    {studentsList.length} student{studentsList.length !== 1 ? "s" : ""} found
                  </span>
                )}
                {studentsList && studentsList.length > 0 && (
                  <select
                    value={selectedStudentId}
                    onChange={(e) => selectStudent(e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">— choose student —</option>
                    {studentsList.map((s) => (
                      <option key={s.student_id} value={String(s.student_id)}>
                        {s.student_id} – {s.name} ({s.degree})
                      </option>
                    ))}
                  </select>
                )}
                {studentsList && studentsList.length === 0 && (
                  <span className="text-xs text-gray-400">No students in DB yet.</span>
                )}
              </div>
              {studentsError && (
                <p className="text-xs text-red-500"><span className="font-semibold">GET /api/students</span> — {studentsError}</p>
              )}
            </div>

            <Separator className="opacity-60" />

            {/* Create Student */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600">POST /api/students — create new</p>
              <form onSubmit={createStudent} className="flex flex-wrap gap-3 items-end">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-gray-500">Name</Label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="h-8 text-sm w-40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-gray-500">Degree</Label>
                  <Input
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="CS"
                    className="h-8 text-sm w-24"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={studentLoading}
                  className="bg-[#CC0000] hover:bg-red-700 text-white h-8"
                >
                  {studentLoading ? "Creating…" : "Create Student"}
                </Button>
              </form>
              {studentError && (
                <p className="text-xs text-red-500"><span className="font-semibold">POST /api/students</span> — {studentError}</p>
              )}
              {studentResult && (
                <pre className="rounded-md border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700 overflow-auto">
                  {JSON.stringify(studentResult, null, 2)}
                </pre>
              )}
            </div>

            <Separator className="opacity-60" />

            {/* Run Plan */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">POST /api/plan</p>
                {(planResult || planSavedAt) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-400 hover:text-red-500 h-6 px-2"
                    onClick={() => {
                      lsClear(LS.plan, LS.planSavedAt);
                      setPlanResult(null);
                      setPlanSavedAt(null);
                      setPlanError(null);
                    }}
                  >
                    Clear cached plan
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-gray-500">
                    student_id{currentStudent && <span className="ml-1 text-green-600">(locked to selected student)</span>}
                  </Label>
                  <Input
                    value={currentStudent ? String(currentStudent.student_id) : planStudentId}
                    readOnly={!!currentStudent}
                    onChange={(e) => { if (!currentStudent) setPlanStudentId(e.target.value); }}
                    placeholder="create or select a student first"
                    className={`h-8 text-sm w-52 ${currentStudent ? "bg-gray-50 text-gray-500 cursor-default" : ""}`}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={runPlan} disabled={planLoading} className="h-8">
                  {planLoading ? "Running…" : "Run Plan"}
                </Button>
              </div>
              {planError && (
                <p className="text-xs text-red-500"><span className="font-semibold">POST /api/plan</span> — {planError}</p>
              )}
              {planResult && (
                <div className="space-y-2">
                  {!backendOnline && planResult && (
                    <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700 font-medium">
                      Showing cached plan result (backend offline){planSavedAt ? ` · saved ${planSavedAt}` : ""}
                    </div>
                  )}
                  {backendOnline && planSavedAt && (
                    <p className="text-xs text-gray-400">Plan saved · {planSavedAt}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    Recommended: <span className="font-semibold text-gray-800">{planResult.recommended.length}</span> course(s)
                  </p>
                  {planResult.recommended.length > 0 && (
                    <ul className="space-y-1 text-sm">
                      {planResult.recommended.slice(0, 5).map((c) => (
                        <li key={c.course_id} className="flex items-baseline gap-2">
                          <code className="text-xs font-mono text-[#CC0000] w-20 shrink-0">{c.course_code}</code>
                          <span className="text-gray-700">{c.course_name}</span>
                          <span className="text-gray-400 text-xs ml-auto shrink-0">{c.day} {c.start_time}–{c.end_time}</span>
                        </li>
                      ))}
                      {planResult.recommended.length > 5 && (
                        <li className="text-xs text-gray-400">…and {planResult.recommended.length - 5} more</li>
                      )}
                    </ul>
                  )}
                  {planResult.reasoning.length > 0 && (
                    <ul className="text-xs text-gray-400 space-y-0.5 pt-1">
                      {planResult.reasoning.map((r, i) => <li key={i}>• {r}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* ── Section 4: DB Viewer ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">DB Viewer</p>
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">Demo Only</span>
            </div>

            {/* Load Tables */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={loadDbTables} disabled={dbTablesLoading} className="h-8">
                {dbTablesLoading ? "Loading…" : "Load Tables"}
              </Button>
              {dbTables.length > 0 && (
                <select
                  value={dbSelectedTable}
                  onChange={(e) => { setDbSelectedTable(e.target.value); setDbRows(null); setDbRowsError(null); }}
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">— choose table —</option>
                  {dbTables.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
              {dbSelectedTable && (
                <Button variant="outline" size="sm" onClick={loadDbRows} disabled={dbRowsLoading} className="h-8">
                  {dbRowsLoading ? "Loading…" : "Load Rows"}
                </Button>
              )}
            </div>

            {dbTablesError && (
              <p className="text-xs text-red-500"><span className="font-semibold">GET /api/debug/tables</span> — {dbTablesError}</p>
            )}
            {dbRowsError && (
              <p className="text-xs text-red-500"><span className="font-semibold">GET /api/debug/table/{dbSelectedTable}</span> — {dbRowsError}</p>
            )}

            {dbRows && dbRows.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-400">
                  Table: <span className="font-semibold text-gray-600">{dbSelectedTable}</span> · {dbRows.length} row(s) shown (max 25)
                </p>
                <ScrollArea className="h-52 rounded-md border border-gray-100 bg-gray-50">
                  <div className="p-3 overflow-x-auto">
                    <table className="text-xs w-full border-collapse">
                      <thead>
                        <tr>
                          {Object.keys(dbRows[0]).map((col) => (
                            <th key={col} className="text-left font-semibold text-gray-500 pr-4 pb-1.5 whitespace-nowrap border-b border-gray-200">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dbRows.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-100/60"}>
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="pr-4 py-1 text-gray-700 whitespace-nowrap max-w-[180px] truncate">
                                {val === null ? <span className="text-gray-300 italic">null</span> : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </div>
            )}
            {dbRows && dbRows.length === 0 && (
              <p className="text-xs text-gray-400">Table is empty.</p>
            )}
          </section>

        </CardContent>
      )}
    </Card>
  );
}
