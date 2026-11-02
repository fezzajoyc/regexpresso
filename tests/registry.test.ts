import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/site";
import { ALL_TOOLS, TOOL_BY_SLUG, toolsByCategory } from "@/tools/registry";
import { toolCopy } from "@/lib/tool-copy";

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe("registry integrity", () => {
  it("ships the four regex tools", () => {
    expect(ALL_TOOLS.map((t) => t.slug).sort()).toEqual([
      "regex-explainer", "regex-library", "regex-replace", "regex-tester",
    ]);
  });

  it("features exactly the tester and the explainer on the homepage", () => {
    expect(ALL_TOOLS.filter((t) => t.featured).map((t) => t.slug).sort()).toEqual([
      "regex-explainer", "regex-tester",
    ]);
  });

  it("slugs are unique and kebab-case", () => {
    const seen = new Set<string>();
    for (const tool of ALL_TOOLS) {
      expect(tool.slug).toMatch(SLUG_RE);
      expect(seen.has(tool.slug)).toBe(false);
      seen.add(tool.slug);
    }
    expect(TOOL_BY_SLUG.size).toBe(ALL_TOOLS.length);
  });

  it("every tool has complete copy in every locale (native or overlay, else en fallback)", () => {
    for (const tool of ALL_TOOLS) {
      for (const locale of LOCALES) {
        const c = toolCopy(tool, locale);
        expect(c, `${tool.slug}:${locale} missing`).toBeTruthy();
        expect(c.name.trim().length).toBeGreaterThan(1);
        // CJK 信息密度约为拉丁文两倍,阈值分语言
        const min = locale === "zh" || locale === "ja" ? 32 : 80;
        expect(c.tagline.length, `${tool.slug}:${locale} tagline ${c.tagline.length}`).toBeGreaterThanOrEqual(min);
        expect(c.intro.length).toBeGreaterThanOrEqual(1);
        expect(c.steps.length).toBeGreaterThanOrEqual(3);
        expect(c.faqs.length).toBeGreaterThanOrEqual(2);
        for (const f of c.faqs) {
          expect(f.q.trim()).toBeTruthy();
          expect(f.a.trim()).toBeTruthy();
        }
      }
    }
  });

  it("related slugs all resolve", () => {
    for (const tool of ALL_TOOLS) {
      expect(tool.related.length, tool.slug).toBeGreaterThanOrEqual(2);
      // 站内 4 个工具互为 related(全连通,不含自身),保证内链不出现孤岛
      const others = ALL_TOOLS.filter((o) => o.slug !== tool.slug).map((o) => o.slug);
      for (const other of others) {
        expect(tool.related, `${tool.slug} → ${other}`).toContain(other);
      }
      expect(tool.related, tool.slug).not.toContain(tool.slug);
      expect(new Set(tool.related).size, tool.slug).toBe(tool.related.length);
      for (const slug of tool.related) {
        expect(TOOL_BY_SLUG.has(slug), `${tool.slug} → ${slug} dangling`).toBe(true);
      }
    }
  });

  it("every category has tools", () => {
    const cats = new Set(ALL_TOOLS.map((t) => t.category));
    expect(cats.size).toBeGreaterThanOrEqual(1);
    for (const cat of cats) {
      expect(toolsByCategory(cat).length).toBeGreaterThan(0);
    }
  });
});
