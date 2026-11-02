/**
 * regexplain.ts — 纯正则词法分析 + ReDoS 启发式风险评分。
 *
 * 设计契约(见 site-engineering skill §1.3):
 *  - 本文件保持 locale-free:token 只携带 kind + 参数 + 原文(raw),
 *    引擎(engine)负责把 kind 映射成本地化句子;MCP 侧输出英文。
 *  - explainRegex 对任何输入都不抛异常:解析不动的位置输出 error token 并停止。
 *  - redosRisk 是公开声明的启发式(非完整分析),覆盖最常见的灾难性回溯形态。
 */

export type GroupType =
  | "capturing"
  | "noncapturing"
  | "named"
  | "lookahead"
  | "negativeLookahead"
  | "lookbehind"
  | "negativeLookbehind";

export type AnchorType = "start" | "end" | "word" | "nonword";

export type ClassMember =
  | { type: "char"; raw: string }
  | { type: "range"; from: string; to: string; raw: string }
  | { type: "escape"; code: string; negated: boolean; raw: string };

export type RegexToken =
  | { kind: "literal"; raw: string; text: string }
  | { kind: "class"; raw: string; negated: boolean; members: ClassMember[] }
  | { kind: "escape"; raw: string; code: string; negated: boolean; identity: boolean }
  | { kind: "dot"; raw: string }
  | { kind: "quantifier"; raw: string; min: number; max: number | null; lazy: boolean; target: string }
  | { kind: "group"; raw: string; groupType: GroupType; name?: string }
  | { kind: "groupEnd"; raw: string }
  | { kind: "anchor"; raw: string; anchorType: AnchorType }
  | { kind: "alternation"; raw: string }
  | { kind: "backref"; raw: string; ref: string; named: boolean }
  | { kind: "error"; raw: string; message: string; position: number };

export type TokenizeResult = {
  tokens: RegexToken[];
  /** 第一个 error token 的位置;无错误时为 -1 */
  errorAt: number;
};

const SHORTHAND = new Set(["d", "w", "s"]);
const QUANT_RE = /^\{(\d+)(?:(,)(\d*)?)?\}/;

/**
 * 把一个正则 pattern 拆成 token 流。永不抛异常;
 * 遇到无法解析的语法时输出一个 error token 并停止。
 */
export function explainRegex(pattern: string): RegexToken[] {
  return tokenize(pattern).tokens;
}

