"""
generator.py — Calls Claude (primary) or OpenAI (fallback) to produce content.
Returns a plain dict so callers don't depend on SDK types.
"""

import os
from typing import TypedDict


class GeneratedContent(TypedDict):
    topic: str
    body: str
    provider: str  # "claude" | "openai"


PROMPT_TEMPLATE = """You are an educational content writer for a Discord community.
Write a short, engaging post about: {topic}

Rules:
- 150–250 words
- Clear, accessible language — assume no prior knowledge
- One key insight or takeaway
- No markdown headers; clean flowing paragraphs only
- End with one thought-provoking question for the community
"""


def generate_content(topic: str) -> GeneratedContent:
    """Generate educational content for a given topic. Claude first, OpenAI fallback."""
    prompt = PROMPT_TEMPLATE.format(topic=topic)

    try:
        return _generate_with_claude(topic, prompt)
    except Exception as err:
        print(f"[generator] Claude failed ({err}), falling back to OpenAI.")
        return _generate_with_openai(topic, prompt)


def _generate_with_claude(topic: str, prompt: str) -> GeneratedContent:
    import anthropic

    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    )
    body = response.content[0].text
    return {"topic": topic, "body": body, "provider": "claude"}


def _generate_with_openai(topic: str, prompt: str) -> GeneratedContent:
    import openai

    client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    )
    body = response.choices[0].message.content or ""
    return {"topic": topic, "body": body, "provider": "openai"}
