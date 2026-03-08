import os
import sqlite3
from .db import DATABASE_URL

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # back-end/
SQL_DIR = os.path.join(BASE_DIR, "sql")
SCHEMA_PATH = os.path.join(SQL_DIR, "schema.sql")
SEED_PATH = os.path.join(SQL_DIR, "seed.sql")

# sqlite:///./app.db  -> ./app.db
DB_FILE = DATABASE_URL.replace("sqlite:///./", "")

SEED_VERSION = "1"  # bump when seed.sql changes


def _exec_sql_file(conn: sqlite3.Connection, path: str):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        sql = f.read()
    conn.executescript(sql)


def ensure_db_initialized():
    first_time = not os.path.exists(DB_FILE)

    conn = sqlite3.connect(DB_FILE)
    try:
        conn.execute("PRAGMA foreign_keys = ON;")

        # always ensure seed_meta exists
        conn.execute("""
            CREATE TABLE IF NOT EXISTS seed_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
        """)
        conn.commit()

        current = conn.execute(
            "SELECT value FROM seed_meta WHERE key='seed_version'"
        ).fetchone()
        current_version = current[0] if current else None

        # Create schema only once (or when db missing)
        if first_time:
            _exec_sql_file(conn, SCHEMA_PATH)

        # Seed only if version changed or first time
        if (current_version != SEED_VERSION) and os.path.exists(SEED_PATH):
            _exec_sql_file(conn, SEED_PATH)
            conn.execute(
                "INSERT OR REPLACE INTO seed_meta(key, value) VALUES('seed_version', ?)",
                (SEED_VERSION,)
            )
            conn.commit()

    finally:
        conn.close()