export function tokenize(pattern: string): TokenizeResult {
  const tokens: RegexToken[] = [];
  const src = pattern;
  let i = 0;
  let lastAtom: string | null = null; // 最近一个可被量词修饰的原子(原文);null = 不可修饰
  const groupStack: number[] = []; // 每层组的开括号在 src 中的起始下标

  const pushLiteralChar = (ch: string) => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === "literal") {
      last.raw += ch;
      last.text += ch;
    } else {
      tokens.push({ kind: "literal", raw: ch, text: ch });
    }
    lastAtom = ch;
  };

  const err = (message: string): TokenizeResult => {
    tokens.push({ kind: "error", raw: src.slice(i, i + 1), message, position: i });
    return { tokens, errorAt: i };
  };

  while (i < src.length) {
    const ch = src[i];

    // ── 转义 ──
    if (ch === "\\") {
      const next = src[i + 1];
      if (next === undefined) return err("trailing backslash");
      const lower = next.toLowerCase();
      if (SHORTHAND.has(lower)) {
        const raw = src.slice(i, i + 2);
        tokens.push({ kind: "escape", raw, code: lower, negated: next !== lower, identity: false });
        lastAtom = raw;
        i += 2;
        continue;
      }
      if (next === "b" || next === "B") {
        tokens.push({ kind: "anchor", raw: src.slice(i, i + 2), anchorType: next === "b" ? "word" : "nonword" });
        lastAtom = null; // 零宽断言不可被量词修饰
        i += 2;
        continue;
      }
      if (next === "k") {
        const m = /^k<([^>]*)>/.exec(src.slice(i + 1));
        if (m) {
          const raw = src.slice(i, i + 1 + m[0].length);
          tokens.push({ kind: "backref", raw, ref: m[1], named: true });
          lastAtom = raw;
          i += raw.length;
          continue;
        }
        const raw = src.slice(i, i + 2);
        tokens.push({ kind: "escape", raw, code: "k", negated: false, identity: true });
        lastAtom = raw;
        i += 2;
        continue;
      }
      if (/[1-9]/.test(next)) {
        let num = next;
        let j = i + 2;
        while (j < src.length && /[0-9]/.test(src[j])) {
          num += src[j];
          j++;
        }
        const raw = "\\" + num;
        tokens.push({ kind: "backref", raw, ref: num, named: false });
        lastAtom = raw;
        i = j;
        continue;
      }
      if (lower === "p") {
        const m = /^p\{[^}]*\}/i.exec(src.slice(i + 1));
        if (m) {
          const raw = src.slice(i, i + 1 + m[0].length);
          tokens.push({ kind: "escape", raw, code: "p", negated: next === "P", identity: false });
          lastAtom = raw;
          i += raw.length;
          continue;
        }
      }
      if (next === "x" || next === "u") {
        const m =
          next === "x"
            ? /^x[0-9a-fA-F]{2}/.exec(src.slice(i + 1))
            : /^u(?:\{[0-9a-fA-F]+\}|[0-9a-fA-F]{4})/.exec(src.slice(i + 1));
        if (m) {
          const raw = src.slice(i, i + 1 + m[0].length);
          tokens.push({ kind: "escape", raw, code: raw.slice(1), negated: false, identity: false });
          lastAtom = raw;
          i += raw.length;
          continue;
        }
      }
      // 其余一律按「转义后的字面量」处理(\n \t \. \* \\ \- …)
      const raw = src.slice(i, i + 2);
      const identity = /[a-zA-Z]/.test(next) && !"nrtfv".includes(next);
      tokens.push({ kind: "escape", raw, code: next, negated: false, identity });
      lastAtom = raw;
      i += 2;
      continue;
    }

    // ── 字符类 ──
    // 注:按 JS 非 u 模式(Annex B)语义——首个 "]" 即闭类(可为空类),
    // 类外的 "]" 是字面量(由末尾的 fallback 处理)。
    if (ch === "[") {
      const start = i;
      i++;
      let negated = false;
      if (src[i] === "^") {
        negated = true;
        i++;
      }
      const members: ClassMember[] = [];
      let closed = false;
      while (i < src.length) {
        const c = src[i];
        if (c === "]") {
          closed = true;
          i++;
          break;
        }
        if (c === "\\") {
          const n = src[i + 1];
          if (n === undefined) return err("unterminated character class");
          const lower = n.toLowerCase();
          members.push({
            type: "escape",
            code: SHORTHAND.has(lower) ? lower : n,
            negated: SHORTHAND.has(lower) && n !== lower,
            raw: src.slice(i, i + 2),
          });
          i += 2;
          continue;
        }
        // 范围 a-z(- 两侧均非转义且不在端点)
        if (src[i + 1] === "-" && src[i + 2] !== undefined && src[i + 2] !== "]") {
          members.push({ type: "range", from: c, to: src[i + 2], raw: src.slice(i, i + 3) });
          i += 3;
          continue;
        }
        members.push({ type: "char", raw: c });
        i++;
      }
      if (!closed) return err("unterminated character class");
      const raw = src.slice(start, i);
      tokens.push({ kind: "class", raw, negated, members });
      lastAtom = raw;
      continue;
    }

    // ── 量词(* + ?)──
    if (ch === "*" || ch === "+" || ch === "?") {
      const target = splitLastLiteral(tokens, lastAtom);
      if (target === null) return err("nothing to repeat");
      let next = i + 1;
      let lazy = false;
      if (src[next] === "?") {
        lazy = true;
        next++;
      }
      const min = ch === "+" ? 1 : 0;
      const max = ch === "*" || ch === "+" ? null : 1;
      tokens.push({ kind: "quantifier", raw: src.slice(i, next), min, max, lazy, target });
      lastAtom = null; // 量词化的原子不能再被量词(JS 同样拒绝 a++)
      i = next;
      continue;
    }
    if (ch === "{") {
      const m = QUANT_RE.exec(src.slice(i));
      if (m) {
        const target = splitLastLiteral(tokens, lastAtom);
        if (target === null) return err("nothing to repeat");
        const min = parseInt(m[1], 10);
        const hasComma = m[2] === ",";
        const max = hasComma ? (m[3] ? parseInt(m[3], 10) : null) : min;
        let next = i + m[0].length;
        let lazy = false;
        if (src[next] === "?") {
          lazy = true;
          next++;
        }
        tokens.push({ kind: "quantifier", raw: src.slice(i, next), min, max, lazy, target });
        lastAtom = null;
        i = next;
        continue;
      }
      pushLiteralChar(ch); // JS 非 u 模式把 {,2} 当字面量
      i++;
      continue;
    }

    // ── 分组 ──
    if (ch === "(") {
      const g = readGroupOpen(src, i);
      if (!g) return err("invalid group syntax");
      tokens.push(g.token);
      groupStack.push(i);
      lastAtom = null;
      i = g.next;
      continue;
    }
    if (ch === ")") {
      const start = groupStack.pop();
      if (start === undefined) return err("unmatched closing parenthesis");
      tokens.push({ kind: "groupEnd", raw: ")" });
      lastAtom = src.slice(start, i + 1); // 整个组成为可量词原子
      i++;
      continue;
    }

    // ── 锚点 / 选择 / 点 ──
    if (ch === "^") {
      tokens.push({ kind: "anchor", raw: "^", anchorType: "start" });
      lastAtom = null;
      i++;
      continue;
    }
    if (ch === "$") {
      tokens.push({ kind: "anchor", raw: "$", anchorType: "end" });
      lastAtom = null;
      i++;
      continue;
    }
    if (ch === "|") {
      tokens.push({ kind: "alternation", raw: "|" });
      lastAtom = null;
      i++;
      continue;
    }
    if (ch === ".") {
      tokens.push({ kind: "dot", raw: "." });
      lastAtom = ".";
      i++;
      continue;
    }

    pushLiteralChar(ch);
    i++;
  }

  if (groupStack.length > 0) {
    tokens.push({ kind: "error", raw: "", message: "unclosed group", position: src.length });
    return { tokens, errorAt: src.length };
  }

  return { tokens, errorAt: -1 };
}

