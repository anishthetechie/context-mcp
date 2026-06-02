# Outreach draft

**Target:** Yahia Bakour — solo founder of Context.dev (rebranded from Brand.dev March 2026), YC S26.
**Channels (in order of likely response rate):**
1. **Twitter/X DM → [@mynameisyahia](https://x.com/mynameisyahia)** — solo founders read DMs, low friction, short-form is native
2. **LinkedIn DM → [/in/yahia-bakour/](https://www.linkedin.com/in/yahia-bakour/)** — second-best; he's active there
3. **Email** — only if you can find it (try `yahia@context.dev` — single-founder shop)

Two versions below — pick whichever feels right. Both deliberately short.

---

## Version A — direct, no-fluff (best for email or LinkedIn)

**Subject:** A typed-tools MCP for Context, to complement your Stainless one

Hi Yahia,

Congrats on S26 and the Brand → Context rebrand.

I poked at the Stainless MCP you ship in the SDK repos — it's a clever pattern (search_docs + execute), and perfect for Cursor users who want a code-interpreter with the Context SDK preloaded. But it leaves a gap: end-user agents (Claude Desktop, Cline, Continue, smaller models) that just want to *use* Context as a tool, not write TS to call it.

So I built a typed-tools MCP for that side: **<repo-url>**

4 first-class tools — `scrape_markdown`, `crawl_site`, `extract_structured_data`, `retrieve_brand` — Zod-validated, no code-gen step, runs on stdio. Claude sees the tool and calls it directly; works with Haiku-class models that can't reliably write correct TypeScript on the fly.

60s Loom of it inside Claude Desktop: **<loom-url>**

I'm [your role / year, e.g. "rising senior at <school> studying CS"]. I build agentic systems daily and Context is exactly the infra layer I'd want to be working on. You're solo — an intern who ships things like this without being asked would actively help. Any chance you're hiring this summer? Happy to keep going: 20+ more endpoints to wrap, plus the inverse direction (Context-as-MCP-client that can call other agents' tools) is unexplored.

Either way — repo's MIT, fork it into an official @context-dev one whenever.

— Anish
[LinkedIn / GitHub link]

---

## Version B — Twitter DM (short, scannable on phone)

Hey Yahia — congrats on S26.

Built a typed-tools MCP for Context to complement your Stainless one (which is great for Cursor code-gen, but heavyweight for end-user agents): <repo-url>

4 first-class tools (scrape, crawl, extract, brand), zero code-gen step, runs on stdio. Works in Claude Desktop / Cline / Continue + with small models. 60s demo: <loom-url>

You're solo — I'd love to be the intern who keeps shipping things like this. [Your one-liner — school, year, what you build]. Hiring?

Repo's yours regardless (MIT).

---

## Why these work

- **Specific artifact first, ask second.** The repo + Loom prove competence before they read a single word about you.
- **Solves a real distribution gap** — MCP is exploding (Claude, Cursor, Continue, Cline all support it), and Context not having a server is a real problem worth ~30 min of founder attention.
- **No-strings clause** ("repo's yours regardless") removes any hesitation about reading it.
- **Soft ask, easy to say no to** — which paradoxically increases reply rate.

## Before you send

- [ ] Push to GitHub: `gh repo create context-mcp --public --source=. --push`
- [ ] Replace `<repo-url>` with the actual GitHub URL
- [ ] Record a 60s Loom: open Claude Desktop, ask it *"Scrape stripe.com/pricing and summarize the tiers"*, then *"Get Airbnb's brand colors"* — show both tool calls firing
- [ ] Replace `<loom-url>`
- [ ] Replace `[your role]` / `[your one-liner]` and your `[LinkedIn / GitHub link]`
- [ ] If emailing: send from your school address, not a generic Gmail
- [ ] If DM'ing on Twitter: follow him first so the DM doesn't land in "Requests"

## What to NOT do

- Don't apologize for cold-emailing
- Don't add "no worries if not"
- Don't attach a résumé in the first email (link to LinkedIn if anything)
- Don't follow up before day 5
