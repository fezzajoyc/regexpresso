"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { CopyButton } from "@/components/client-ui";
import { ToolPanel } from "@/components/ui";
import type { Locale } from "@/lib/site";
import { explainRegex, redosRisk, type GroupType, type RegexToken } from "../_lib/regexplain";
import { pickAll, type Phrase } from "./phrases";

/**
 * regex-explainer 引擎(本站的差异化功能):
 * _lib/regexplain 输出 locale-free 的 token 流,这里把 kind 映射成本地化句子。
 * 短语表核心 5 语内联,其余语言回退英文。
 */

const SAMPLES = ["\\d{4}-\\d{2}-\\d{2}", "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+", "(\\w+)\\s+\\1", "^(https?://)?([^/]+)", "(a|aa)+b?"];

/** 组类型 → 短语键 */
const GROUP_KEY: Record<GroupType, string> = {
  capturing: "groupCapturing",
  noncapturing: "groupNoncapturing",
  named: "groupNamed",
  lookahead: "lookahead",
  negativeLookahead: "negLookahead",
  lookbehind: "lookbehind",
  negativeLookbehind: "negLookbehind",
};

const L: Record<string, Phrase> = {
  en: {
    pattern: "Pattern",
    patternPlaceholder: "Paste any regular expression…",
    tokens: "Tokens ({n})",
    sentences: "In plain words",
    emptyPattern: "Paste a regular expression above and read what every piece does — in your language.",
    invalid: "This is not a valid regular expression",
    errorAt: "problem near position {n}",
    kindLiteral: "text",
    kindClass: "character class",
    kindEscape: "escape",
    kindDot: "any character",
    kindQuantifier: "quantifier",
    kindGroup: "group",
    kindGroupEnd: "group end",
    kindAnchor: "anchor",
    kindAlternation: "alternation",
    kindBackref: "backreference",
    literal: "matches the literal text «{raw}»",
    dot: "matches any single character except line breaks (add the s flag to include them)",
    classAny: "matches any one character in {raw}",
    classNegated: "matches any one character NOT in {raw}",
    escapeShorthandD: "matches any digit (0–9)",
    escapeShorthandNotD: "matches any character that is NOT a digit",
    escapeShorthandW: "matches any letter, digit or underscore (a “word character”)",
    escapeShorthandNotW: "matches any character that is NOT a letter, digit or underscore",
    escapeShorthandS: "matches any whitespace: space, tab or line break",
    escapeShorthandNotS: "matches any character that is NOT whitespace",
    escapeUnicodeProp: "matches a Unicode property class ({raw}) — needs the u flag",
    escapeIdentity: "an escaped letter «{code}» — JS ignores the backslash, matches “{code}”",
    escapePunct: "an escaped «{code}» — matches the {code} character itself",
    escapeN: "matches a line feed (newline)",
    escapeR: "matches a carriage return",
    escapeT: "matches a tab",
    escapeOther: "matches the control character or code point {raw}",
    anchorStart: "matches the very start of the text (with the m flag: start of each line)",
    anchorEnd: "matches the very end of the text (with the m flag: end of each line)",
    anchorWord: "matches a word boundary — the invisible gap between a word character and a non-word character",
    anchorNonword: "matches NOT a word boundary — a spot inside or between words",
    alternation: "OR — the regex first tries the left side, then the right",
    groupCapturing: "opens a capturing group — whatever matches inside is kept as group {n}",
    groupNoncapturing: "opens a non-capturing group — groups parts together without saving them",
    groupNamed: "opens the named group «{name}» — its match is saved under that name (group {n})",
    lookahead: "opens a lookahead — what follows must match, but is not consumed",
    negLookahead: "opens a negative lookahead — what follows must NOT match",
    lookbehind: "opens a lookbehind — what came before must match, but is not consumed",
    negLookbehind: "opens a negative lookbehind — what came before must NOT match",
    groupEnd: "closes the group",
    backref: "matches the exact same text that group {ref} captured earlier",
    quantZero: "repeats the previous piece zero or more times",
    quantOne: "repeats the previous piece one or more times",
    quantOpt: "makes the previous piece optional (zero or one time)",
    quantExact: "repeats the previous piece exactly {n} times",
    quantRange: "repeats the previous piece between {a} and {b} times",
    quantOpen: "repeats the previous piece {a} times or more",
    quantGreedy: "Greedy — grabs as much as possible first.",
    quantLazy: "Lazy — takes as little as possible and expands only when needed.",
    quantTarget: "Applies to «{target}».",
    riskHigh: "ReDoS risk: nested quantifiers like this can hang a program on long input. It is fine for short strings — see the tester’s warning.",
    riskMedium: "This pattern may backtrack slowly on long input.",
  },
  zh: {
    pattern: "正则表达式",
    patternPlaceholder: "粘贴任意正则表达式……",
    tokens: "词法单元({n})",
    sentences: "大白话解释",
    emptyPattern: "在上方粘贴一个正则表达式,逐段看懂它的每个部分——用你熟悉的语言。",
    invalid: "这不是一个合法的正则表达式",
    errorAt: "问题出在第 {n} 个字符附近",
    kindLiteral: "文本",
    kindClass: "字符类",
    kindEscape: "转义",
    kindDot: "任意字符",
    kindQuantifier: "量词",
    kindGroup: "分组",
    kindGroupEnd: "分组结束",
    kindAnchor: "锚点",
    kindAlternation: "或",
    kindBackref: "反向引用",
    literal: "匹配字面文本「{raw}」",
    dot: "匹配任意单个字符(不含换行;加 s 标志可包含换行)",
    classAny: "匹配 {raw} 中的任意一个字符",
    classNegated: "匹配不在 {raw} 中的任意一个字符",
    escapeShorthandD: "匹配任意数字(0–9)",
    escapeShorthandNotD: "匹配任意非数字字符",
    escapeShorthandW: "匹配任意字母、数字或下划线(即「单词字符」)",
    escapeShorthandNotW: "匹配任意非单词字符",
    escapeShorthandS: "匹配任意空白:空格、制表符或换行",
    escapeShorthandNotS: "匹配任意非空白字符",
    escapeUnicodeProp: "匹配 Unicode 属性类({raw})——需要 u 标志",
    escapeIdentity: "转义的字母「{code}」——JS 会忽略反斜杠,实际匹配「{code}」",
    escapePunct: "转义的「{code}」——匹配 {code} 字符本身",
    escapeN: "匹配换行符(LF)",
    escapeR: "匹配回车符(CR)",
    escapeT: "匹配制表符(Tab)",
    escapeOther: "匹配控制字符或码点 {raw}",
    anchorStart: "匹配文本最开头(加 m 标志:每行的开头)",
    anchorEnd: "匹配文本最末尾(加 m 标志:每行的结尾)",
    anchorWord: "匹配单词边界——单词字符与非单词字符之间那条看不见的缝",
    anchorNonword: "匹配非单词边界——单词内部或两个词相连的位置",
    alternation: "或——正则先尝试左边,不行再试右边",
    groupCapturing: "开始一个捕获组——里面匹配到的内容会保存为第 {n} 组",
    groupNoncapturing: "开始一个非捕获组——只用于分组,不保存内容",
    groupNamed: "开始命名组「{name}」——匹配结果以这个名字保存(第 {n} 组)",
    lookahead: "开始前瞻断言——后面的内容必须匹配,但不消耗字符",
    negLookahead: "开始否定前瞻——后面的内容必须不匹配",
    lookbehind: "开始后顾断言——前面的内容必须匹配,但不消耗字符",
    negLookbehind: "开始否定后顾——前面的内容必须不匹配",
    groupEnd: "分组结束",
    backref: "再次匹配第 {ref} 组捕获到的完全相同的文本",
    quantZero: "把前一个片段重复零次或多次",
    quantOne: "把前一个片段重复一次或多次",
    quantOpt: "让前一个片段可有可无(零次或一次)",
    quantExact: "把前一个片段恰好重复 {n} 次",
    quantRange: "把前一个片段重复 {a} 到 {b} 次",
    quantOpen: "把前一个片段至少重复 {a} 次",
    quantGreedy: "贪婪——先尽量多吃。",
    quantLazy: "懒惰——先尽量少吃,不够再扩展。",
    quantTarget: "作用于「{target}」。",
    riskHigh: "ReDoS 风险:这样的嵌套量词在长文本上可能把程序卡死。短字符串没事——测试器的警示同样适用。",
    riskMedium: "该表达式在长文本上可能出现回溯变慢。",
  },
  ja: {
    pattern: "正規表現",
    patternPlaceholder: "正規表現を貼り付け…",
    tokens: "トークン({n})",
    sentences: "やさしい解説",
    emptyPattern: "上に正規表現を貼り付けると、各部分が何をしているかをあなたの言語で読めます。",
    invalid: "有効な正規表現ではありません",
    errorAt: "{n} 文字目付近に問題があります",
    kindLiteral: "テキスト",
    kindClass: "文字クラス",
    kindEscape: "エスケープ",
    kindDot: "任意の文字",
    kindQuantifier: "量詞",
    kindGroup: "グループ",
    kindGroupEnd: "グループ終了",
    kindAnchor: "アンカー",
    kindAlternation: " OR ",
    kindBackref: "後方参照",
    literal: "テキスト「{raw}」にそのまま一致",
    dot: "改行を除く任意の 1 文字に一致(s フラグで改行も含む)",
    classAny: "{raw} のいずれか 1 文字に一致",
    classNegated: "{raw} 以外の任意の 1 文字に一致",
    escapeShorthandD: "数字 1 文字(0–9)に一致",
    escapeShorthandNotD: "数字以外の 1 文字に一致",
    escapeShorthandW: "英字・数字・アンダースコア(単語文字)に一致",
    escapeShorthandNotW: "単語文字以外の 1 文字に一致",
    escapeShorthandS: "空白(スペース・タブ・改行)に一致",
    escapeShorthandNotS: "空白以外の 1 文字に一致",
    escapeUnicodeProp: "Unicode プロパティ クラス({raw})に一致 — u フラグが必要",
    escapeIdentity: "エスケープされた文字「{code}」— JS はバックスラッシュを無視し「{code}」に一致",
    escapePunct: "エスケープされた「{code}」— 記号そのものに一致",
    escapeN: "改行(LF)に一致",
    escapeR: "キャリッジ リターン(CR)に一致",
    escapeT: "タブに一致",
    escapeOther: "制御文字またはコードポイント {raw} に一致",
    anchorStart: "テキストの先頭に一致(m フラグで各行の先頭)",
    anchorEnd: "テキストの末尾に一致(m フラグで各行の末尾)",
    anchorWord: "単語境界に一致 — 単語文字とそれ以外の間にある見えない境界",
    anchorNonword: "単語境界以外に一致 — 単語の中や隣接した位置",
    alternation: "OR — 左側を先に試し、だめなら右側",
    groupCapturing: "キャプチャ グループ開始 — 内側の一致は第 {n} グループに保存",
    groupNoncapturing: "非キャプチャ グループ開始 — まとめるだけで保存しません",
    groupNamed: "名前付きグループ「{name}」開始 — その名前で保存(第 {n} グループ)",
    lookahead: "先読み開始 — 直後が一致する必要があるが、消費しない",
    negLookahead: "否定先読み — 直後が一致してはならない",
    lookbehind: "後読み開始 — 直前が一致する必要があるが、消費しない",
    negLookbehind: "否定後読み — 直前が一致してはならない",
    groupEnd: "グループを閉じる",
    backref: "グループ {ref} が以前に取り込んだテキストと同じものに一致",
    quantZero: "直前の要素を 0 回以上繰り返す",
    quantOne: "直前の要素を 1 回以上繰り返す",
    quantOpt: "直前の要素を省略可能にする(0 回か 1 回)",
    quantExact: "直前の要素をちょうど {n} 回繰り返す",
    quantRange: "直前の要素を {a}〜{b} 回繰り返す",
    quantOpen: "直前の要素を {a} 回以上繰り返す",
    quantGreedy: "貪欲 — できるだけ多く取ろうとする。",
    quantLazy: "怠惰 — できるだけ少なく取り、必要なら広げる。",
    quantTarget: "対象:「{target}」。",
    riskHigh: "ReDoS リスク:このような入れ子の量詞は、長い入力でプログラムを停止させることがあります。短い文字列なら問題ありません。",
    riskMedium: "長い入力でバックトラッキングが遅くなる可能性があります。",
  },
  es: {
    pattern: "Expresión",
    patternPlaceholder: "Pega cualquier expresión regular…",
    tokens: "Elementos ({n})",
    sentences: "En palabras claras",
    emptyPattern: "Pega una expresión regular arriba y lee qué hace cada pieza, en tu idioma.",
    invalid: "No es una expresión regular válida",
    errorAt: "problema cerca de la posición {n}",
    kindLiteral: "texto",
    kindClass: "clase de caracteres",
    kindEscape: "escape",
    kindDot: "cualquier carácter",
    kindQuantifier: "cuantificador",
    kindGroup: "grupo",
    kindGroupEnd: "fin de grupo",
    kindAnchor: "ancla",
    kindAlternation: "alternancia",
    kindBackref: "retroreferencia",
    literal: "coincide con el texto literal «{raw}»",
    dot: "coincide con cualquier carácter salvo saltos de línea (con la bandera s, también ellos)",
    classAny: "coincide con un carácter de {raw}",
    classNegated: "coincide con un carácter que NO esté en {raw}",
    escapeShorthandD: "coincide con cualquier dígito (0–9)",
    escapeShorthandNotD: "coincide con cualquier carácter que NO sea dígito",
    escapeShorthandW: "coincide con letra, dígito o guion bajo (un «carácter de palabra»)",
    escapeShorthandNotW: "coincide con cualquier carácter que NO sea de palabra",
    escapeShorthandS: "coincide con cualquier espacio: espacio, tabulación o salto de línea",
    escapeShorthandNotS: "coincide con cualquier carácter que NO sea espacio",
    escapeUnicodeProp: "coincide con una clase de propiedad Unicode ({raw}) — necesita la bandera u",
    escapeIdentity: "una letra escapada «{code}» — JS ignora la barra y coincide con «{code}»",
    escapePunct: "un «{code}» escapado — coincide con el carácter {code} literal",
    escapeN: "coincide con un salto de línea (LF)",
    escapeR: "coincide con un retorno de carro (CR)",
    escapeT: "coincide con una tabulación",
    escapeOther: "coincide con el carácter de control o punto de código {raw}",
    anchorStart: "coincide con el inicio del texto (con m: inicio de cada línea)",
    anchorEnd: "coincide con el final del texto (con m: final de cada línea)",
    anchorWord: "coincide con un límite de palabra: el hueco invisible entre carácter de palabra y el resto",
    anchorNonword: "coincide donde NO hay límite de palabra — dentro de una palabra o entre dos pegadas",
    alternation: "O — primero prueba la izquierda y luego la derecha",
    groupCapturing: "abre un grupo de captura — lo que coincida se guarda como grupo {n}",
    groupNoncapturing: "abre un grupo sin captura — agrupa sin guardar",
    groupNamed: "abre el grupo nombrado «{name}» — se guarda con ese nombre (grupo {n})",
    lookahead: "abre un lookahead — lo que sigue debe coincidir, pero no se consume",
    negLookahead: "abre un lookahead negativo — lo que sigue NO debe coincidir",
    lookbehind: "abre un lookbehind — lo anterior debe coincidir, pero no se consume",
    negLookbehind: "abre un lookbehind negativo — lo anterior NO debe coincidir",
    groupEnd: "cierra el grupo",
    backref: "coincide otra vez con el mismo texto que capturó el grupo {ref}",
    quantZero: "repite la pieza anterior cero o más veces",
    quantOne: "repite la pieza anterior una o más veces",
    quantOpt: "hace opcional la pieza anterior (cero o una vez)",
    quantExact: "repite la pieza anterior exactamente {n} veces",
    quantRange: "repite la pieza anterior entre {a} y {b} veces",
    quantOpen: "repite la pieza anterior {a} veces o más",
    quantGreedy: "Glotón — toma lo máximo posible primero.",
    quantLazy: "Perezoso — toma lo mínimo y amplía solo si hace falta.",
    quantTarget: "Se aplica a «{target}».",
    riskHigh: "Riesgo de ReDoS: cuantificadores así anidados pueden colgar un programa con textos largos. Con cadenas cortas no pasa nada.",
    riskMedium: "Este patrón puede retroceder lentamente con textos largos.",
  },
  pt: {
    pattern: "Expressão",
    patternPlaceholder: "Cole qualquer expressão regular…",
    tokens: "Elementos ({n})",
    sentences: "Em palavras simples",
    emptyPattern: "Cole uma expressão regular acima e leia o que cada pedaço faz, no seu idioma.",
    invalid: "Não é uma expressão regular válida",
    errorAt: "problema perto da posição {n}",
    kindLiteral: "texto",
    kindClass: "classe de caracteres",
    kindEscape: "escape",
    kindDot: "qualquer caractere",
    kindQuantifier: "quantificador",
    kindGroup: "grupo",
    kindGroupEnd: "fim de grupo",
    kindAnchor: "âncora",
    kindAlternation: "alternância",
    kindBackref: "referência inversa",
    literal: "corresponde ao texto literal «{raw}»",
    dot: "corresponde a qualquer caractere menos quebras de linha (com a flag s, também elas)",
    classAny: "corresponde a um caractere de {raw}",
    classNegated: "corresponde a um caractere que NÃO esteja em {raw}",
    escapeShorthandD: "corresponde a qualquer dígito (0–9)",
    escapeShorthandNotD: "corresponde a qualquer caractere que NÃO seja dígito",
    escapeShorthandW: "corresponde a letra, dígito ou sublinhado (um «caractere de palavra»)",
    escapeShorthandNotW: "corresponde a qualquer caractere que NÃO seja de palavra",
    escapeShorthandS: "corresponde a qualquer espaço: espaço, tabulação ou quebra de linha",
    escapeShorthandNotS: "corresponde a qualquer caractere que NÃO seja espaço",
    escapeUnicodeProp: "corresponde a uma classe de propriedade Unicode ({raw}) — exige a flag u",
    escapeIdentity: "uma letra escapada «{code}» — o JS ignora a barra e corresponde a «{code}»",
    escapePunct: "um «{code}» escapado — corresponde ao próprio caractere {code}",
    escapeN: "corresponde a uma quebra de linha (LF)",
    escapeR: "corresponde a um retorno de carro (CR)",
    escapeT: "corresponde a uma tabulação",
    escapeOther: "corresponde ao caractere de controle ou ponto de código {raw}",
    anchorStart: "corresponde ao início do texto (com m: início de cada linha)",
    anchorEnd: "corresponde ao fim do texto (com m: fim de cada linha)",
    anchorWord: "corresponde a um limite de palavra — o vão invisível entre caractere de palavra e o resto",
    anchorNonword: "corresponde onde NÃO há limite de palavra — dentro de uma palavra ou entre duas coladas",
    alternation: "OU — primeiro tenta a esquerda, depois a direita",
    groupCapturing: "abre um grupo de captura — o que corresponder fica guardado como grupo {n}",
    groupNoncapturing: "abre um grupo sem captura — agrupa sem guardar",
    groupNamed: "abre o grupo nomeado «{name}» — guardado com esse nome (grupo {n})",
    lookahead: "abre um lookahead — o que vem depois deve corresponder, mas não é consumido",
    negLookahead: "abre um lookahead negativo — o que vem depois NÃO deve corresponder",
    lookbehind: "abre um lookbehind — o que veio antes deve corresponder, mas não é consumido",
    negLookbehind: "abre um lookbehind negativo — o que veio antes NÃO deve corresponder",
    groupEnd: "fecha o grupo",
    backref: "corresponde de novo ao mesmo texto que o grupo {ref} capturou",
    quantZero: "repete o trecho anterior zero ou mais vezes",
    quantOne: "repete o trecho anterior uma ou mais vezes",
    quantOpt: "torna o trecho anterior opcional (zero ou uma vez)",
    quantExact: "repete o trecho anterior exatamente {n} vezes",
    quantRange: "repete o trecho anterior entre {a} e {b} vezes",
    quantOpen: "repete o trecho anterior {a} vezes ou mais",
    quantGreedy: "Ganancioso — tenta pegar o máximo primeiro.",
    quantLazy: "Preguiçoso — pega o mínimo e expande só se precisar.",
    quantTarget: "Aplica-se a «{target}».",
    riskHigh: "Risco de ReDoS: quantificadores aninhados assim podem travar um programa com textos longos. Com strings curtas, tudo bem.",
    riskMedium: "Este padrão pode retroceder devagar com textos longos.",
  },
};