function readGroupOpen(src: string, i: number): { next: number; token: RegexToken } | null {
  const rest = src.slice(i);
  if (rest.startsWith("(?")) {
    const c = rest[2];
    if (c === ":") return { next: i + 3, token: { kind: "group", raw: "(?:", groupType: "noncapturing" } };
    if (c === "=") return { next: i + 3, token: { kind: "group", raw: "(?=", groupType: "lookahead" } };
    if (c === "!") return { next: i + 3, token: { kind: "group", raw: "(?!", groupType: "negativeLookahead" } };
    if (c === "<") {
      if (rest[3] === "=") return { next: i + 4, token: { kind: "group", raw: "(?<=", groupType: "lookbehind" } };
      if (rest[3] === "!") return { next: i + 4, token: { kind: "group", raw: "(?<!", groupType: "negativeLookbehind" } };
      const m = /^<([a-zA-Z_][a-zA-Z0-9_]*)>/.exec(rest.slice(2));
      if (m)
        return {
          next: i + 2 + m[0].length,
          token: { kind: "group", raw: "(?<" + m[1] + ">", groupType: "named", name: m[1] },
        };
      return null;
    }
    return null;
  }
  return { next: i + 1, token: { kind: "group", raw: "(", groupType: "capturing" } };
}

/**
 * 量词落在多字符字面量上时,把最后一个字符从字面量 token 里拆出来
 * ("abc+" → 字面量 "ab" + 量词 target "c"),返回量词目标;无处可拆返回 null。
 */
