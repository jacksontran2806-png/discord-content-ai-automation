# AI Content Automation System

An AI-powered pipeline that generates educational content and posts it to Discord automatically on a schedule.

## Structure

```
Code2/
├── content-bot/   — Next.js web app (UI + API routes + Vercel cron)
└── pipeline/      — Python CLI backend (local scheduler + DB)
```

## content-bot (Next.js)

The web app. Deployed on Vercel. Users can generate content, schedule posts, and view history.

### Pages
| Page | Description |
|---|---|
| `/` | Dashboard overview |
| `/generate` | Generate content with AI and schedule or post immediately |
| `/scheduled` | View, cancel, and delete scheduled posts |
| `/history` | Past posts |
| `/settings` | API key status, danger zone |

### How it works
1. User writes a topic on `/generate`
2. App calls Claude (falls back to OpenAI if Claude fails)
3. User picks a time → saved to Supabase with `status: scheduled`
4. Vercel cron hits `/api/cron` daily → sends all due posts to Discord → marks as `posted`

### Setup

```bash
cd content-bot
pnpm install
cp .env.example .env.local   # fill in your keys
pnpm dev
```

### Deploy to Vercel

```bash
vercel --prod
```

Add these environment variables in Vercel dashboard:
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `DISCORD_WEBHOOK_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase setup

Run this SQL in your Supabase SQL editor:

```sql
CREATE TABLE posts (
  id            BIGSERIAL PRIMARY KEY,
  topic         TEXT NOT NULL,
  content       TEXT NOT NULL,
  platform      TEXT NOT NULL DEFAULT 'discord',
  scheduled_time TIMESTAMPTZ NOT NULL,
  status        TEXT NOT NULL DEFAULT 'draft',
  error         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

## pipeline (Python CLI)

A local backend with a continuous scheduler. Use this for more frequent posting (every minute, every hour) without needing a paid Vercel plan.

### Commands

```bash
cd pipeline
pip install -r requirements.txt
cp .env.example .env   # fill in your keys

python main.py generate "how black holes form" --in 60   # schedule in 60 min
python main.py list                                       # view all posts
python main.py list --status scheduled
python main.py trigger                                    # send due posts now
python main.py run --interval 30                         # start scheduler loop
python main.py flush                                      # force-send all scheduled
python main.py retry                                      # retry failed posts
```

### Modules

| File | Responsibility |
|---|---|
| `database.py` | SQLite — all read/write operations |
| `generator.py` | LLM content generation (Claude → OpenAI fallback) |
| `publisher.py` | Platform abstraction (Discord now, extensible) |
| `scheduler.py` | Checks due posts and publishes them |
| `main.py` | CLI entry point |

### Adding a new platform

Open `publisher.py`, add a class with a `publish(topic, content)` method, register it in `PUBLISHERS`. Nothing else changes.

---

## Tech stack

- **Next.js 16** — App Router, Route Handlers
- **TypeScript** — throughout
- **Tailwind CSS v4** — styling
- **Supabase** — PostgreSQL database
- **Vercel** — hosting + cron
- **Anthropic Claude** — primary LLM
- **OpenAI GPT-4o-mini** — fallback LLM
- **Discord Webhooks** — publishing
- **Python 3.12+** — CLI pipeline
- **SQLite** — local pipeline database
