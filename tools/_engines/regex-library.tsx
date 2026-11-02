"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { CopyButton } from "@/components/client-ui";
import { ToolPanel } from "@/components/ui";
import type { Locale } from "@/lib/site";
import { REGEX_LIBRARY, type LibraryLocale } from "../_lib/regex-library-data";
import { type Phrase } from "./phrases";

/**
 * regex-library 引擎:展示 _lib/regex-library-data 的精选配方(30 条),
 * 描述按站点语言取(核心 5 语,其余回退 en);一键复制 pattern / 样例。
 */

const L: Record<string, Phrase> = {
  en: {
    search: "Search the library…",
    count: "{n} patterns",
    empty: "No pattern matches “{q}”.",
    copyPattern: "Copy pattern",
    tryText: "Test text",
    flags: "Flags",
    noFlags: "none",
  },
  zh: {
    search: "搜索配方库……",
    count: "{n} 条配方",
    empty: "没有匹配「{q}」的配方。",
    copyPattern: "复制表达式",
    tryText: "测试文本",
    flags: "标志位",
    noFlags: "无",
  },
  ja: {
    search: "ライブラリを検索…",
    count: "{n} 件のパターン",
    empty: "「{q}」に一致するパターンはありません。",
    copyPattern: "パターンをコピー",
    tryText: "テストテキスト",
    flags: "フラグ",
    noFlags: "なし",
  },
  es: {
    search: "Buscar en la biblioteca…",
    count: "{n} patrones",
    empty: "Ningún patrón coincide con «{q}».",
    copyPattern: "Copiar patrón",
    tryText: "Texto de prueba",
    flags: "Banderas",
    noFlags: "ninguna",
  },
  pt: {
    search: "Pesquisar na biblioteca…",
    count: "{n} padrões",
    empty: "Nenhum padrão corresponde a «{q}».",
    copyPattern: "Copiar padrão",
    tryText: "Texto de teste",
    flags: "Flags",
    noFlags: "nenhuma",
  },
};

/** 库描述取词:核心 5 语,其余回退 en */
function descFor(locale: Locale | string, entry: (typeof REGEX_LIBRARY)[number]): string {
  const key = (["en", "zh", "ja", "es", "pt"].includes(locale as string) ? locale : "en") as LibraryLocale;
  return entry.desc[key] ?? entry.desc.en!;
}

export function RegexLibraryEngine() {
  const { locale } = useI18n();
  const [query, setQuery] = useState("");

  const t = (k: string) => {
    const table = L[locale] ?? L.en!;
    return table[k] ?? L.en![k] ?? "";
  };

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return REGEX_LIBRARY;
    return REGEX_LIBRARY.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.includes(q) ||
        descFor(locale, e).toLowerCase().includes(q) ||
        e.pattern.toLowerCase().includes(q),
    );
  }, [query, locale]);

  return (
    <ToolPanel>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="field max-w-md flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            aria-label={t("search")}
          />
          <span className="text-[13px] font-semibold text-[var(--color-sub)]">
            {t("count").replace("{n}", String(list.length))}
          </span>
        </div>

        {list.length === 0 && (
          <p className="rounded-xl bg-[var(--color-surface)] px-4 py-3 text-[14px] text-[var(--color-sub)]">
            {t("empty").replace("{q}", query)}
          </p>
        )}

        <ul className="grid gap-3">
          {list.map((e) => (
            <li key={e.id} className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-card)] p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-[15.5px] font-semibold">{e.name}</h3>
                <span className="mono rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[11.5px] font-semibold text-[var(--color-sub)]">
                  {e.flags === "" ? t("noFlags") : e.flags}
                </span>
              </div>
              <p className="mt-1.5 text-[14px] leading-6 text-[var(--color-ink)]">{descFor(locale, e)}</p>
              <code className="mono mt-2.5 block break-all rounded-xl bg-[var(--color-surface)] px-3.5 py-2.5 text-[13px] leading-6 text-[var(--color-ink)]">
                {e.pattern}
              </code>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <CopyButton value={e.pattern} label={t("copyPattern")} />
                <CopyButton value={e.sample} label={t("tryText")} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ToolPanel>
  );
}
