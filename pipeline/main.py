"""
main.py — CLI entry point for the content pipeline.

Commands:
  generate <topic> [--in <minutes>] [--platform <name>]
  list [--status <status>]
  trigger
  run [--interval <seconds>]
  retry
"""

import argparse
import sys
from datetime import datetime, timedelta, timezone

VN_TZ = timezone(timedelta(hours=7))


def now_vn() -> datetime:
    return datetime.now(VN_TZ)

from dotenv import load_dotenv
load_dotenv()  # load .env before importing modules that need env vars

from database import init_db, insert_post, get_all_posts, get_failed_posts, update_status, get_conn
from generator import generate_content
from scheduler import process_due, run as run_scheduler


# ---------------------------------------------------------------------------
# Command handlers
# ---------------------------------------------------------------------------

def cmd_generate(args: argparse.Namespace) -> None:
    topic = args.topic
    delay = args.in_minutes or 0
    platform = args.platform

    print(f"\nGenerating content for: \"{topic}\"")
    result = generate_content(topic)

    scheduled_time = (now_vn() + timedelta(minutes=delay)).isoformat(timespec="seconds")
    status = "scheduled" if delay > 0 else "draft"

    post_id = insert_post(
        topic=result["topic"],
        content=result["body"],
        platform=platform,
        scheduled_time=scheduled_time,
        status=status,
    )

    print(f"Provider  : {result['provider']}")
    print(f"Post ID   : #{post_id}")
    print(f"Status    : {status}")
    if delay:
        print(f"Sends at  : {scheduled_time} UTC  ({delay} min from now)")
    print(f"\n--- Preview ---\n{result['body'][:300]}{'...' if len(result['body']) > 300 else ''}\n")


def cmd_list(args: argparse.Namespace) -> None:
    posts = get_all_posts(status=args.status)
    if not posts:
        label = f"status={args.status}" if args.status else "any status"
        print(f"No posts found ({label}).")
        return

    header = f"{'ID':<5}  {'Status':<10}  {'Platform':<10}  {'Scheduled (UTC)':<22}  Topic"
    print(f"\n{header}")
    print("-" * 75)
    for p in posts:
        scheduled = p["scheduled_time"][:19] if p["scheduled_time"] else "—"
        topic_preview = (p["topic"][:45] + "…") if len(p["topic"]) > 46 else p["topic"]
        print(f"{p['id']:<5}  {p['status']:<10}  {p['platform']:<10}  {scheduled:<22}  {topic_preview}")
        if p["error"]:
            print(f"       Error: {p['error']}")
    print()


def cmd_trigger(_args: argparse.Namespace) -> None:
    print("Running scheduler (one shot)...")
    count = process_due()
    print(f"Done. {count} post(s) sent.")


def cmd_run(args: argparse.Namespace) -> None:
    interval = args.interval
    run_scheduler(interval_seconds=interval)


def cmd_flush(_args: argparse.Namespace) -> None:
    """Reset all scheduled posts' time to now, then send them immediately."""
    now = now_vn().isoformat(timespec="seconds")
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT id, topic FROM posts WHERE status = 'scheduled'"
        ).fetchall()
        if not rows:
            print("No scheduled posts to flush.")
            return
        conn.execute(
            "UPDATE posts SET scheduled_time = ? WHERE status = 'scheduled'", (now,)
        )

    print(f"Flushing {len(rows)} scheduled post(s)...")
    count = process_due()
    print(f"Done. {count} post(s) sent.")


def cmd_retry(_args: argparse.Namespace) -> None:
    failed = get_failed_posts()
    if not failed:
        print("No failed posts to retry.")
        return

    print(f"Rescheduling {len(failed)} failed post(s) to run immediately...")
    now = datetime.utcnow().isoformat()
    for post in failed:
        update_status(post["id"], "scheduled", error=None)
        with get_conn() as conn:
            conn.execute(
                "UPDATE posts SET scheduled_time = ? WHERE id = ?",
                (now_vn().isoformat(timespec="seconds"), post["id"]),
            )
        print(f"  #{post['id']}: {post['topic']}")

    print("\nDone. Run `python main.py trigger` to send them now.")


# ---------------------------------------------------------------------------
# Argument parser
# ---------------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Content automation pipeline CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py generate "how black holes form" --in 5
  python main.py generate "why the sky is blue" --in 0      # saves as draft
  python main.py list
  python main.py list --status scheduled
  python main.py trigger
  python main.py run --interval 30
  python main.py retry
        """,
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # generate
    gen = sub.add_parser("generate", help="Generate content and schedule a post")
    gen.add_argument("topic", help="Topic to write about")
    gen.add_argument(
        "--in", dest="in_minutes", type=int, default=0, metavar="MINUTES",
        help="Schedule N minutes from now (0 saves as draft)",
    )
    gen.add_argument(
        "--platform", default="discord",
        help="Target platform (default: discord)",
    )

    # list
    ls = sub.add_parser("list", help="List posts")
    ls.add_argument(
        "--status", metavar="STATUS",
        help="Filter: draft | scheduled | posted | failed",
    )

    # trigger
    sub.add_parser("trigger", help="Send all posts that are due right now")

    # run
    r = sub.add_parser("run", help="Start the continuous scheduler loop")
    r.add_argument(
        "--interval", type=int, default=60, metavar="SECONDS",
        help="How often to check for due posts (default: 60)",
    )

    # flush
    sub.add_parser("flush", help="Send all scheduled posts immediately, ignoring their scheduled time")

    # retry
    sub.add_parser("retry", help="Reschedule all failed posts for immediate retry")

    return parser


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

HANDLERS = {
    "generate": cmd_generate,
    "list":     cmd_list,
    "trigger":  cmd_trigger,
    "run":      cmd_run,
    "flush":    cmd_flush,
    "retry":    cmd_retry,
}

if __name__ == "__main__":
    init_db()
    parser = build_parser()
    args = parser.parse_args()
    HANDLERS[args.command](args)