function splitLastLiteral(tokens: RegexToken[], lastAtom: string | null): string | null {
  const last = tokens[tokens.length - 1];
  if (last && last.kind === "literal" && last.text.length > 1) {
    const tail = last.text.slice(-1);
    last.raw = last.raw.slice(0, -1);
    last.text = last.text.slice(0, -1);
    return tail;
  }
  return lastAtom !== null && lastAtom !== "" ? lastAtom : null;
}

/* ------------------------------------------------------------------ */
/* ReDoS 启发式                                                        */
/* ------------------------------------------------------------------ */

export type RedosReasonCode = "nested-unbounded" | "ambiguous-alternation" | "nested-bounded";

export type RedosReason = { code: RedosReasonCode; detail: string };
export type RedosLevel = "low" | "medium" | "high";

export type RedosAssessment = { level: RedosLevel; reasons: RedosReason[] };

const RANK: Record<RedosLevel, number> = { low: 0, medium: 1, high: 2 };

/**
 * 启发式 ReDoS 风险评估(声明:非完整分析,不保证穷尽):
 *  - high   量词作用在「内部还有无界量词」的组上,如 (a+)+、(\d*)*;
 *           或组内有首单元重叠的分支选择,如 (a|aa)+
 *  - medium 量词作用在含量词的组上(有界嵌套),如 (a{1,3}){1,3}
 *  - low    其余(单层量词、字符类、固定内容组)
 */
export function redosRisk(pattern: string): RedosAssessment {
  const reasons: RedosReason[] = [];
  assess(pattern, reasons, 0);
  let level: RedosLevel = "low";
  for (const r of reasons) {
    const want: RedosLevel =
      r.code === "nested-unbounded" || r.code === "ambiguous-alternation" ? "high" : "medium";
    if (RANK[want] > RANK[level]) level = want;
  }
  return { level, reasons };
}

function assess(pattern: string, reasons: RedosReason[], depth: number): void {
  if (depth > 4 || pattern.length > 2000) return;
  const { tokens } = tokenize(pattern);

  tokens.forEach((t, idx) => {
    if (t.kind !== "quantifier") return;
    const target = t.target ?? "";
    if (!target.startsWith("(") || !target.endsWith(")")) return;
    const prev = tokens[idx - 1];
    if (!prev || prev.kind !== "groupEnd") return;

    // 从量词往回找配对的组开括号。
    // 倒序扫描:groupEnd 是「待配对的闭括号」→ d++;group 使 d--;
    // d 减到 0 的那个 group 就是与量词前那个 groupEnd 配对的开括号。
    let d = 0;
    let openIdx = -1;
    for (let k = idx - 1; k >= 0; k--) {
      const tk = tokens[k];
      if (tk.kind === "groupEnd") d++;
      else if (tk.kind === "group") {
        d--;
        if (d === 0) {
          openIdx = k;
          break;
        }
      } else if (tk.kind === "error") return;
    }
    if (openIdx < 0) return;

    const body = tokens.slice(openIdx + 1, idx - 1);
    const innerPattern = target.slice(groupOpenLen(target), -1);
    assess(innerPattern, reasons, depth + 1);

    const hasUnbounded = body.some((b) => b.kind === "quantifier" && b.max === null);
    const branches = splitBranches(body);
    const ambiguous = branches.length > 1 && branchesOverlap(branches);

    if (hasUnbounded) {
      reasons.push({ code: "nested-unbounded", detail: target });
    } else if (ambiguous) {
      reasons.push({ code: "ambiguous-alternation", detail: target });
    } else if (body.some((b) => b.kind === "quantifier")) {
      reasons.push({ code: "nested-bounded", detail: target });
    }
  });
}

function groupOpenLen(target: string): number {
  if (!target.startsWith("(")) return 0;
  if (target.startsWith("(?")) {
    if (target[2] === "<") {
      const m = /^<([a-zA-Z_][a-zA-Z0-9_]*)>/.exec(target.slice(2));
      if (m) return 2 + m[0].length;
      return 4; // (?<= / (?<!
    }
    return 3; // (?: (?= (?!
  }
  return 1;
}

