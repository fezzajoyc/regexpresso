/**
 * regex-exec.ts — 正则执行层的纯函数封装(编译、匹配收集、替换)。
 * 引擎与 MCP 工具共用这一份实现;全部同步执行、有匹配条数上限。
 * ReDoS 说明:这里不做超时中断(浏览器/Node 同步执行做不到),
 * 调用方(regex-tester 引擎)用 redosRisk() 启发式提示用户,详见各工具页。
 */

export const ALLOWED_FLAGS = "gimsu";
export const MAX_MATCHES = 500;
export const MAX_TEXT_LENGTH = 20_000;

export type Compiled = { ok: true; re: RegExp } | { ok: false; error: string };

/** 编译 pattern+flags;flags 只允许 g/i/m/s/u(去重),非法输入返回错误信息 */
export function compileRegex(pattern: string, flags: string): Compiled {
  const clean = Array.from(new Set(flags.split(""))).filter((f) => ALLOWED_FLAGS.includes(f)).join("");
  for (const f of flags) {
    if (!ALLOWED_FLAGS.includes(f)) return { ok: false, error: `invalid-flag:${f}` };
  }
  try {
    return { ok: true, re: new RegExp(pattern, clean) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export type MatchInfo = {
  index: number;
  text: string;
  groups: (string | undefined)[];
  named: Record<string, string | undefined>;
};

export type MatchCollection = {
  matches: MatchInfo[];
  truncated: boolean;
};

/** 收集匹配(全局时逐条 exec,零宽匹配手动步进避免死循环) */
export function collectMatches(re: RegExp, text: string, limit = MAX_MATCHES): MatchCollection {
  const source = text.length > MAX_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : text;
  const matches: MatchInfo[] = [];
  let truncated = false;

  const global = re.global;
  re.lastIndex = 0;
  while (true) {
    const m = re.exec(source);
    if (m === null) break;
    matches.push({
      index: m.index,
      text: m[0],
      groups: m.slice(1),
      named: m.groups ? { ...m.groups } : {},
    });
    if (m[0] === "") {
      re.lastIndex++;
      if (re.lastIndex > source.length) break;
    }
    if (!global) break;
    if (matches.length >= limit) {
      truncated = true;
      break;
    }
  }
  return { matches, truncated };
}

export type ReplaceResult =
  | { ok: true; output: string; count: number; truncated: boolean }
  | { ok: false; error: string };

/** String.replace 语义的纯封装:全局时统计匹配数,输出替换结果 */
export function regexReplace(
  pattern: string,
  flags: string,
  replacement: string,
  text: string,
): ReplaceResult {
  const compiled = compileRegex(pattern, flags);
  if (!compiled.ok) return compiled;
  const { matches, truncated } = collectMatches(compiled.re, text);
  try {
    const output = text.replace(compiled.re, replacement);
    return { ok: true, output, count: matches.length, truncated };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
