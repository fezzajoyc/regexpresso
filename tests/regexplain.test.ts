import { describe, expect, it } from "vitest";
import { explainRegex, redosRisk, tokenize, type RegexToken } from "@/tools/_lib/regexplain";
import { REGEX_LIBRARY } from "@/tools/_lib/regex-library-data";
import { compileRegex, collectMatches, regexReplace, MAX_MATCHES, ALLOWED_FLAGS } from "@/tools/_lib/regex-exec";
import type { LibraryLocale } from "@/tools/_lib/regex-library-data";

const kinds = (pattern: string) => explainRegex(pattern).map((t) => t.kind);
const last = (pattern: string): RegexToken => explainRegex(pattern)[explainRegex(pattern).length - 1];

/* ------------------------------------------------------------------ */
/* explainRegex — 词法分析                                             */
/* ------------------------------------------------------------------ */

describe("explainRegex tokenization", () => {
  it("collapses consecutive literal characters into one token", () => {
    const tokens = explainRegex("abc");
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toMatchObject({ kind: "literal", text: "abc", raw: "abc" });
  });

  it("splits the quantified character off the literal", () => {
    const tokens = explainRegex("abc+");
    expect(tokens).toHaveLength(2);
    expect(tokens[0]).toMatchObject({ kind: "literal", text: "ab" });
    expect(tokens[1]).toMatchObject({ kind: "quantifier", min: 1, max: null, lazy: false, target: "c" });
  });

  it("parses character classes with ranges and chars", () => {
    const [cls] = explainRegex("[a-z0-9_]");
    expect(cls.kind).toBe("class");
    if (cls.kind !== "class") return;
    expect(cls.negated).toBe(false);
    expect(cls.members).toEqual([
      { type: "range", from: "a", to: "z", raw: "a-z" },
      { type: "range", from: "0", to: "9", raw: "0-9" },
      { type: "char", raw: "_" },
    ]);
  });

  it("marks negated classes", () => {
    const [cls] = explainRegex("[^a-z]");
    expect(cls.kind).toBe("class");
    if (cls.kind !== "class") return;
    expect(cls.negated).toBe(true);
    expect(cls.members[0]).toMatchObject({ type: "range", from: "a", to: "z" });
  });

  it("closes a class on the first ], so []] is an empty class plus a literal ]", () => {
    // V8 非 u 模式实测:[] 不匹配任何字符,[]] 是空类 + 字面量 ]
    const tokens = explainRegex("[]]");
    expect(tokens.map((t) => t.kind)).toEqual(["class", "literal"]);
    const [cls, lit] = tokens;
    expect(cls.kind === "class" && cls.members).toEqual([]);
    expect(lit.kind === "literal" && lit.text).toBe("]");
  });

  it("tokenizes [^] as a negated empty class (matches everything in JS)", () => {
    const [cls] = explainRegex("[^]");
    expect(cls.kind).toBe("class");
    if (cls.kind !== "class") return;
    expect(cls.negated).toBe(true);
    expect(cls.members).toEqual([]);
  });

  it("tokenizes shorthand escapes as escapes with negation", () => {
    const tokens = explainRegex("\\d\\D\\w\\W\\s\\S");
    expect(tokens.map((t) => (t.kind === "escape" ? `${t.code}${t.negated ? "-" : "+"}` : t.kind))).toEqual([
      "d+", "d-", "w+", "w-", "s+", "s-",
    ]);
  });

  it("distinguishes real escapes from identity escapes", () => {
    const [nl] = explainRegex("\\n");
    const [dot] = explainRegex("\\.");
    const [q] = explainRegex("\\q");
    expect(nl.kind === "escape" && nl.identity).toBe(false);
    expect(dot.kind === "escape" && dot.identity).toBe(false);
    // 无意义的字母转义(JS 非 u 模式的 identity escape)
    expect(q.kind === "escape" && q.identity).toBe(true);
  });

  it("maps \\b and \\B to word-boundary anchors", () => {
    expect(explainRegex("\\b")).toEqual([{ kind: "anchor", raw: "\\b", anchorType: "word" }]);
    expect(explainRegex("\\B")).toEqual([{ kind: "anchor", raw: "\\B", anchorType: "nonword" }]);
  });

  it("parses greedy and lazy quantifiers, including counted forms", () => {
    expect(explainRegex(".*?")[1]).toMatchObject({ kind: "quantifier", min: 0, max: null, lazy: true, target: "." });
    expect(explainRegex("a+?")[1]).toMatchObject({ kind: "quantifier", min: 1, max: null, lazy: true, target: "a" });
    expect(explainRegex("a??")[1]).toMatchObject({ kind: "quantifier", min: 0, max: 1, lazy: true, target: "a" });
    expect(explainRegex("\\d{2,4}")[1]).toMatchObject({ kind: "quantifier", min: 2, max: 4, target: "\\d" });
    expect(explainRegex("a{2,}")[1]).toMatchObject({ kind: "quantifier", min: 2, max: null, target: "a" });
    expect(explainRegex("a{3}")[1]).toMatchObject({ kind: "quantifier", min: 3, max: 3, target: "a" });
  });

  it("quantifies whole groups with the group text as target", () => {
    const tokens = explainRegex("(ab)+");
    expect(tokens.map((t) => t.kind)).toEqual(["group", "literal", "groupEnd", "quantifier"]);
    const q = tokens[3];
    expect(q.kind === "quantifier" && q.target).toBe("(ab)");
  });

  it("distinguishes capturing, non-capturing and named groups", () => {
    expect(explainRegex("(ab)")[0]).toMatchObject({ kind: "group", groupType: "capturing" });
    expect(explainRegex("(?:ab)")[0]).toMatchObject({ kind: "group", groupType: "noncapturing" });
    const [named] = explainRegex("(?<year>\\d{4})");
    expect(named).toMatchObject({ kind: "group", groupType: "named", name: "year" });
  });

  it("parses all four lookaround forms", () => {
    expect(explainRegex("(?=x)")[0]).toMatchObject({ groupType: "lookahead" });
    expect(explainRegex("(?!x)")[0]).toMatchObject({ groupType: "negativeLookahead" });
    expect(explainRegex("(?<=y)")[0]).toMatchObject({ groupType: "lookbehind" });
    expect(explainRegex("(?<!y)")[0]).toMatchObject({ groupType: "negativeLookbehind" });
  });

  it("keeps alternation and anchors as their own tokens", () => {
    expect(kinds("cat|dog")).toEqual(["literal", "alternation", "literal"]);
    expect(kinds("^ab$")).toEqual(["anchor", "literal", "anchor"]);
    expect(explainRegex("^ab$")[0]).toMatchObject({ anchorType: "start" });
    expect(explainRegex("^ab$")[2]).toMatchObject({ anchorType: "end" });
  });

  it("tokenizes numeric and named backreferences", () => {
    expect(explainRegex("\\1")).toMatchObject([{ kind: "backref", ref: "1", named: false }]);
    expect(explainRegex("\\k<name>")).toMatchObject([{ kind: "backref", ref: "name", named: true }]);
  });

  it("treats a bare { like JS does in non-unicode mode (literal)", () => {
    const tokens = explainRegex("a{1,");
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toMatchObject({ kind: "literal", text: "a{1," });
  });
});

