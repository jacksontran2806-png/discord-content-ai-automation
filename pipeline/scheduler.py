"""
scheduler.py — Checks for due posts and publishes them.

Two modes:
  process_due()  — run once, return count (used by `trigger` CLI command)
  run(interval)  — loop forever, used by `run` CLI command
"""

import logging
import time

from database import get_due_posts, update_status
from publisher import get_publisher

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("scheduler")


def process_due() -> int:
    """
    Publish all posts that are due now.
    Returns the number of posts successfully sent.
    """
    due = get_due_posts()
    if not due:
        return 0

    sent = 0
    for post in due:
        post_id = post["id"]
        topic = post["topic"]
        try:
            publisher = get_publisher(post["platform"])
            publisher.publish(topic, post["content"])
            update_status(post_id, "posted")
            log.info(f"Posted #{post_id}: {topic}")
            sent += 1
        except Exception as err:
            update_status(post_id, "failed", str(err))
            log.error(f"Failed #{post_id} ({topic}): {err}")

    return sent


def run(interval_seconds: int = 60) -> None:
    """
    Continuously check for due posts on a fixed interval.
    Runs until interrupted (Ctrl+C).
    """
    log.info(f"Scheduler started. Polling every {interval_seconds}s. Press Ctrl+C to stop.")
    try:
        while True:
            count = process_due()
            if count:
                log.info(f"Cycle complete — {count} post(s) sent.")
            time.sleep(interval_seconds)
    except KeyboardInterrupt:
        log.info("Scheduler stopped.")