/** 量词次数 → 短语键 + 插值 */
function quantPhrase(q: Extract<RegexToken, { kind: "quantifier" }>): { key: string; vars: Record<string, string> } {
  if (q.max === null && q.min === 0) return { key: "quantZero", vars: {} };
  if (q.max === null && q.min === 1) return { key: "quantOne", vars: {} };
  if (q.min === 0 && q.max === 1) return { key: "quantOpt", vars: {} };
  if (q.max === null) return { key: "quantOpen", vars: { a: String(q.min) } };
  if (q.min === q.max) return { key: "quantExact", vars: { n: String(q.min) } };
  return { key: "quantRange", vars: { a: String(q.min), b: String(q.max) } };
}

function fill(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? vars[k] : `{${k}}`));
}

/** token → 一句人话(引擎侧 i18n) */
function describe(t: RegexToken, ph: Phrase, captureIndex: number): { title: string; text: string; name: string } {
  const raw = "raw" in t ? t.raw : "";
  switch (t.kind) {
    case "literal":
      return { name: ph.kindLiteral!, title: raw, text: fill(ph.literal!, { raw }) };
    case "dot":
      return { name: ph.kindDot!, title: ".", text: ph.dot! };
    case "class": {
      const key = t.negated ? "classNegated" : "classAny";
      return { name: ph.kindClass!, title: raw, text: fill(ph[key]!, { raw }) };
    }
    case "escape": {
      if (["d", "w", "s"].includes(t.code)) {
        const key = `escapeShorthand${t.negated ? "Not" : ""}${t.code.toUpperCase()}`;
        return { name: ph.kindEscape!, title: raw, text: ph[key] ?? ph.escapeOther! };
      }
      if (t.code === "p") return { name: ph.kindEscape!, title: raw, text: fill(ph.escapeUnicodeProp!, { raw }) };
      if (t.identity) return { name: ph.kindEscape!, title: raw, text: fill(ph.escapeIdentity!, { code: t.code }) };
      if (t.code === "n") return { name: ph.kindEscape!, title: raw, text: ph.escapeN! };
      if (t.code === "r") return { name: ph.kindEscape!, title: raw, text: ph.escapeR! };
      if (t.code === "t") return { name: ph.kindEscape!, title: raw, text: ph.escapeT! };
      // \xHH \uHHHH \u{...} \0 \f \v 等一律归入「控制字符/码点」
      if (t.code.length > 1 || "0fvcxu".includes(t.code))
        return { name: ph.kindEscape!, title: raw, text: fill(ph.escapeOther!, { raw }) };
      return { name: ph.kindEscape!, title: raw, text: fill(ph.escapePunct!, { code: t.code }) };
    }
    case "anchor": {
      const map = { start: "anchorStart", end: "anchorEnd", word: "anchorWord", nonword: "anchorNonword" } as const;
      return { name: ph.kindAnchor!, title: raw, text: ph[map[t.anchorType]]! };
    }
    case "alternation":
      return { name: ph.kindAlternation!, title: "|", text: ph.alternation! };
    case "group": {
      const base = GROUP_KEY[t.groupType];
      const name = ph.kindGroup!;
      if (t.groupType === "named")
        return { name, title: t.raw, text: fill(ph[base]!, { name: t.name ?? "", n: String(captureIndex) }) };
      if (t.groupType === "capturing")
        return { name, title: t.raw, text: fill(ph[base]!, { n: String(captureIndex) }) };
      return { name, title: t.raw, text: ph[base]! };
    }
    case "groupEnd":
      return { name: ph.kindGroupEnd!, title: ")", text: ph.groupEnd! };
    case "backref":
      return { name: ph.kindBackref!, title: raw, text: fill(ph.backref!, { ref: t.ref }) };
    case "quantifier": {
      const { key, vars } = quantPhrase(t);
      const lazy = ph[t.lazy ? "quantLazy" : "quantGreedy"]!;
      const target = fill(ph.quantTarget!, { target: t.target });
      return {
        name: ph.kindQuantifier!,
        title: raw,
        text: `${fill(ph[key]!, vars)}. ${lazy} ${target}`,
      };
    }
    case "error":
      return { name: ph.invalid!, title: t.raw, text: t.message };
  }
}

