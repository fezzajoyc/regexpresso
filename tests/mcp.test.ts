import { describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "@/mcp/server";
import { MCP_TOOLS } from "@/mcp/tools";
import { REGEX_LIBRARY } from "@/tools/_lib/regex-library-data";

async function connect() {
  const server = createServer();
  const client = new Client({ name: "test", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

const parse = (r: any) => JSON.parse((r.content as any)[0].text);
const errText = (r: any) => (r.content as any)[0].text as string;

describe("regexpresso MCP server", () => {
  it("exposes exactly the four regex tools over the protocol", async () => {
    const client = await connect();
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      "regex_explain", "regex_library", "regex_replace", "regex_test",
    ]);
    for (const t of tools) {
      expect(t.description ?? "", t.name).toBeTruthy();
      expect((t.description ?? "").length, t.name).toBeGreaterThan(40);
    }
    await client.close();
  });

  it("keeps MCP tool count in sync with the local registry", () => {
    expect(MCP_TOOLS).toHaveLength(4);
  });

  it("regex_test returns every match with index, text and groups", async () => {
    const client = await connect();
    const r = parse(
      await client.callTool({
        name: "regex_test",
        arguments: { pattern: "(\\w+)@(\\w+)\\.(\\w+)", flags: "g", test_string: "ada@mail.co, bob@ex.org" },
      }),
    );
    expect(r.count).toBe(2);
    expect(r.truncated).toBe(false);
    expect(r.matches[0]).toEqual({ index: 0, match: "ada@mail.co", groups: ["ada", "mail", "co"], named: {} });
    expect(r.matches[1].index).toBe(13);
    await client.close();
  });

  it("regex_test honors the g flag (off → first match only)", async () => {
    const client = await connect();
    const r = parse(
      await client.callTool({
        name: "regex_test",
        arguments: { pattern: "a", flags: "", test_string: "banana" },
      }),
    );
    expect(r.count).toBe(1);
    expect(r.matches[0].index).toBe(1);
    await client.close();
  });

  it("regex_test returns isError for invalid patterns (protocol level)", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "regex_test",
      arguments: { pattern: "(", flags: "g", test_string: "abc" },
    });
    expect(r.isError).toBe(true);
    expect(errText(r)).toContain("Invalid regular expression");
    await client.close();
  });

  it("regex_test handles zero-length matches without hanging", async () => {
    const client = await connect();
    const r = parse(
      await client.callTool({
        name: "regex_test",
        arguments: { pattern: "x*", flags: "g", test_string: "abc" },
      }),
    );
    expect(r.count).toBe(4);
    expect(r.matches.every((m: any) => m.match === "")).toBe(true);
    await client.close();
  });

  it("regex_explain tokenizes and reports ReDoS risk", async () => {
    const client = await connect();
    const simple = parse(
      await client.callTool({ name: "regex_explain", arguments: { pattern: "^\\d{4}-\\d{2}$" } }),
    );
    expect(simple.tokens.length).toBeGreaterThan(3);
    expect(simple.tokens.some((t: any) => /start of string/.test(t.meaning))).toBe(true);
    expect(simple.tokens.some((t: any) => /exactly 4 times/.test(t.meaning))).toBe(true);
    expect(simple.redos_risk.level).toBe("low");

    const risky = parse(
      await client.callTool({ name: "regex_explain", arguments: { pattern: "(a+)+" } }),
    );
    expect(risky.redos_risk.level).toBe("high");
    expect(risky.redos_risk.reasons.join(" ")).toContain("(a+)");
    await client.close();
  });

  it("regex_explain reports syntax errors as an error token instead of throwing", async () => {
    const client = await connect();
    const r = parse(
      await client.callTool({ name: "regex_explain", arguments: { pattern: "(ab" } }),
    );
    expect(r.tokens.at(-1).meaning).toContain("SYNTAX ERROR");
    await client.close();
  });

  it("regex_replace applies $1 group references and counts replacements", async () => {
    const client = await connect();
    const r = parse(
      await client.callTool({
        name: "regex_replace",
        arguments: { pattern: "(\\w+) (\\w+)", flags: "g", replacement: "$2 $1", text: "hello world and good morning" },
      }),
    );
    // 非重叠扫描:第二个匹配是 "and good",不是 "good morning"
    expect(r.output).toBe("world hello good and morning");
    expect(r.replaced).toBe(2);
    await client.close();
  });

  it("regex_replace without g replaces only the first match", async () => {
    const client = await connect();
    const r = parse(
      await client.callTool({
        name: "regex_replace",
        arguments: { pattern: "a", flags: "", replacement: "X", text: "banana" },
      }),
    );
    expect(r.output).toBe("bXnana");
    expect(r.replaced).toBe(1);
    await client.close();
  });

  it("regex_replace supports $& and named group references", async () => {
    const client = await connect();
    const whole = parse(
      await client.callTool({
        name: "regex_replace",
        arguments: { pattern: "o", flags: "g", replacement: "[$&]", text: "foo" },
      }),
    );
    expect(whole.output).toBe("f[o][o]");

    const named = parse(
      await client.callTool({
        name: "regex_replace",
        arguments: {
          pattern: "(?<first>\\w+) (?<second>\\w+)",
          flags: "",
          replacement: "$<second>-$<first>",
          text: "hello world",
        },
      }),
    );
    expect(named.output).toBe("world-hello");
    await client.close();
  });

  it("regex_library lists every recipe and filters by query", async () => {
    const client = await connect();
    const all = parse(await client.callTool({ name: "regex_library", arguments: {} }));
    expect(all).toHaveLength(REGEX_LIBRARY.length);
    for (const entry of all) {
      expect(entry.pattern).toBeTruthy();
      expect(entry.description).toBeTruthy();
      expect(entry.sample).toBeTruthy();
    }

    const filtered = parse(
      await client.callTool({ name: "regex_library", arguments: { query: "date" } }),
    );
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.length).toBeLessThan(all.length);
    expect(filtered.every((e: any) => /date/i.test(e.name + e.description))).toBe(true);
    await client.close();
  });

  it("rejects schema violations as protocol errors", async () => {
    const client = await connect();
    const missing = await client.callTool({ name: "regex_test", arguments: { flags: "g", test_string: "abc" } });
    expect(missing.isError).toBe(true);
    await client.close();
  });
});
