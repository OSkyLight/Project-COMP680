import os
from sqlalchemy import text
from .db import engine

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # back-end/
SQL_DIR = os.path.join(BASE_DIR, "sql")
SCHEMA_PATH = os.path.join(SQL_DIR, "schema.sql")
SEED_PATH = os.path.join(SQL_DIR, "seed.sql")


def _run_sql_file(path: str):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        sql = f.read()
    statements = [s.strip() for s in sql.split(";") if s.strip()]
    with engine.begin() as conn:
        for stmt in statements:
            conn.execute(text(stmt))


def ensure_db_initialized():
    # Create schema (drops old tables if your schema.sql includes DROP TABLE)
    _run_sql_file(SCHEMA_PATH)

    # optional seed: only run once
    with engine.begin() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS seed_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        """))
        current = conn.execute(text("SELECT value FROM seed_meta WHERE key='seed_version'")).scalar()

    if current is None and os.path.exists(SEED_PATH):
        _run_sql_file(SEED_PATH)