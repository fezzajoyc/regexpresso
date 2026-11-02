"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { CopyButton } from "@/components/client-ui";
import { ToolPanel } from "@/components/ui";
import { compileRegex, collectMatches, MAX_MATCHES } from "../_lib/regex-exec";
import { redosRisk } from "../_lib/regexplain";
import { pick, type Phrase } from "./phrases";

/**
 * regex-tester 引擎:真实 RegExp 在浏览器里跑(_lib/regex-exec 纯函数已测)。
 * 匹配高亮用 <mark class="regex-hit">;ReDoS 用 redosRisk 启发式给出诚实警示。
 */

const FLAGS = ["g", "i", "m", "s", "u"] as const;
const TEXT_LIMIT = 20_000;

const L: Record<string, Phrase> = {
  en: {
    pattern: "Pattern",
    patternPlaceholder: "e.g. \\d{4}-\\d{2}-\\d{2}",
    flags: "Flags",
    testText: "Test text",
    matches: "{n} matches",
    matchOne: "1 match",
    noMatches: "No matches — adjust the pattern or the text.",
    emptyPattern: "Type a pattern above to see live matches.",
    position: "at",
    groups: "groups",
    truncated: "Showing the first {n} matches — refine the pattern to see the rest.",
    invalid: "This pattern is not valid JavaScript:",
    riskHigh: "ReDoS risk: this pattern nests quantifiers and can hang on long input. Test with short samples only.",
    riskMedium: "Possible slow-backtracking pattern. Keep test text short.",
    flag_g: "global — find every match, not just the first",
    flag_i: "ignore case (A matches a)",
    flag_m: "multiline — ^ and $ also match at line breaks",
    flag_s: "dotAll — . also matches line breaks",
    flag_u: "unicode — enables \\u{…} and \\p{…}",
    textCapped: "Text is capped at 20,000 characters for this preview.",
  },
  zh: {
    pattern: "正则表达式",
    patternPlaceholder: "例如 \\d{4}-\\d{2}-\\d{2}",
    flags: "标志位",
    testText: "测试文本",
    matches: "共 {n} 处匹配",
    matchOne: "1 处匹配",
    noMatches: "没有匹配——调整一下表达式或文本试试。",
    emptyPattern: "在上方输入正则表达式,匹配结果会实时显示在这里。",
    position: "位置",
    groups: "捕获组",
    truncated: "仅显示前 {n} 处匹配——优化表达式可看到其余部分。",
    invalid: "这不是合法的 JavaScript 正则:",
    riskHigh: "ReDoS 风险:表达式存在嵌套量词,遇到长文本可能卡死浏览器。请只用短样例测试。",
    riskMedium: "该表达式可能存在回溯变慢的问题,建议保持测试文本简短。",
    flag_g: "global——找出全部匹配,而不只是第一处",
    flag_i: "ignore case——忽略大小写",
    flag_m: "multiline——^ 和 $ 也匹配换行处",
    flag_s: "dotAll——. 也匹配换行符",
    flag_u: "unicode——启用 \\u{…} 与 \\p{…}",
    textCapped: "预览文本最多取前 20,000 个字符。",
  },
  ja: {
    pattern: "正規表現",
    patternPlaceholder: "例: \\d{4}-\\d{2}-\\d{2}",
    flags: "フラグ",
    testText: "テストテキスト",
    matches: "{n} 件のマッチ",
    matchOne: "1 件のマッチ",
    noMatches: "マッチなし。正規表現かテキストを調整してください。",
    emptyPattern: "上に正規表現を入力すると、マッチ結果がリアルタイムで表示されます。",
    position: "位置",
    groups: "キャプチャ グループ",
    truncated: "最初の {n} 件のみ表示中。残りはパターンを絞ってください。",
    invalid: "有効な JavaScript の正規表現ではありません:",
    riskHigh: "ReDoS リスク:量詞が入れ子になっており、長い入力でフリーズする可能性があります。短いサンプルで試してください。",
    riskMedium: "バックトラッキングで遅くなる可能性のあるパターンです。短いテキストで試してください。",
    flag_g: "global — 先頭の 1 件だけでなくすべてにマッチ",
    flag_i: "ignore case — 大文字小文字を無視",
    flag_m: "multiline — ^ と $ が改行にも一致",
    flag_s: "dotAll — . が改行にも一致",
    flag_u: "unicode — \\u{…} と \\p{…} を有効化",
    textCapped: "プレビューは最大 20,000 文字です。",
  },
  es: {
    pattern: "Expresión",
    patternPlaceholder: "p. ej. \\d{4}-\\d{2}-\\d{2}",
    flags: "Banderas",
    testText: "Texto de prueba",
    matches: "{n} coincidencias",
    matchOne: "1 coincidencia",
    noMatches: "Sin coincidencias: ajusta la expresión o el texto.",
    emptyPattern: "Escribe una expresión arriba y verás las coincidencias en vivo.",
    position: "en",
    groups: "grupos",
    truncated: "Mostrando las primeras {n} coincidencias; refina la expresión para ver el resto.",
    invalid: "Esta expresión no es JavaScript válido:",
    riskHigh: "Riesgo de ReDoS: la expresión anida cuantificadores y puede colgar la pestaña con textos largos. Prueba solo con muestras cortas.",
    riskMedium: "Expresión posiblemente lenta por retroceso. Mantén el texto corto.",
    flag_g: "global — encuentra todas las coincidencias, no solo la primera",
    flag_i: "ignore case — ignora mayúsculas y minúsculas",
    flag_m: "multiline — ^ y $ también coinciden en saltos de línea",
    flag_s: "dotAll — . también coincide con saltos de línea",
    flag_u: "unicode — activa \\u{…} y \\p{…}",
    textCapped: "El texto se limita a 20.000 caracteres en esta vista.",
  },
  pt: {
    pattern: "Expressão",
    patternPlaceholder: "ex.: \\d{4}-\\d{2}-\\d{2}",
    flags: "Flags",
    testText: "Texto de teste",
    matches: "{n} correspondências",
    matchOne: "1 correspondência",
    noMatches: "Nenhuma correspondência — ajuste a expressão ou o texto.",
    emptyPattern: "Digite uma expressão acima para ver as correspondências ao vivo.",
    position: "em",
    groups: "grupos",
    truncated: "Mostrando as primeiras {n} correspondências; refine a expressão para ver o resto.",
    invalid: "Esta expressão não é JavaScript válido:",
    riskHigh: "Risco de ReDoS: a expressão aninha quantificadores e pode travar a aba com textos longos. Teste só com amostras curtas.",
    riskMedium: "Padrão possivelmente lento por retrocesso. Mantenha o texto curto.",
    flag_g: "global — encontra todas as correspondências, não só a primeira",
    flag_i: "ignore case — ignora maiúsculas e minúsculas",
    flag_m: "multiline — ^ e $ também correspondem a quebras de linha",
    flag_s: "dotAll — . também corresponde a quebras de linha",
    flag_u: "unicode — ativa \\u{…} e \\p{…}",
    textCapped: "O texto é limitado a 20.000 caracteres nesta visualização.",
  },
};

