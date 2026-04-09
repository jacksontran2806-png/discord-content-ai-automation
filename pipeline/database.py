"""
database.py — All SQLite operations. Single source of truth for post state.
"""

import sqlite3
from datetime import datetime, timezone, timedelta
from typing import Optional

VN_TZ = timezone(timedelta(hours=7))


def now_vn() -> str:
    return datetime.now(VN_TZ).isoformat(timespec="seconds")

DB_PATH = "posts.db"


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create the posts table if it doesn't exist."""
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS posts (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                topic         TEXT    NOT NULL,
                content       TEXT    NOT NULL,
                platform      TEXT    NOT NULL DEFAULT 'discord',
                scheduled_time TEXT   NOT NULL,
                status        TEXT    NOT NULL DEFAULT 'draft',
                error         TEXT,
                created_at    TEXT    DEFAULT CURRENT_TIMESTAMP
            )
        """)


def insert_post(
    topic: str,
    content: str,
    platform: str,
    scheduled_time: str,
    status: str = "scheduled",
) -> int:
    """Insert a new post and return its ID."""
    with get_conn() as conn:
        cursor = conn.execute(
            """INSERT INTO posts (topic, content, platform, scheduled_time, status)
               VALUES (?, ?, ?, ?, ?)""",
            (topic, content, platform, scheduled_time, status),
        )
        return cursor.lastrowid


def get_due_posts() -> list:
    """Return all scheduled posts whose scheduled_time has passed."""
    now = now_vn()
    with get_conn() as conn:
        return conn.execute(
            "SELECT * FROM posts WHERE status = 'scheduled' AND scheduled_time <= ?",
            (now,),
        ).fetchall()


def get_failed_posts() -> list:
    """Return all posts marked as failed."""
    with get_conn() as conn:
        return conn.execute(
            "SELECT * FROM posts WHERE status = 'failed' ORDER BY scheduled_time"
        ).fetchall()


def get_all_posts(status: Optional[str] = None) -> list:
    """Return posts, optionally filtered by status, newest first."""
    with get_conn() as conn:
        if status:
            return conn.execute(
                "SELECT * FROM posts WHERE status = ? ORDER BY scheduled_time DESC",
                (status,),
            ).fetchall()
        return conn.execute(
            "SELECT * FROM posts ORDER BY scheduled_time DESC"
        ).fetchall()


def update_status(post_id: int, status: str, error: Optional[str] = None) -> None:
    """Update a post's status and optionally record an error message."""
    with get_conn() as conn:
        conn.execute(
            "UPDATE posts SET status = ?, error = ? WHERE id = ?",
            (status, error, post_id),
        )
