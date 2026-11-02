"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { CopyButton } from "@/components/client-ui";
import { ToolPanel } from "@/components/ui";
import { compileRegex, regexReplace, MAX_MATCHES, MAX_TEXT_LENGTH } from "../_lib/regex-exec";
import { redosRisk } from "../_lib/regexplain";
import { pick, type Phrase } from "./phrases";

/**
 * regex-replace 引擎:pattern + replacement($1 / $& / $<name>)+ flags →
 * 实时替换结果与匹配计数。执行走 _lib/regex-exec 的纯封装(已测)。
 */

const FLAGS = ["g", "i", "m", "s", "u"] as const;
const PRESETS = [
  { pattern: "(\\w+) (\\w+)", replacement: "$2 $1", label: "swap" },
  { pattern: "\\s+", replacement: " ", label: "collapse" },
  { pattern: "(\\d{4})-(\\d{2})-(\\d{2})", replacement: "$3/$2/$1", label: "dates" },
] as const;

const L: Record<string, Phrase> = {
  en: {
    pattern: "Pattern",
    patternPlaceholder: "e.g. (\\w+) (\\w+)",
    replacement: "Replacement",
    replacementPlaceholder: "e.g. $2 $1 — $1 is group 1, $& the whole match, $<name> a named group",
    flags: "Flags",
    testText: "Text",
    output: "Result",
    replacedCount: "{n} matches replaced",
    replacedOne: "1 match replaced",
    noMatches: "No matches — nothing to replace.",
    emptyPattern: "Type a pattern and a replacement to see the result live.",
    invalid: "This pattern is not valid JavaScript:",
    riskHigh: "ReDoS risk: nested quantifiers can hang the tab on long text. Test with short samples only.",
    riskMedium: "Possible slow-backtracking pattern. Keep the text short.",
    textCapped: "Text is capped at 20,000 characters for this preview.",
    truncated: "Match count capped at {n}.",
    flag_g: "global — replace every match, not just the first",
    flag_i: "ignore case",
    flag_m: "multiline — ^ and $ match at line breaks",
    flag_s: "dotAll — . also matches line breaks",
    flag_u: "unicode — enables \\u{…} and \\p{…}",
    presetSwap: "Swap two words",
    presetCollapse: "Collapse whitespace",
    presetDates: "ISO → US date",
  },
  zh: {
    pattern: "正则表达式",
    patternPlaceholder: "例如 (\\w+) (\\w+)",
    replacement: "替换为",
    replacementPlaceholder: "例如 $2 $1——$1 是第 1 组,$& 是整个匹配,$<名字> 是命名组",
    flags: "标志位",
    testText: "文本",
    output: "结果",
    replacedCount: "替换了 {n} 处",
    replacedOne: "替换了 1 处",
    noMatches: "没有匹配——没有可替换的内容。",
    emptyPattern: "输入表达式和替换文本,结果会实时显示在这里。",
    invalid: "这不是合法的 JavaScript 正则:",
    riskHigh: "ReDoS 风险:嵌套量词在长文本上可能卡死页面。请只用短样例测试。",
    riskMedium: "该表达式可能回溯变慢,建议保持文本简短。",
    textCapped: "预览文本最多取前 20,000 个字符。",
    truncated: "匹配计数上限 {n} 处。",
    flag_g: "global——替换全部匹配,而不只是第一处",
    flag_i: "ignore case——忽略大小写",
    flag_m: "multiline——^ 和 $ 也匹配换行处",
    flag_s: "dotAll——. 也匹配换行符",
    flag_u: "unicode——启用 \\u{…} 与 \\p{…}",
    presetSwap: "交换两个单词",
    presetCollapse: "合并空白",
    presetDates: "ISO → 美式日期",
  },
  ja: {
    pattern: "正規表現",
    patternPlaceholder: "例: (\\w+) (\\w+)",
    replacement: "置換後",
    replacementPlaceholder: "例: $2 $1 — $1 はグループ 1、$& はマッチ全体、$<名前> は名前付きグループ",
    flags: "フラグ",
    testText: "テキスト",
    output: "結果",
    replacedCount: "{n} 件を置換",
    replacedOne: "1 件を置換",
    noMatches: "マッチなし — 置換する箇所がありません。",
    emptyPattern: "正規表現と置換後のテキストを入力すると、結果がリアルタイムで表示されます。",
    invalid: "有効な JavaScript の正規表現ではありません:",
    riskHigh: "ReDoS リスク:入れ子の量詞は長いテキストでタブを固めることがあります。短いサンプルで試してください。",
    riskMedium: "バックトラッキングが遅くなる可能性があります。短いテキストで。",
    textCapped: "プレビューは最大 20,000 文字です。",
    truncated: "マッチ数は {n} 件で上限です。",
    flag_g: "global — すべてのマッチを置換",
    flag_i: "ignore case — 大文字小文字を無視",
    flag_m: "multiline — ^ と $ が改行にも一致",
    flag_s: "dotAll — . が改行にも一致",
    flag_u: "unicode — \\u{…} と \\p{…} を有効化",
    presetSwap: "2 語を入れ替え",
    presetCollapse: "空白をまとめる",
    presetDates: "ISO → 米国式の日付",
  },
  es: {
    pattern: "Expresión",
    patternPlaceholder: "p. ej. (\\w+) (\\w+)",
    replacement: "Reemplazo",
    replacementPlaceholder: "p. ej. $2 $1 — $1 es el grupo 1, $& toda la coincidencia, $<nombre> un grupo con nombre",
    flags: "Banderas",
    testText: "Texto",
    output: "Resultado",
    replacedCount: "{n} coincidencias reemplazadas",
    replacedOne: "1 coincidencia reemplazada",
    noMatches: "Sin coincidencias — nada que reemplazar.",
    emptyPattern: "Escribe una expresión y un reemplazo para ver el resultado en vivo.",
    invalid: "Esta expresión no es JavaScript válido:",
    riskHigh: "Riesgo de ReDoS: los cuantificadores anidados pueden colgar la pestaña con textos largos. Prueba solo con muestras cortas.",
    riskMedium: "Expresión posiblemente lenta por retroceso. Mantén el texto corto.",
    textCapped: "El texto se limita a 20.000 caracteres en esta vista.",
    truncated: "Recuento de coincidencias limitado a {n}.",
    flag_g: "global — reemplaza todas las coincidencias",
    flag_i: "ignore case — ignora mayúsculas y minúsculas",
    flag_m: "multiline — ^ y $ coinciden en saltos de línea",
    flag_s: "dotAll — . también coincide con saltos de línea",
    flag_u: "unicode — activa \\u{…} y \\p{…}",
    presetSwap: "Intercambiar dos palabras",
    presetCollapse: "Colapsar espacios",
    presetDates: "ISO → fecha EE. UU.",
  },
  pt: {
    pattern: "Expressão",
    patternPlaceholder: "ex.: (\\w+) (\\w+)",
    replacement: "Substituição",
    replacementPlaceholder: "ex.: $2 $1 — $1 é o grupo 1, $& o longo todo, $<nome> um grupo nomeado",
    flags: "Flags",
    testText: "Texto",
    output: "Resultado",
    replacedCount: "{n} correspondências substituídas",
    replacedOne: "1 correspondência substituída",
    noMatches: "Nenhuma correspondência — nada a substituir.",
    emptyPattern: "Digite uma expressão e uma substituição para ver o resultado ao vivo.",
    invalid: "Esta expressão não é JavaScript válido:",
    riskHigh: "Risco de ReDoS: quantificadores aninhados podem travar a aba com textos longos. Teste só com amostras curtas.",
    riskMedium: "Padrão possivelmente lento por retrocesso. Mantenha o texto curto.",
    textCapped: "O texto é limitado a 20.000 caracteres nesta visualização.",
    truncated: "Contagem de correspondências limitada a {n}.",
    flag_g: "global — substitui todas as correspondências",
    flag_i: "ignore case — ignora maiúsculas e minúsculas",
    flag_m: "multiline — ^ e $ correspondem a quebras de linha",
    flag_s: "dotAll — . também corresponde a quebras de linha",
    flag_u: "unicode — ativa \\u{…} e \\p{…}",
    presetSwap: "Trocar duas palavras",
    presetCollapse: "Colapsar espaços",
    presetDates: "ISO → data EUA",
  },
};