/* ------------------------------------------------------------------ */
/* explainRegex — 畸形输入:错误 token,绝不抛异常                       */
/* ------------------------------------------------------------------ */

describe("explainRegex malformed input", () => {
  const MALFORMED = [
    "(", "((a)", ")", "(a))", "[", "[a-", "\\", "a\\", "*a", "+a", "?a", "^*", "$+",
    "a**", "a++", "(?P<x>y)", "(?<", "(?<n", "(?x)", "(?", "*", "+", "?", "^+", "|*",
  ];

  it("returns an error token (never throws) for every malformed pattern", () => {
    for (const p of MALFORMED) {
      const tokens = explainRegex(p);
      expect(tokens.length, p).toBeGreaterThan(0);
      expect(last(p).kind, `pattern ${p}`).toBe("error");
    }
  });

  it("agrees with the JS engine on which patterns are invalid", () => {
    for (const p of MALFORMED) {
      expect(compileRegex(p, "").ok, `JS should reject ${p}`).toBe(false);
    }
  });

  it("reports no error token for valid patterns", () => {
    const VALID = [
      "abc", "[a-z]+", "(a|b)?", "(?:x)+", "(?<n>x)\\k<n>", "^\\d{4}-\\d{2}$",
      "a{1,2}?", "[^\\d]", "colou?r", "(a(b(c)))", "\\.", "x|", "a?", "(?=a)(?<=b)",
      // V8 非 u 模式的宽松边界(Annex B)
      "()", "[]", "[]]", "x|", "|", "]", "[^]", "(?:)", "a{,2}", "\\q", "\\p{L}",
    ];
    for (const p of VALID) {
      const { tokens, errorAt } = tokenize(p);
      expect(errorAt, `pattern ${p}`).toBe(-1);
      expect(tokens.some((t) => t.kind === "error"), `pattern ${p}`).toBe(false);
      expect(compileRegex(p, "").ok, `JS should accept ${p}`).toBe(true);
    }
  });

  it("never throws on 300 pseudo-random inputs", () => {
    // 简单 LCG 保证确定性
    let seed = 42;
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    const alphabet = "[](){}*+?.\\|^$-abc123,;:# ";
    for (let i = 0; i < 300; i++) {
      const len = Math.floor(rnd() * 18);
      let p = "";
      for (let j = 0; j < len; j++) p += alphabet[Math.floor(rnd() * alphabet.length)];
      expect(() => explainRegex(p)).not.toThrow();
    }
  });
});