export function RegexExplainerEngine() {
  const { locale } = useI18n();
  const [pattern, setPattern] = useState("(\\w+)\\s+\\1");

  const ph = pickAll(locale, L);
  const tokens = useMemo(() => explainRegex(pattern), [pattern]);
  const risk = useMemo(() => redosRisk(pattern), [pattern]);
  const hasError = tokens.length > 0 && tokens[tokens.length - 1].kind === "error";
  const errorToken = hasError ? (tokens[tokens.length - 1] as Extract<RegexToken, { kind: "error" }>) : null;

  // 给捕获组编号(capturing + named 都占编号)
  const described = useMemo(() => {
    let capture = 0;
    return tokens.map((t) => {
      if (t.kind === "group" && (t.groupType === "capturing" || t.groupType === "named")) capture++;
      return describe(t, ph, capture);
    });
  }, [tokens, ph]);

  return (
    <ToolPanel>
      <div className="grid gap-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-sub)]" htmlFor="rx-explain">
            {ph.pattern}
          </label>
          <input
            id="rx-explain"
            className="field mono"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={ph.patternPlaceholder}
            spellCheck={false}
            autoComplete="off"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPattern(s)}
                className="mono rounded-lg border border-[var(--color-hairline)] px-2.5 py-1 text-[12px] text-[var(--color-sub)] transition-colors hover:bg-[var(--color-surface)]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {errorToken && (
          <p className="error-bg rounded-xl border border-[rgba(178,80,0,0.25)] px-4 py-3 text-[14px] leading-6">
            <strong className="text-[var(--color-bad)]">{ph.invalid}</strong> —{" "}
            {fill(ph.errorAt!, { n: String(errorToken.position + 1) })} ({errorToken.message})
          </p>
        )}

        {pattern === "" ? (
          <p className="rounded-xl bg-[var(--color-surface)] px-4 py-3 text-[14px] text-[var(--color-sub)]">
            {ph.emptyPattern}
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[14px] font-semibold">{fill(ph.tokens!, { n: String(tokens.length) })}</h3>
              <span className="ml-auto">
                <CopyButton value={pattern} />
              </span>
            </div>

            <ol className="grid gap-2">
              {described.map((d, i) => {
                const tok = tokens[i];
                const isError = tok.kind === "error";
                return (
                  <li
                    key={i}
                    className={`rounded-xl border px-3.5 py-2.5 ${
                      isError
                        ? "error-bg border-[rgba(178,80,0,0.25)]"
                        : "border-[var(--color-hairline)] bg-[var(--color-card)]"
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <code className={`mono break-all text-[14px] ${isError ? "text-[var(--color-bad)]" : "text-[var(--color-accent-strong)]"}`}>
                        {d.title === "" ? "∅" : d.title}
                      </code>
                      <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-sub)]">
                        {d.name}
                      </span>
                    </div>
                    <p className="mt-1 text-[14px] leading-6 text-[var(--color-ink)]">{d.text}</p>
                  </li>
                );
              })}
            </ol>

            {!hasError && risk.level !== "low" && (
              <p className="error-bg rounded-xl border border-[rgba(178,80,0,0.25)] px-4 py-3 text-[13.5px] leading-6 text-[var(--color-bad)]">
                {risk.level === "high" ? ph.riskHigh : ph.riskMedium}
              </p>
            )}
          </>
        )}
      </div>
    </ToolPanel>
  );
}