const SAMPLE_TEXT = "first last\n2026-11-01  too   much space";

export function RegexReplaceEngine() {
  const { locale } = useI18n();
  const [pattern, setPattern] = useState("(\\w+) (\\w+)");
  const [replacement, setReplacement] = useState("$2 $1");
  const [flags, setFlags] = useState<string>("gm");
  const [text, setText] = useState(SAMPLE_TEXT);

  const t = (k: string) => {
    const table = L[locale] ?? L.en!;
    return table[k] ?? L.en![k] ?? "";
  };

  const risk = useMemo(() => redosRisk(pattern), [pattern]);
  const compiled = useMemo(() => compileRegex(pattern, flags), [pattern, flags]);
  const capped = text.length > MAX_TEXT_LENGTH;
  const effectiveText = capped ? text.slice(0, MAX_TEXT_LENGTH) : text;

  const result = useMemo(() => {
    if (!compiled.ok || pattern === "") return null;
    return regexReplace(pattern, flags, replacement, effectiveText);
  }, [compiled, pattern, flags, replacement, effectiveText]);

  const toggleFlag = (f: string) =>
    setFlags((cur) => (cur.includes(f) ? cur.replace(f, "") : cur + f));

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setPattern(p.pattern);
    setReplacement(p.replacement);
  };

  return (
    <ToolPanel>
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-sub)]" htmlFor="rxr-pattern">
              {t("pattern")}
            </label>
            <input
              id="rxr-pattern"
              className="field mono"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t("patternPlaceholder")}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-sub)]" htmlFor="rxr-replacement">
              {t("replacement")}
            </label>
            <input
              id="rxr-replacement"
              className="field mono"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder={t("replacementPlaceholder")}
              spellCheck={false}
              autoComplete="off"
            />
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
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="rounded-full border border-[var(--color-hairline)] px-3 py-1 text-[12.5px] text-[var(--color-sub)] transition-colors hover:bg-[var(--color-surface)]"
            >
              {t(`preset${p.label.charAt(0).toUpperCase()}${p.label.slice(1)}`)}
            </button>
          ))}
        </div>

        {!compiled.ok && pattern !== "" && (
          <p className="error-bg rounded-xl border border-[rgba(178,80,0,0.25)] px-4 py-3 text-[14px] leading-6">
            <strong className="text-[var(--color-bad)]">{t("invalid")}</strong>{" "}
            <span className="mono text-[13px]">{compiled.error}</span>
          </p>
        )}
        {compiled.ok && risk.level !== "low" && (
          <p className="error-bg rounded-xl border border-[rgba(178,80,0,0.25)] px-4 py-3 text-[13.5px] leading-6 text-[var(--color-bad)]">
            {risk.level === "high" ? t("riskHigh") : t("riskMedium")}
          </p>
        )}

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-sub)]" htmlFor="rxr-text">
            {t("testText")}
          </label>
          <textarea
            id="rxr-text"
            className="field mono"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
          {capped && <p className="mt-1 text-[12.5px] text-[var(--color-sub)]">{t("textCapped")}</p>}
        </div>

        {pattern === "" || replacement === "" ? (
          <p className="rounded-xl bg-[var(--color-surface)] px-4 py-3 text-[14px] text-[var(--color-sub)]">
            {t("emptyPattern")}
          </p>
        ) : result?.ok ? (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-[rgba(26,127,55,0.1)] px-3 py-1 text-[13px] font-semibold text-[var(--color-good)]">
                {result.count === 1 ? t("replacedOne") : t("replacedCount").replace("{n}", String(result.count))}
              </span>
              {result.truncated && (
                <span className="text-[12.5px] text-[var(--color-sub)]">{t("truncated").replace("{n}", String(MAX_MATCHES))}</span>
              )}
              <span className="ml-auto">
                <CopyButton value={result.output} />
              </span>
            </div>
            <div>
              <span className="mb-1.5 block text-[13px] font-semibold text-[var(--color-sub)]">{t("output")}</span>
              <pre className="mono max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[var(--color-surface)] p-4 text-[14px] leading-6 text-[var(--color-ink)]">
                {result.output}
              </pre>
            </div>
            {result.count === 0 && (
              <p className="rounded-xl bg-[var(--color-surface)] px-4 py-3 text-[14px] text-[var(--color-sub)]">{t("noMatches")}</p>
            )}
          </div>
        ) : null}
      </div>
    </ToolPanel>
  );
}
