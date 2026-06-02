#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE_URL = "https://api.context.dev/v1";
const API_KEY = process.env.CONTEXT_DEV_API_KEY;

if (!API_KEY) {
  console.error(
    "[context-mcp] CONTEXT_DEV_API_KEY is not set. Get one at https://context.dev and add it to your MCP client config."
  );
  process.exit(1);
}

type ContextError = { message?: string; error_code?: string };

async function callContext<T>(
  method: "GET" | "POST",
  path: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  const url = new URL(BASE_URL + path);
  const init: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
    },
  };

  if (method === "GET") {
    for (const [k, v] of Object.entries(payload)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  } else {
    (init.headers as Record<string, string>)["Content-Type"] = "application/json";
    init.body = JSON.stringify(payload);
  }

  const res = await fetch(url, init);
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { message: text };
  }

  if (!res.ok) {
    const err = body as ContextError;
    const code = err.error_code ?? `HTTP_${res.status}`;
    const msg = err.message ?? res.statusText;
    throw new Error(`Context API error [${code}]: ${msg}`);
  }

  return body as T;
}

function text(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text:
          typeof value === "string" ? value : JSON.stringify(value, null, 2),
      },
    ],
  };
}

const server = new McpServer({
  name: "context-mcp",
  version: "0.1.0",
});

server.registerTool(
  "scrape_markdown",
  {
    title: "Scrape URL to Markdown",
    description:
      "Fetch a single URL and return its content as LLM-ready Markdown. Use this when you need the contents of one specific page.",
    inputSchema: {
      url: z
        .string()
        .url()
        .describe("Full URL to scrape (must include http:// or https://)."),
      useMainContentOnly: z
        .boolean()
        .optional()
        .describe(
          "When true, strips headers/footers/sidebars/nav and returns only the main article body."
        ),
      includeLinks: z
        .boolean()
        .optional()
        .describe("Preserve hyperlinks in the Markdown output. Defaults to true."),
      includeImages: z
        .boolean()
        .optional()
        .describe("Include image references in the Markdown. Defaults to false."),
      waitForMs: z
        .number()
        .int()
        .min(0)
        .max(30000)
        .optional()
        .describe(
          "Browser wait time after page load before converting to Markdown. Useful for SPAs. Max 30000."
        ),
    },
  },
  async (args) => {
    const res = await callContext<{ markdown: string; url: string }>(
      "GET",
      "/web/scrape/markdown",
      args
    );
    return text(`# ${res.url}\n\n${res.markdown}`);
  }
);

server.registerTool(
  "crawl_site",
  {
    title: "Crawl Website",
    description:
      "Crawl a website starting from a URL and return Markdown for every page reached. Use this when you need content across multiple pages of a site (docs, blog, product pages).",
    inputSchema: {
      url: z
        .string()
        .url()
        .describe("Starting URL for the crawl."),
      maxPages: z
        .number()
        .int()
        .min(1)
        .max(500)
        .optional()
        .describe("Maximum number of pages to crawl. Default 100, hard cap 500."),
      maxDepth: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe(
          "Maximum link depth from the starting URL. 0 = only the starting page."
        ),
      urlRegex: z
        .string()
        .optional()
        .describe(
          "Regex pattern: only URLs matching this will be followed (e.g. '^https?://[^/]+/blog/')."
        ),
      followSubdomains: z
        .boolean()
        .optional()
        .describe(
          "When true, follow links on subdomains (e.g. docs.example.com when starting from example.com)."
        ),
      useMainContentOnly: z
        .boolean()
        .optional()
        .describe("Strip nav/footer/sidebar from each page's Markdown."),
    },
  },
  async (args) => {
    const res = await callContext<{
      results: Array<{
        markdown: string;
        metadata: {
          url: string;
          title: string;
          crawlDepth: number;
          statusCode: number;
          success: boolean;
        };
      }>;
      metadata: {
        numUrls: number;
        numSucceeded: number;
        numFailed: number;
        numSkipped: number;
        maxCrawlDepth: number;
      };
    }>("POST", "/web/crawl", args);

    const summary = [
      `Crawled ${res.metadata.numUrls} pages (${res.metadata.numSucceeded} ok, ${res.metadata.numFailed} failed, ${res.metadata.numSkipped} skipped) from ${args.url}`,
      "",
      ...res.results.map(
        (r) =>
          `## ${r.metadata.title || r.metadata.url}\n${r.metadata.url}\n\n${r.markdown}`
      ),
    ].join("\n\n---\n\n");

    return text(summary);
  }
);

server.registerTool(
  "extract_structured_data",
  {
    title: "Extract Structured Data from Website",
    description:
      "Crawl a website and extract structured JSON data matching a provided JSON Schema. Use this when you need specific typed facts (mission statement, pricing tiers, team members, case studies) rather than raw Markdown.",
    inputSchema: {
      url: z.string().url().describe("Starting URL to crawl and extract from."),
      schema: z
        .record(z.unknown())
        .describe(
          "A JSON Schema object describing the shape of data to extract. Example: { type: 'object', properties: { mission: { type: 'string' } }, required: ['mission'] }."
        ),
      instructions: z
        .string()
        .max(2000)
        .optional()
        .describe(
          "Optional guidance for the extractor — which facts to prioritize, how to interpret fields."
        ),
      factCheck: z
        .boolean()
        .optional()
        .describe(
          "When true, fields not grounded in page text are returned null. When false (default), the model may make reasonable inferences."
        ),
      followSubdomains: z
        .boolean()
        .optional()
        .describe("Follow subdomains during the crawl."),
    },
  },
  async (args) => {
    const res = await callContext<{
      status: string;
      url: string;
      urls_analyzed: string[];
      data: Record<string, unknown>;
      metadata: Record<string, number>;
    }>("POST", "/web/extract", args);

    return text({
      data: res.data,
      urls_analyzed: res.urls_analyzed,
      pages_crawled: res.metadata.numUrls,
    });
  }
);

server.registerTool(
  "retrieve_brand",
  {
    title: "Retrieve Brand Data by Domain",
    description:
      "Get a company's logos, brand colors, fonts, industry, and description from just a domain. Use this when you need brand identity assets (e.g. for a CRM enrichment, a slide deck, a comparison page).",
    inputSchema: {
      domain: z
        .string()
        .min(1)
        .describe(
          "Domain to look up (e.g. 'airbnb.com', 'stripe.com'). No protocol prefix."
        ),
      maxSpeed: z
        .boolean()
        .optional()
        .describe(
          "Optimize for response speed at the cost of less comprehensive data."
        ),
    },
  },
  async (args) => {
    const res = await callContext<{ brand: Record<string, unknown> }>(
      "GET",
      "/brand/retrieve",
      args
    );
    return text(res.brand);
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[context-mcp] running on stdio");
