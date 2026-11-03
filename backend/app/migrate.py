"""
Database Migration Runner for Krishi Saarthi.
Executes Alembic migrations programmatically during production startup.
"""
import os
import sys
from pathlib import Path
from alembic import command
from alembic.config import Config

ROOT_DIR = Path(__file__).resolve().parent.parent.parent

def run_db_migrations():
    alembic_ini_path = ROOT_DIR / "alembic.ini"
    if not alembic_ini_path.exists():
        print(f"[Alembic] alembic.ini not found at {alembic_ini_path}")
        return

    print(f"[Alembic] Running database migrations (upgrade head)...")
    alembic_cfg = Config(str(alembic_ini_path))
    alembic_cfg.set_main_option("script_location", str(ROOT_DIR / "alembic"))
    
    try:
        command.upgrade(alembic_cfg, "head")
        print("[Alembic] Migrations completed successfully.")
    except Exception as e:
        print(f"[Alembic] Migration notice: {e} (Continuing with application startup)")

if __name__ == "__main__":
    run_db_migrations()
