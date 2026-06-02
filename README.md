# context-mcp

An [MCP](https://modelcontextprotocol.io) server for [Context.dev](https://context.dev) — give Claude Desktop, Claude Code, Cursor, or any MCP-compatible agent the ability to scrape, crawl, and extract structured data from the web.

> Community-built. Not officially affiliated with Context.dev.

## What it does

Exposes four Context.dev endpoints as MCP tools:

| Tool | Endpoint | What it's for |
|---|---|---|
| `scrape_markdown` | `GET /web/scrape/markdown` | Fetch one URL as LLM-ready Markdown |
| `crawl_site` | `POST /web/crawl` | Crawl a whole site (docs, blog, etc.) to Markdown |
| `extract_structured_data` | `POST /web/extract` | Crawl + pull structured JSON matching a schema |
| `retrieve_brand` | `GET /brand/retrieve` | Logos, colors, fonts, industry from a domain |

## Install

```bash
npm install -g context-mcp
```

Or run from source:

```bash
git clone https://github.com/<your-handle>/context-mcp
cd context-mcp
npm install
npm run build
```

Get an API key at [context.dev](https://context.dev).

## Use with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "context": {
      "command": "npx",
      "args": ["-y", "context-mcp"],
      "env": {
        "CONTEXT_DEV_API_KEY": "ctx_..."
      }
    }
  }
}
```

Restart Claude Desktop. The 🔌 icon should now show four `context` tools.

## Use with Claude Code

```bash
claude mcp add context -e CONTEXT_DEV_API_KEY=ctx_... -- npx -y context-mcp
```

## Use with Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "context": {
      "command": "npx",
      "args": ["-y", "context-mcp"],
      "env": { "CONTEXT_DEV_API_KEY": "ctx_..." }
    }
  }
}
```

## Try it

Once installed, ask your agent things like:

- *"Scrape stripe.com/pricing and summarize the tiers."*
- *"Crawl modelcontextprotocol.io and find every page that mentions 'transport'."*
- *"From ycombinator.com/companies, extract the name, batch, and description of every YC S26 company into JSON."*
- *"Get Airbnb's brand colors and logo URLs."*

## Tool reference

### `scrape_markdown`
| Param | Type | Notes |
|---|---|---|
| `url` | string (required) | Full URL with protocol |
| `useMainContentOnly` | bool | Strip nav/footer/sidebar |
| `includeLinks` | bool | Default `true` |
| `includeImages` | bool | Default `false` |
| `waitForMs` | int 0–30000 | Wait after load (for SPAs) |

### `crawl_site`
| Param | Type | Notes |
|---|---|---|
| `url` | string (required) | Starting URL |
| `maxPages` | int 1–500 | Default 100 |
| `maxDepth` | int | 0 = only starting page |
| `urlRegex` | string | Only follow matching URLs |
| `followSubdomains` | bool | Follow `docs.x.com` from `x.com` |
| `useMainContentOnly` | bool | Per-page content stripping |

### `extract_structured_data`
| Param | Type | Notes |
|---|---|---|
| `url` | string (required) | Starting URL |
| `schema` | object (required) | JSON Schema describing output shape |
| `instructions` | string ≤2000 | Extraction guidance |
| `factCheck` | bool | Strict-grounding mode |
| `followSubdomains` | bool | |

### `retrieve_brand`
| Param | Type | Notes |
|---|---|---|
| `domain` | string (required) | e.g. `stripe.com` |
| `maxSpeed` | bool | Faster, less comprehensive |

## Development

```bash
npm install
npm run dev    # tsc --watch
CONTEXT_DEV_API_KEY=ctx_... node dist/index.js   # run locally
```

## License

MIT
