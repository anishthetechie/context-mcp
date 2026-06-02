// Probes the official Stainless-hosted Context MCP server to see what tools it exposes
// and how it handles a runtime scrape request. Disposable diagnostic — do not ship.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const API_KEY = process.env.CONTEXT_DEV_API_KEY;
if (!API_KEY) {
  console.error("Set CONTEXT_DEV_API_KEY");
  process.exit(1);
}

const transport = new StreamableHTTPClientTransport(
  new URL("https://context-dev.stlmcp.com"),
  {
    requestInit: {
      headers: { "x-context-dev-api-key": API_KEY },
    },
  }
);

const client = new Client({ name: "probe", version: "0" });
await client.connect(transport);

console.log("=== TOOLS LIST ===");
const tools = await client.listTools();
for (const t of tools.tools) {
  const schemaKeys = Object.keys(t.inputSchema?.properties ?? {});
  console.log(`\n- ${t.name}`);
  console.log(`  desc: ${(t.description ?? "").slice(0, 200)}`);
  console.log(`  args: ${schemaKeys.join(", ") || "(none)"}`);
}

// Find anything that looks like the invoke/runtime tool
const invokeTool =
  tools.tools.find((t) => /invoke|call|run|request/i.test(t.name)) ?? null;

console.log("\n=== ATTEMPT SCRAPE VIA THEIR MCP ===");
if (!invokeTool) {
  console.log("No invoke-style tool found. Their MCP is docs-only.");
} else {
  console.log(`Trying ${invokeTool.name} with a scrape_markdown call...`);
  try {
    // Try the most-common Stainless invoke shape
    const result = await client.callTool({
      name: invokeTool.name,
      arguments: {
        endpoint: "get /web/scrape/markdown",
        args: { url: "https://example.com" },
      },
    });
    const text = result.content?.[0]?.text ?? JSON.stringify(result);
    console.log("Result preview:", String(text).slice(0, 400));
  } catch (e) {
    console.log("Invoke shape 1 failed:", e.message);
    // Try alternate shape
    try {
      const result = await client.callTool({
        name: invokeTool.name,
        arguments: {
          method: "GET",
          path: "/web/scrape/markdown",
          query: { url: "https://example.com" },
        },
      });
      const text = result.content?.[0]?.text ?? JSON.stringify(result);
      console.log("Shape 2 result preview:", String(text).slice(0, 400));
    } catch (e2) {
      console.log("Invoke shape 2 failed:", e2.message);
    }
  }
}

await client.close();