/** 按顶层 | 切分支(忽略嵌套组内的 |) */
function splitBranches(body: RegexToken[]): RegexToken[][] {
  const branches: RegexToken[][] = [[]];
  let depth = 0;
  for (const t of body) {
    if (t.kind === "group") depth++;
    else if (t.kind === "groupEnd") depth--;
    if (t.kind === "alternation" && depth === 0) {
      branches.push([]);
      continue;
    }
    branches[branches.length - 1].push(t);
  }
  return branches;
}

/** 分支首单元是否可能匹配相同输入(重叠 ⇒ 回溯歧义) */
function branchesOverlap(branches: RegexToken[][]): boolean {
  const units = branches.map(firstUnit).filter((u): u is string => u !== null);
  for (let a = 0; a < units.length; a++) {
    for (let b = a + 1; b < units.length; b++) {
      if (unitsOverlap(units[a], units[b])) return true;
    }
  }
  return false;
}

/**
 * 分支的第一个「可匹配单元」的规范化表示:
 *  - 字面量 → 首字符
 *  - 简写类 → "\\d" 一族(带 "^" 前缀表示否定)
 *  - 字符类 → "[...]"(带 "^" 前缀表示否定)
 *  - 空分支(可匹配空串)→ ""
 *  - 无法判定(组开头、反引用等)→ null
 */
function firstUnit(branch: RegexToken[]): string | null {
  for (const t of branch) {
    if (t.kind === "literal") return t.text.length > 0 ? t.text[0] : "";
    if (t.kind === "escape") {
      if (["d", "w", "s"].includes(t.code)) return (t.negated ? "^" : "") + "\\" + t.code;
      return t.code.length > 0 ? t.code[0] : "";
    }
    if (t.kind === "class")
      return (t.negated ? "^" : "") + "[" + t.members.map((m) => m.raw).join("") + "]";
    if (t.kind === "dot") return ".";
    if (t.kind === "anchor") continue; // 零宽,继续看下一个
    return null; // group / quantifier / backref / error 开头的分支不比较
  }
  return ""; // 空分支可匹配空串
}

function isSetUnit(u: string): boolean {
  return u.startsWith("[") || u.startsWith("^\\") || u === "\\d" || u === "\\w" || u === "\\s";
}

function unitsOverlap(a: string, b: string): boolean {
  if (a === "" || b === "") return true; // 空分支必然重叠
  if (a === b) return true;
  const sa = isSetUnit(a) ? null : a[0];
  const sb = isSetUnit(b) ? null : b[0];
  if (sa && !sb) return charInClass(sa, b);
  if (sb && !sa) return charInClass(sb, a);
  return false; // 集合 vs 集合只在完全相等时判重叠(保守)
}

/** 字符 ch 是否可能落在 set-unit 的匹配范围里(近似展开 shorthand 与范围) */
function charInClass(ch: string, unit: string): boolean {
  const negated = unit.startsWith("^");
  const body = negated ? unit.slice(1) : unit;
  let hit: boolean;
  if (body === "\\d") hit = /[0-9]/.test(ch);
  else if (body === "\\w") hit = /[A-Za-z0-9_]/.test(ch);
  else if (body === "\\s") hit = /\s/.test(ch);
  else if (body.startsWith("[") && body.endsWith("]")) {
    hit = false;
    const inner = body.slice(1, -1);
    let i = 0;
    while (i < inner.length) {
      if (inner[i] === "\\" && i + 1 < inner.length) {
        const code = inner[i + 1].toLowerCase();
        if (code === "d" && /[0-9]/.test(ch)) hit = true;
        if (code === "w" && /[A-Za-z0-9_]/.test(ch)) hit = true;
        if (code === "s" && /\s/.test(ch)) hit = true;
        if (inner[i + 1] === ch) hit = true;
        i += 2;
      } else if (i + 2 < inner.length && inner[i + 1] === "-") {
        if (ch >= inner[i] && ch <= inner[i + 2]) hit = true;
        i += 3;
      } else {
        if (inner[i] === ch) hit = true;
        i++;
      }
    }
  } else {
    return false;
  }
  return negated ? !hit : hit;
}
