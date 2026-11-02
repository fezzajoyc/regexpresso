import { z } from "zod";
import { compileRegex, collectMatches, regexReplace } from "../tools/_lib/regex-exec";
import { explainRegex, redosRisk, type RegexToken } from "../tools/_lib/regexplain";
import { REGEX_LIBRARY } from "../tools/_lib/regex-library-data";

/**
 * RegExpresso MCP 工具注册表:把 tools/_lib 的纯函数暴露为 AI 可执行工具。
 * 站上的同名工具在浏览器里跑(交互式),这里跑同一份经过测试的实现——
 * 人和 AI 用同一套逻辑,而不是两套各写各的。
 *
 * ReDoS 声明:regex_test / regex_replace 直接执行正则,不做超时中断
 * (同步执行做不到)。调用方应避免把不可信的超长输入喂给可疑模式;
 * regex_explain 会返回 redosRisk 启发式结果,可先行检查。
 */

const json = (v: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(v, null, 2) }] });

const FLAGS_SCHEMA = z
  .string()
  .default("g")
  .describe("RegExp flags, any subset of 'gimsu' in any order. Use 'g' to find all matches, 'i' to ignore case, 'm' for multiline ^/$, 's' so . matches newlines, 'u' for unicode \\u{...}/\\p{...}.");

export type McpToolDef = {
  name: string;
  title: string;
  description: string;
  schema: Record<string, any>;
  run: (args: any) => { content: { type: "text"; text: string }[]; isError?: boolean };
};

/** token → 英文短语(MCP 侧固定英文;网站引擎按站点语言映射) */
function tokenToEnglish(t: RegexToken): string {
  switch (t.kind) {
    case "literal":
      return `literal text ${JSON.stringify(t.text)}`;
    case "dot":
      return "any character except line breaks";
    case "class":
      return t.negated ? `any character NOT in ${t.raw}` : `any one character in ${t.raw}`;
    case "escape": {
      if (["d", "w", "s"].includes(t.code))
        return t.negated
          ? `NOT the shorthand class \\${t.code}`
          : `shorthand class \\${t.code} (digit / word character / whitespace)`;
      if (t.code === "p") return `unicode property class ${t.raw}`;
      if (t.identity) return `escaped letter "${t.code}" (JS ignores the backslash)`;
      return `escaped "${t.code}" (matches the character itself)`;
    }
    case "anchor":
      return t.anchorType === "start"
        ? "start of string (or line with the m flag)"
        : t.anchorType === "end"
          ? "end of string (or line with the m flag)"
          : t.anchorType === "word"
            ? "word boundary"
            : "NOT a word boundary";
    case "alternation":
      return "alternation (OR — left side tried first)";
    case "group":
      return t.groupType === "capturing"
        ? "start of a capturing group (…) — its match is kept as a numbered group"
        : t.groupType === "noncapturing"
          ? "start of a non-capturing group (?:…) — groups without saving"
          : t.groupType === "named"
            ? `start of the named group "${t.name}" — its match is saved under that name`
            : t.groupType === "lookahead"
              ? "start of a lookahead (?=…) — must match but is not consumed"
              : t.groupType === "negativeLookahead"
                ? "start of a negative lookahead (?!…) — must NOT match"
                : t.groupType === "lookbehind"
                  ? "start of a lookbehind (?<=…) — what came before must match"
                  : "start of a negative lookbehind (?<!…) — what came before must NOT match";
    case "groupEnd":
      return "end of the group";
    case "backref":
      return t.named ? `named backreference \\k<${t.ref}>` : `backreference to group ${t.ref}`;
    case "quantifier": {
      const target = t.target || "the previous atom";
      const lazy = t.lazy ? "lazy" : "greedy";
      const count =
        t.max === null && t.min === 0
          ? "zero or more times"
          : t.max === null && t.min === 1
            ? "one or more times"
            : t.min === 0 && t.max === 1
              ? "optionally (zero or one time)"
              : t.max === null
                ? `${t.min} times or more`
                : t.min === t.max
                  ? `exactly ${t.min} times`
                  : `between ${t.min} and ${t.max} times`;
      return `quantifier: ${target} repeated ${count} (${lazy})`;
    }
    case "error":
      return `SYNTAX ERROR: ${t.message} at position ${t.position}`;
  }
}

