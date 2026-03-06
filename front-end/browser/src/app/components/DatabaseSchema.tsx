import { useEffect, useState } from "react";
import { Database, Key, Link } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

interface ColumnInfo {
  cid: number;
  name: string;
  type: string;
  not_null: boolean;
  default_value: string | null;
  primary_key: boolean;
}

interface ForeignKey {
  id: number;
  seq: number;
  table: string;
  from_column: string;
  to_column: string;
  on_update: string;
  on_delete: string;
}

interface TableSchema {
  table_name: string;
  columns: ColumnInfo[];
  foreign_keys: ForeignKey[];
}

interface DatabaseSchemaData {
  tables: TableSchema[];
}

export function DatabaseSchema() {
  const [schema, setSchema] = useState<DatabaseSchemaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/schema`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<DatabaseSchemaData>;
      })
      .then((data) => {
        setSchema(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-[#CC0000]" />
          <h2 className="text-gray-800">Database Schema</h2>
        </div>
        <p className="text-gray-400" style={{ fontSize: "0.85rem" }}>Loading schema…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-[#CC0000]" />
          <h2 className="text-gray-800">Database Schema</h2>
        </div>
        <p className="text-red-500" style={{ fontSize: "0.85rem" }}>
          Failed to load schema: {error}. Make sure the backend is running.
        </p>
      </div>
    );
  }

  const tables = schema?.tables ?? [];

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-5 h-5 text-[#CC0000]" />
          <h2 className="text-gray-800">Database Schema</h2>
          <span
            className="ml-1 bg-red-50 text-[#CC0000] border border-red-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {tables.length} {tables.length === 1 ? "table" : "tables"}
          </span>
        </div>
        <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>
          Live introspection of the SQLite database used by this application.
        </p>
      </div>

      {/* One card per table */}
      {tables.map((table) => (
        <div
          key={table.table_name}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          {/* Table title */}
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-[#CC0000]" />
            <h3
              className="text-gray-900 font-mono"
              style={{ fontSize: "1rem", fontWeight: 600 }}
            >
              {table.table_name}
            </h3>
            <span className="text-gray-400" style={{ fontSize: "0.75rem" }}>
              {table.columns.length} column{table.columns.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Columns table */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Column", "Type", "Constraints"].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-2 pr-4 text-gray-500"
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {table.columns.map((col) => {
                  const constraints: string[] = [];
                  if (col.primary_key) constraints.push("PRIMARY KEY");
                  if (col.not_null && !col.primary_key) constraints.push("NOT NULL");
                  if (col.default_value != null)
                    constraints.push(`DEFAULT ${col.default_value}`);

                  return (
                    <tr key={col.cid} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-1.5">
                          {col.primary_key && (
                            <Key className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          )}
                          <span
                            className="font-mono text-gray-800"
                            style={{ fontSize: "0.83rem", fontWeight: col.primary_key ? 600 : 400 }}
                          >
                            {col.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className="bg-blue-50 text-blue-700 rounded px-1.5 py-0.5 font-mono"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {col.type || "—"}
                        </span>
                      </td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-1">
                          {constraints.length === 0 ? (
                            <span className="text-gray-300" style={{ fontSize: "0.78rem" }}>—</span>
                          ) : (
                            constraints.map((c) => (
                              <span
                                key={c}
                                className={`rounded px-1.5 py-0.5 ${
                                  c === "PRIMARY KEY"
                                    ? "bg-amber-50 text-amber-700"
                                    : c === "NOT NULL"
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-purple-50 text-purple-700"
                                }`}
                                style={{ fontSize: "0.72rem", fontWeight: 500 }}
                              >
                                {c}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Foreign keys */}
          {table.foreign_keys.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 mb-2">
                <Link className="w-3.5 h-3.5 text-gray-400" />
                <span
                  className="text-gray-500"
                  style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
                >
                  Foreign Keys
                </span>
              </div>
              <div className="space-y-1">
                {table.foreign_keys.map((fk) => (
                  <div
                    key={`${fk.id}-${fk.seq}`}
                    className="flex items-center gap-1.5 text-gray-600 font-mono"
                    style={{ fontSize: "0.78rem" }}
                  >
                    <span className="text-gray-800">{fk.from_column}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-[#CC0000]">{fk.table}</span>
                    <span className="text-gray-400">({fk.to_column})</span>
                    {fk.on_delete && fk.on_delete !== "NO ACTION" && (
                      <span className="text-gray-400">ON DELETE {fk.on_delete}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {tables.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-gray-400" style={{ fontSize: "0.85rem" }}>
            No tables found in the database.
          </p>
        </div>
      )}
    </div>
  );
}
