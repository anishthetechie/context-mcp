# Outreach draft

Two versions below — pick whichever feels right. Both deliberately short (founders read on phones, scan in <10s, reply or don't).

---

## Version A — direct, no-fluff

**Subject:** Built you an MCP server for Context — open-source, takes 30s to install

Hi [Founder first name],

Congrats on the S26 batch.

I noticed Context didn't have an MCP server yet, so I built one over the weekend: **<repo-url>**

It wraps `scrape_markdown`, `crawl_site`, `extract_structured_data`, and `retrieve_brand` as MCP tools, so anyone using Claude Desktop, Claude Code, or Cursor can install Context in 30 seconds and start using it from inside their agent.

60-second Loom of it running inside Claude: **<loom-url>**

I'm a [your role / year, e.g. "rising senior at <school> studying CS"]. I build agentic systems daily and Context is exactly the infra layer I'd want to be working on. Any chance you're hiring interns this summer? Happy to keep shipping these — there are 20+ more endpoints to wrap, and the same pattern would unlock Cursor / Continue / Cline distribution for you.

Either way — feel free to take the MCP server. MIT-licensed, your team's free to fork it into an official repo.

— Anish

---

## Version B — slightly warmer

**Subject:** Built Context an MCP server (open-source) — any chance you're hiring?

Hey [Founder first name],

Quick one — I've been building with Claude Code and noticed Context.dev had clean REST + SDKs but no MCP server. That's a gap, because MCP is how every agent (Claude, Cursor, Continue) installs new tools right now. So I built one:

→ **<repo-url>** — 4 tools (scrape, crawl, extract, brand), one `npx` install, MIT
→ **<loom-url>** — 60s of it running in Claude Desktop

You can fork it into an official @context-dev repo, ignore it, or hire me to keep shipping things like this. I'm [your one-liner — school, year, what you build]. Context is exactly the layer of the AI stack I want to be working on.

If there's any chance of a summer internship, I'd love to talk. If not, repo's yours regardless.

— Anish
[your LinkedIn / GitHub / portfolio link]

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
- [ ] Replace `[Founder first name]` and `[your role]`
- [ ] Send from a real email (not Gmail-looking-spammy) — ideally your school address

## What to NOT do

- Don't apologize for cold-emailing
- Don't add "no worries if not"
- Don't attach a résumé in the first email (link to LinkedIn if anything)
- Don't follow up before day 5