/* ------------------------------------------------------------------ */
/* redosRisk — 启发式                                                  */
/* ------------------------------------------------------------------ */

describe("redosRisk heuristic", () => {
  it("flags nested unbounded quantifiers as high risk", () => {
    expect(redosRisk("(a+)+").level).toBe("high");
    expect(redosRisk("(\\d*)*").level).toBe("high");
    expect(redosRisk("(\\w+\\s?)*$").level).toBe("high");
    expect(redosRisk("^(a|aa)+$").level).toBe("high");
    expect(redosRisk("(a+)+$").reasons[0].detail).toBe("(a+)");
  });

  it("flags ambiguous alternation inside a quantified group as high risk", () => {
    expect(redosRisk("(a|aa)+").level).toBe("high");
    expect(redosRisk("(x|x)+").level).toBe("high");
  });

  it("rates bounded nested quantifiers as medium", () => {
    expect(redosRisk("(a{1,3}){1,3}").level).toBe("medium");
  });

  it("rates simple patterns as low", () => {
    for (const p of ["abc", "a*", "[a-z]+", "(ab)+", "a{2,4}", ".*", "\\d{4}", "(foo|bar)+", "^\\w+$"]) {
      expect(redosRisk(p).level, `pattern ${p}`).toBe("low");
      expect(redosRisk(p).reasons).toEqual([]);
    }
  });

  it("is honest about being a heuristic on the empty pattern", () => {
    expect(redosRisk("").level).toBe("low");
  });
});

/* ------------------------------------------------------------------ */
/* regex-exec — 编译 / 匹配 / 替换                                      */
/* ------------------------------------------------------------------ */

describe("compileRegex", () => {
  it("accepts valid patterns and dedupes allowed flags", () => {
    const r = compileRegex("a+", "ggg");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.re.flags).toBe("g");
  });

  it("rejects JS-invalid patterns with the engine message", () => {
    const r = compileRegex("(", "");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("Invalid regular expression");
  });

  it("rejects disallowed flags", () => {
    const r = compileRegex("a", "gy");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("invalid-flag:y");
  });

  it("only allows g/i/m/s/u", () => {
    expect(ALLOWED_FLAGS).toBe("gimsu");
  });
});

describe("collectMatches", () => {
  it("collects all matches for global regexes", () => {
    const r = compileRegex("a", "g");
    if (!r.ok) throw new Error("unreachable");
    const { matches, truncated } = collectMatches(r.re, "banana");
    expect(matches.map((m) => m.index)).toEqual([1, 3, 5]);
    expect(matches.every((m) => m.text === "a")).toBe(true);
    expect(truncated).toBe(false);
  });

  it("returns at most one match without the global flag", () => {
    const r = compileRegex("a", "");
    if (!r.ok) throw new Error("unreachable");
    const { matches } = collectMatches(r.re, "banana");
    expect(matches).toHaveLength(1);
    expect(matches[0].index).toBe(1);
  });

  it("advances past zero-length matches instead of looping forever", () => {
    const r = compileRegex("x*", "g");
    if (!r.ok) throw new Error("unreachable");
    const { matches } = collectMatches(r.re, "abc");
    expect(matches).toHaveLength(4);
    expect(matches.map((m) => m.index)).toEqual([0, 1, 2, 3]);
    expect(matches.every((m) => m.text === "")).toBe(true);
  });

  it("captures numbered and named groups", () => {
    const r = compileRegex("(?<y>\\d{4})-(\\d{2})", "");
    if (!r.ok) throw new Error("unreachable");
    const { matches } = collectMatches(r.re, "2026-11");
    expect(matches[0].named).toEqual({ y: "2026" });
    // 命名组同样占用编号位
    expect(matches[0].groups).toEqual(["2026", "11"]);
  });

  it("stops at the match limit and reports truncation", () => {
    const r = compileRegex("a", "g");
    if (!r.ok) throw new Error("unreachable");
    const { matches, truncated } = collectMatches(r.re, "a".repeat(MAX_MATCHES + 100));
    expect(matches).toHaveLength(MAX_MATCHES);
    expect(truncated).toBe(true);
  });

  it("caps the searched text to MAX_TEXT_LENGTH", () => {
    const r = compileRegex("\\d+", "g");
    if (!r.ok) throw new Error("unreachable");
    const long = "1".repeat(30_000);
    const { matches, truncated } = collectMatches(r.re, long);
    expect(matches).toHaveLength(1);
    expect(truncated).toBe(false);
    expect(matches[0].text.length).toBe(20_000);
  });
});

