import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MCP_TOOLS } from "./tools";

/**
 * RegExpresso MCP server(stdio):把站上 4 个正则工具背后的纯函数逻辑
 * (tools/_lib/regex-* 经测试的实现)暴露为 AI 可执行工具。
 * 人和 AI 用同一套逻辑,而不是两套各写各的。
 *
 * 构建后运行:npx regexpresso-mcp(或 node mcp/dist/server.mjs)
 */

export function createServer() {
  const server = new McpServer(
    { name: "regexpresso", version: "1.0.0" },
    {
      instructions:
        "RegExpresso: regex tools. These executable tools run the same tested logic as the website (https://regexpresso.app). regex_test and regex_replace run real JavaScript RegExp synchronously without a timeout — screen untrusted patterns with regex_explain (ReDoS risk) first and keep inputs modest. Flags are any subset of gimsu.",
    },
  );

  for (const tool of MCP_TOOLS) {
    server.registerTool(tool.name, {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.schema,
    }, async (args) => {
      try {
        return tool.run(args ?? {});
      } catch (e) {
        return {
          content: [{ type: "text" as const, text: `error: ${(e as Error).message}` }],
          isError: true,
        };
      }
    });
  }
  return server;
}

export async function runStdio() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
  // stdio 模式下保持进程存活;stderr 可写日志(stdout 是协议通道)
  console.error(`regexpresso MCP server: ${MCP_TOOLS.length} tools ready`);
}

if (process.argv[1] && process.argv[1].includes("server")) {
  void runStdio();
}
