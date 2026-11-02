import type { Locale } from "@/lib/site";

/**
 * 引擎级短语表:核心 5 语(en/zh/ja/es/pt)内联,其余语言回退 en。
 * 与 ToolCopy 的 overlay 机制分开——引擎短语是 UI 标签,不是 SEO 文案。
 */
export type Phrase = Record<string, string>;

export function pick(locale: Locale | string, p: Phrase): string {
  return p[locale] ?? p.en!;
}

/** 5 语里挑当前语言;没有就用 en(用于整段映射的场景) */
export function pickAll<T extends Phrase>(locale: Locale | string, table: Record<string, T>): T {
  return table[locale] ?? table.en!;
}