type Seg = { text: string; hit: boolean };

function highlight(text: string, matches: { index: number; text: string }[]): Seg[] {
  const segs: Seg[] = [];
  let pos = 0;
  for (const m of matches) {
    if (m.index > pos) segs.push({ text: text.slice(pos, m.index), hit: false });
    if (m.text.length > 0) segs.push({ text: m.text, hit: true });
    pos = m.index + m.text.length;
  }
  if (pos < text.length) segs.push({ text: text.slice(pos), hit: false });
  return segs;
}

export function RegexTesterEngine() {
  const { locale } = useI18n();
  const [pattern, setPattern] = useState("\\d{4}-\\d{2}-\\d{2}");
  const [flags, setFlags] = useState<string>("g");
  const [text, setText] = useState(
    "Invoices: 2026-01-15 paid, 2026-02-20 pending, 2026-03-30 due.",
  );

  const t = (k: string) => {
    const table = L[locale] ?? L.en!;
    return table[k] ?? L.en![k] ?? "";
  };

  const risk = useMemo(() => redosRisk(pattern), [pattern]);
  const compiled = useMemo(() => compileRegex(pattern, flags), [pattern, flags]);

  const capped = text.length > TEXT_LIMIT;
  const effectiveText = capped ? text.slice(0, TEXT_LIMIT) : text;
  const result = useMemo(() => {
    if (!compiled.ok || pattern === "") return null;
    return collectMatches(compiled.re, effectiveText);
  }, [compiled, pattern, effectiveText]);
  const segs = useMemo(
    () => (result && compiled.ok ? highlight(effectiveText, result.matches) : []),
    [result, effectiveText, compiled],
  );

  const toggleFlag = (f: string) =>
    setFlags((cur) => (cur.includes(f) ? cur.replace(f, "") : cur + f));

  return (
    <ToolPanel>
      <div className="grid gap-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-sub)]" htmlFor="rx-pattern">
            {t("pattern")}
          </label>
          <div className="flex items-center gap-2">
            <span className="mono hidden select-none text-[15px] text-[var(--color-sub)] sm:block">/</span>
            <input
              id="rx-pattern"
              className="field mono flex-1"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t("patternPlaceholder")}
              spellCheck={false}
              autoComplete="off"
            />
            <span className="mono hidden select-none text-[15px] text-[var(--color-sub)] sm:block">/{flags}</span>
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-[13px] font-semibold text-[var(--color-sub)]">{t("flags")}</span>
          <div className="flex flex-wrap gap-2">
            {FLAGS.map((f) => (
              <button
                key={f}
                type="button"
                title={t(`flag_${f}`)}
                aria-pressed={flags.includes(f)}
                onClick={() => toggleFlag(f)}
                className={`mono rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                  flags.includes(f)
                    ? "border-[var(--color-accent)] bg-[rgba(0,113,227,0.1)] text-[var(--color-accent-strong)]"
                    : "border-[var(--color-hairline)] text-[var(--color-sub)] hover:bg-[var(--color-surface)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[12.5px] leading-5 text-[var(--color-sub)]">
            {FLAGS.filter((f) => flags.includes(f)).map((f) => t(`flag_${f}`)).join(" · ")}
          </p>
        </div>

        {!compiled.ok && pattern !== "" && (
          <p className="error-bg rounded-xl border border-[rgba(178,80,0,0.25)] px-4 py-3 text-[14px] leading-6">
            <strong className="text-[var(--color-bad)]">{t("invalid")}</strong>{" "}
            <span className="mono text-[13px]">{compiled.error}</span>
          </p>
        )}

        {compiled.ok && risk.level === "high" && (
          <p className="error-bg rounded-xl border border-[rgba(178,80,0,0.25)] px-4 py-3 text-[14px] leading-6 text-[var(--color-bad)]">
            {t("riskHigh")}
          </p>
        )}
        {compiled.ok && risk.level === "medium" && (
          <p className="error-bg rounded-xl border border-[rgba(178,80,0,0.25)] px-4 py-3 text-[13.5px] leading-6 text-[var(--color-bad)]">
            {t("riskMedium")}
          </p>
        )}

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-sub)]" htmlFor="rx-text">
            {t("testText")}
          </label>
          <textarea
            id="rx-text"
            className="field mono"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
          {capped && <p className="mt-1 text-[12.5px] text-[var(--color-sub)]">{t("textCapped")}</p>}
        </div>

        {pattern === "" ? (
          <p className="rounded-xl bg-[var(--color-surface)] px-4 py-3 text-[14px] text-[var(--color-sub)]">
            {t("emptyPattern")}
          </p>
        ) : compiled.ok && result ? (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-[rgba(26,127,55,0.1)] px-3 py-1 text-[13px] font-semibold text-[var(--color-good)]">
                {result.matches.length === 1 ? t("matchOne") : t("matches").replace("{n}", String(result.matches.length))}
              </span>
              {result.truncated && (
                <span className="text-[12.5px] text-[var(--color-sub)]">{t("truncated").replace("{n}", String(MAX_MATCHES))}</span>
              )}
              <span className="ml-auto">
                <CopyButton value={pattern} />
              </span>
            </div>

            <div className="mono max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[var(--color-surface)] p-4 text-[14px] leading-6">
              {segs.map((s, i) =>
                s.hit ? (
                  <mark key={i} className="regex-hit text-[var(--color-ink)]">
                    {s.text}
                  </mark>
                ) : (
                  <span key={i}>{s.text}</span>
                ),
              )}
            </div>

            {result.matches.length > 0 && (
              <ol className="grid gap-2">
                {result.matches.map((m, i) => (
                  <li key={i} className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-card)] px-3.5 py-2.5 text-[13.5px]">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="mono text-[12px] font-semibold text-[var(--color-accent-strong)]">#{i + 1}</span>
                      <span className="text-[12px] text-[var(--color-sub)]">
                        {t("position")} {m.index}
                      </span>
                      <code className="mono break-all text-[var(--color-ink)]">{m.text === "" ? "∅" : m.text}</code>
                    </div>
                    {(m.groups.length > 0 || Object.keys(m.named).length > 0) && (
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 pl-8 text-[12.5px] text-[var(--color-sub)]">
                        {m.groups.map((g, gi) =>
                          g !== undefined ? (
                            <span key={gi} className="mono">
                              {t("groups")} {gi + 1}: <span className="text-[var(--color-ink)]">{g}</span>
                            </span>
                          ) : null,
                        )}
                        {Object.entries(m.named).map(([name, v]) =>
                          v !== undefined ? (
                            <span key={name} className="mono">
                              {name}: <span className="text-[var(--color-ink)]">{v}</span>
                            </span>
                          ) : null,
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            )}
            {result.matches.length === 0 && (
              <p className="rounded-xl bg-[var(--color-surface)] px-4 py-3 text-[14px] text-[var(--color-sub)]">
                {t("noMatches")}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </ToolPanel>
  );
}