export const MCP_TOOLS: McpToolDef[] = [
  {
    name: "regex_test",
    title: "Test a regex against text",
    description:
      "Run a JavaScript regex against a text and get every match with index, matched text, capture groups and named groups. Real RegExp semantics (ECMA-262), flags g/i/m/s/u. CAVEAT: the regex runs synchronously without a timeout — a catastrophic-backtracking pattern (e.g. (a+)+) on a long text can hang the call. Screen risky patterns with regex_explain first and keep inputs modest. Matches are capped at 500 with a truncated flag.",
    schema: {
      pattern: z.string().min(1).describe("the regular expression source, without the surrounding /slashes/"),
      flags: FLAGS_SCHEMA,
      test_string: z.string().max(200_000).describe("the text to search"),
    },
    run: (a) => {
      const compiled = compileRegex(a.pattern, a.flags ?? "g");
      if (!compiled.ok) {
        return { content: [{ type: "text", text: `invalid regex: ${compiled.error}` }], isError: true };
      }
      const { matches, truncated } = collectMatches(compiled.re, a.test_string);
      return json({
        count: matches.length,
        truncated,
        matches: matches.map((m) => ({
          index: m.index,
          match: m.text,
          groups: m.groups.filter((g) => g !== undefined),
          named: Object.fromEntries(Object.entries(m.named).filter(([, v]) => v !== undefined)),
        })),
      });
    },
  },
  {
    name: "regex_explain",
    title: "Explain a regex",
    description:
      "Tokenize a regular expression and explain each piece in plain English: literals, character classes, quantifiers (greedy/lazy), capturing / non-capturing / named groups, anchors, alternation, backreferences and lookarounds. Also returns a heuristic ReDoS risk assessment (low / medium / high with reasons). Syntax errors come back as an error token with the position — the tokenizer never throws.",
    schema: {
      pattern: z.string().describe("the regular expression to explain"),
    },
    run: (a) => {
      const tokens = explainRegex(a.pattern);
      const risk = redosRisk(a.pattern);
      return json({
        tokens: tokens.map((t, i) => ({ index: i, raw: "raw" in t ? t.raw : "", meaning: tokenToEnglish(t) })),
        redos_risk: {
          level: risk.level,
          reasons: risk.reasons.map((r) =>
            r.code === "nested-unbounded"
              ? `a quantifier applies to a group that itself contains an unbounded quantifier (${r.detail}) — classic catastrophic backtracking`
              : r.code === "ambiguous-alternation"
                ? `a repeated group has alternatives that can match the same text (${r.detail}), which can backtrack exponentially`
                : `a quantifier applies to a group that itself contains a quantifier (${r.detail}) — potentially polynomial backtracking`,
          ),
          note: "heuristic screening, not a proof; it can miss exotic cases",
        },
      });
    },
  },
  {
    name: "regex_replace",
    title: "Replace with a regex",
    description:
      "Find and replace using a JavaScript regex and a replacement string with $1/$2 capture-group references, $& for the whole match, $<name> for named groups and $$ for a literal dollar. Returns the new text and how many matches were replaced (exact when the g flag is on). CAVEAT: runs synchronously without a timeout — avoid catastrophic patterns on long texts.",
    schema: {
      pattern: z.string().min(1).describe("the regular expression source"),
      flags: FLAGS_SCHEMA.describe("use 'g' to replace every match; without it only the first match is replaced"),
      replacement: z.string().describe("replacement string, may contain $1, $&, $<name>, $$ references"),
      text: z.string().max(200_000).describe("the input text"),
    },
    run: (a) => {
      const r = regexReplace(a.pattern, a.flags ?? "g", a.replacement, a.text);
      if (!r.ok) {
        return { content: [{ type: "text", text: `invalid regex: ${r.error}` }], isError: true };
      }
      return json({ output: r.output, replaced: r.count, truncated: r.truncated });
    },
  },
  {
    name: "regex_library",
    title: "Curated regex library",
    description:
      "List a curated library of 30 copy-paste regex recipes (email, URL, IPv4, dates, times, phone numbers, strong password, slug, HTML tag, UUID, semver, credit-card issuer shapes, hashtag, emoji, price, CSV line, backreference tricks…) with pattern, flags, an English scope note and a sample text each pattern provably matches. An optional query filters by name or topic.",
    schema: {
      query: z
        .string()
        .optional()
        .describe("optional filter against the recipe name, id and description (e.g. 'email', 'date', 'unicode')"),
    },
    run: (a) => {
      const q = (a.query ?? "").trim().toLowerCase();
      const list = REGEX_LIBRARY.filter(
        (e) => !q || e.name.toLowerCase().includes(q) || e.id.includes(q) || e.desc.en!.toLowerCase().includes(q),
      );
      return json(
        list.map((e) => ({
          id: e.id,
          name: e.name,
          pattern: e.pattern,
          flags: e.flags,
          description: e.desc.en,
          sample: e.sample,
        })),
      );
    },
  },
];
