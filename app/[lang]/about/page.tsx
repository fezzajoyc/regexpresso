import { dict } from "@/lib/i18n";
import { isLocale, LOCALES, type Locale } from "@/lib/site";
import { ALL_TOOLS } from "@/tools/registry";
import { Container, Prose, SectionHead } from "@/components/ui";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const CONTENT: Partial<Record<Locale, string[]>> = {
  en: [
    "RegExpresso is a set of free regex tools that run entirely in your browser. There is no backend: the patterns you write, the text you paste and every match are processed by JavaScript on your own device.",
    "That design gives us three properties we care about. It is private by construction — there is nothing to upload, so nothing can leak. It is fast — there is no round trip to a server. And it is honest — every tool does exactly what the page says, no tricks.",
    "The differentiator is language. A regular expression is hard enough to read in English; most regex sites only speak it. RegExpresso explains patterns in plain words in fifteen languages, so the explainer actually explains — in the language you think in.",
  ],
  zh: [
    "RegExpresso 是一组完全在浏览器里运行的免费正则工具。没有后端:你写的表达式、粘贴的文本、每一个匹配,都由你自己设备上的 JavaScript 处理。",
    "这个设计带来三个我们看重的性质:隐私是构造出来的——没有上传,就谈不上泄露;速度快——没有服务器往返;诚实——每个工具都做页面所说的事,不玩花样。",
    "真正的差异在语言。正则表达式用英语读已经够费劲,而大多数正则网站只讲英语。RegExpresso 用 15 种语言把模式翻译成大白话——解释器真的在解释,用你思考时用的那种语言。",
  ],
  ja: [
    "RegExpresso は、完全にブラウザ内で動く無料の正規表現ツール集です。バックエンドはありません。書いたパターンも、貼り付けたテキストも、マッチ結果も、すべて自分のデバイス上の JavaScript が処理します。",
    "この設計には、私たちが大切にする 3 つの性質があります。プライバシーは構造的に保証される(アップロードがないので漏えいもない)、速い(サーバー往復がない)、そして誠実(各ツールはページに書かれた通りのことだけをする)。",
    "差別化は言語です。正規表現は英語でも読みにくいのに、ほとんどの正規表現サイトは英語しか話せません。RegExpresso はパターンを 15 言語の平易な言葉に翻訳します。説明ツールが本当に説明してくれる——あなたが考えている言語で。",
  ],
  es: [
    "RegExpresso es un conjunto de herramientas de expresiones regulares gratuitas que funcionan por completo en tu navegador. No hay backend: los patrones que escribes, el texto que pegas y cada coincidencia los procesa el JavaScript de tu propio dispositivo.",
    "Ese diseño nos da tres propiedades que nos importan. Privacidad por construcción: no hay subidas, así que no puede haber fugas. Velocidad: sin viajes de ida y vuelta al servidor. Honestidad: cada herramienta hace exactamente lo que dice su página.",
    "La diferencia está en el idioma. Una expresión regular ya es difícil de leer en inglés, y la mayoría de sitios de regex solo hablan inglés. RegExpresso explica los patrones en palabras sencillas en quince idiomas, así el explicador realmente explica — en el idioma en que piensas.",
  ],
  pt: [
    "RegExpresso é um conjunto de ferramentas de expressões regulares gratuitas que rodam inteiramente no seu navegador. Não há backend: os padrões que você escreve, o texto que cola e cada correspondência são processados pelo JavaScript do seu próprio dispositivo.",
    "Esse design nos dá três propriedades que valorizamos. Privacidade por construção: não há uploads, logo não há vazamentos. Velocidade: sem viagem ao servidor. Honestidade: cada ferramenta faz exatamente o que a página diz.",
    "O diferencial é o idioma. Uma expressão regular já é difícil de ler em inglês, e a maioria dos sites de regex só fala inglês. O RegExpresso explica padrões em palavras simples em quinze idiomas — o explicador realmente explica, no idioma em que você pensa.",
  ],
};

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const t = dict(lang as Locale);
  return (
    <Container className="max-w-3xl py-12">
      <SectionHead title={t.nav.about} />
      <Prose paragraphs={CONTENT[lang as Locale] ?? CONTENT.en!} />
      <p className="mt-6 text-[14px] text-[var(--color-sub)]">
        {ALL_TOOLS.length} tools · {LOCALES.length} languages
      </p>
    </Container>
  );
}