describe("regexReplace semantics", () => {
  it("replaces with group references $1 / $2", () => {
    const r = regexReplace("(\\w+) (\\w+)", "", "$2 $1", "hello world");
    expect(r).toMatchObject({ ok: true, output: "world hello", count: 1 });
  });

  it("counts matches only when global", () => {
    expect(regexReplace("a", "", "x", "banana")).toMatchObject({ ok: true, output: "bxnana", count: 1 });
    expect(regexReplace("a", "g", "x", "banana")).toMatchObject({ ok: true, output: "bxnxnx", count: 3 });
  });

  it("supports $& (whole match) and $$ (literal dollar)", () => {
    expect(regexReplace("o", "g", "[$&]", "foo")).toMatchObject({ ok: true, output: "f[o][o]" });
    // 每个 "o" 都换成一个 "$",两个匹配 → 两个 $
    expect(regexReplace("o", "g", "$$", "foo")).toMatchObject({ ok: true, output: "f$$" });
  });

  it("supports named group references $<name>", () => {
    const r = regexReplace("(?<first>\\w+) (?<second>\\w+)", "", "$<second>-$<first>", "hello world");
    expect(r).toMatchObject({ ok: true, output: "world-hello" });
  });

  it("returns the compile error for invalid patterns", () => {
    const r = regexReplace("(", "", "x", "abc");
    expect(r.ok).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* 库数据完整性                                                        */
/* ------------------------------------------------------------------ */

describe("regex library data", () => {
  const LOCALE_KEYS: LibraryLocale[] = ["en", "zh", "ja", "es", "pt"];

  it("ships at least 25 patterns", () => {
    expect(REGEX_LIBRARY.length).toBeGreaterThanOrEqual(25);
  });

  it("has unique ids and names in kebab-case ids", () => {
    const ids = new Set<string>();
    const names = new Set<string>();
    for (const e of REGEX_LIBRARY) {
      expect(e.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(ids.has(e.id), e.id).toBe(false);
      expect(names.has(e.name), e.name).toBe(false);
      ids.add(e.id);
      names.add(e.name);
    }
  });

  it("compiles every pattern with its declared flags (against the JS engine)", () => {
    for (const e of REGEX_LIBRARY) {
      const compiled = compileRegex(e.pattern, e.flags);
      expect(compiled.ok, `${e.id}: ${compiled.ok ? "" : compiled.error}`).toBe(true);
      for (const f of e.flags) {
        expect(ALLOWED_FLAGS.includes(f), `${e.id} flag ${f}`).toBe(true);
      }
    }
  });

  it("finds at least one match in its own sample", () => {
    for (const e of REGEX_LIBRARY) {
      const compiled = compileRegex(e.pattern, e.flags);
      if (!compiled.ok) throw new Error(`${e.id} does not compile`);
      const { matches } = collectMatches(compiled.re, e.sample);
      expect(matches.length, `${e.id} sample has no match`).toBeGreaterThan(0);
    }
  });

  it("has a one-line description in all five core locales", () => {
    for (const e of REGEX_LIBRARY) {
      for (const loc of LOCALE_KEYS) {
        const d = e.desc[loc];
        expect(d?.trim().length, `${e.id}:${loc}`).toBeGreaterThan(10);
      }
    }
  });

  it("descriptions stay one-line (no marketing fluff, no newlines)", () => {
    for (const e of REGEX_LIBRARY) {
      for (const d of Object.values(e.desc)) {
        expect(d).not.toMatch(/\n/);
        expect(d.length).toBeLessThan(200);
      }
    }
  });
});
