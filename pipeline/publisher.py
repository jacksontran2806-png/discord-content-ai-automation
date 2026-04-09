"""
publisher.py — Abstract publishing layer.

To add a new platform (e.g. Twitter/X, Slack):
  1. Create a class that implements the Publisher protocol (publish method).
  2. Register it in PUBLISHERS at the bottom of this file.
  That's it — no changes to scheduler or main needed.
"""

import os
from typing import Protocol
import requests


class Publisher(Protocol):
    """Any publisher must implement publish(topic, content) -> None."""

    def publish(self, topic: str, content: str) -> None:
        ...


# ---------------------------------------------------------------------------
# Discord
# ---------------------------------------------------------------------------

class DiscordPublisher:
    def __init__(self) -> None:
        self.webhook_url = os.environ.get("DISCORD_WEBHOOK_URL")
        if not self.webhook_url:
            raise EnvironmentError("DISCORD_WEBHOOK_URL is not set in environment.")

    def publish(self, topic: str, content: str) -> None:
        message = f"**{topic}**\n\n{content}"
        response = requests.post(
            self.webhook_url,
            json={"content": message},
            timeout=10,
        )
        # Raises requests.HTTPError on 4xx/5xx
        response.raise_for_status()


# ---------------------------------------------------------------------------
# Registry — add new platforms here
# ---------------------------------------------------------------------------

PUBLISHERS: dict[str, type] = {
    "discord": DiscordPublisher,
    # "slack":   SlackPublisher,
    # "twitter": TwitterPublisher,
}


def get_publisher(platform: str) -> Publisher:
    """Return a ready-to-use publisher for the given platform name."""
    if platform not in PUBLISHERS:
        available = ", ".join(PUBLISHERS.keys())
        raise ValueError(f"Unknown platform '{platform}'. Available: {available}")
    return PUBLISHERS[platform]()
