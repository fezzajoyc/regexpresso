import { defineTool } from "../_lib/types";
import { RegexLibraryEngine } from "../_engines/regex-library";

export default defineTool({
  slug: "regex-library",
  category: "developer",
  icon: "layers",
  engine: { component: RegexLibraryEngine },
  related: ["regex-tester", "regex-explainer", "regex-replace"],
  copy: {
    en: {
      name: "Regex Library",
      h1: "Regex Library — copy-paste patterns that work",
      tagline:
        "Thirty curated regex recipes with a one-line explanation in your language: email, URL, IPv4, dates, hex colors, passwords, hashtags and more.",
      intro: [
        "Nobody should have to hand-write an IPv4 matcher at 6 p.m. on a Friday. This library keeps thirty battle-tested, copy-paste-ready patterns for the tasks that come up again and again: emails and URLs, IPv4 and IPv6, ISO and US dates, times, phone numbers, strong-password rules, slugs, HTML tags, UUIDs, semver, prices, hashtags in any alphabet, even a duplicated-word finder built on a backreference.",
        "Every entry states plainly what it covers and what it does not — the email recipe is a pragmatic subset, not RFC 5322, and the credit-card recipe checks issuer shapes, never whether a card is real. Each pattern ships with a sample text it provably matches, and each explanation is written in your language rather than machine-translated after the fact.",
      ],
      steps: [
        "Search the library by name, pattern or description.",
        "Open the recipe you need and read the one-line scope note — what it matches and what it deliberately ignores.",
        "Copy the pattern (and the sample text if you want a ready-made test case).",
        "Paste it into the tester to confirm it behaves the way your data needs.",
      ],
      faqs: [
        {
          q: "Are these patterns production-ready?",
          a: "They are production-honest: each entry documents its scope and its limits. The email pattern accepts everything a normal form should and rejects nothing a real address would need; it does not implement RFC 5322, because no form should. Test each recipe against your own data before relying on it — the tester on this site is one click away.",
        },
        {
          q: "Why is the credit-card pattern only about issuer prefixes?",
          a: "Because a regex can never tell you whether a card is valid — that requires the Luhn check and a live issuer response. The pattern recognizes the number shapes of Visa, Mastercard, Amex and Discover so you can pre-format input or mask digits. Use it for UX, never for payment decisions.",
        },
        {
          q: "Do the Unicode recipes work everywhere?",
          a: "The hashtag and emoji recipes use \\p{…} classes, which need the u flag — available in every modern browser, Node, and most recent runtimes of other languages. If your target environment predates unicode property escapes, the entries note it and you can fall back to explicit character ranges.",
        },
      ],
    },
    zh: {
      name: "正则配方库",
      h1: "正则配方库——复制即用的模式",
      tagline:
        "30 条精选正则配方,每条配一句你的语言的说明:邮箱、URL、IPv4、日期、十六进制颜色、强密码、话题标签……复制就走。",
      intro: [
        "谁都不该在周五下午六点手写一个 IPv4 匹配器。这个配方库为反复出现的任务准备了 30 条久经考验、复制即用的模式:邮箱与 URL、IPv4 与 IPv6、ISO 与美式日期、时间、电话号码、强密码规则、slug、HTML 标签、UUID、semver、价格、任意文字的话题标签,甚至还有一条基于反向引用的「重复单词」查找器。",
        "每条配方都写明它覆盖什么、不覆盖什么——邮箱配方是实用子集而非 RFC 5322,银行卡配方只看卡组织号段,绝不判断卡是否真实有效。每条模式都附带一段保证能命中的样例文本;每句说明都用你的语言写成,而不是事后机翻。",
      ],
      steps: [
        "按名称、模式或说明搜索配方库。",
        "打开需要的配方,读那一句范围说明——它匹配什么、刻意忽略什么。",
        "复制表达式(需要现成测试用例的话,连样例文本一起复制)。",
        "粘到测试器里,确认它在你的数据上表现符合预期。",
      ],
      faqs: [
        {
          q: "这些配方可以直接上生产吗?",
          a: "它们是「生产诚实」的:每条都写明适用范围和局限。邮箱模式接受正常表单该接受的一切,也不拒绝真实地址需要的东西;它不实现 RFC 5322——表单也不该实现。依赖之前,请用自己的数据测试一遍——本站的测试器一点就到。",
        },
        {
          q: "银行卡模式为什么只看卡组织号段?",
          a: "因为正则永远无法判断一张卡是否有效——那需要 Luhn 校验和发卡行的实时响应。这个模式只识别 Visa、Mastercard、Amex、Discover 的号码形态,用来预格式化输入或掩码显示。用于交互体验可以,用于支付决策不行。",
        },
        {
          q: "Unicode 配方在哪里都能用吗?",
          a: "话题标签和 emoji 配方用了 \\p{…} 类,需要 u 标志——所有现代浏览器、Node 以及大多数语言的新版本都支持。如果你的目标环境还不支持 Unicode 属性类,条目里注明了,可以退回显式字符区间写法。",
        },
      ],
    },
    ja: {
      name: "正規表現レシピ集",
      h1: "正規表現レシピ集 — そのまま使えるパターン",
      tagline:
        "実務で定番の 30 レシピをあなたの言語の一言解説付きで:メール、URL、IPv4、日付、hex カラー、強力なパスワード、ハッシュタグなど。",
      intro: [
        "金曜の夕方に IPv4 のマッチャを手書きする人はいませんように。このライブラリは、繰り返し直面するタスク向けに実績のあるコピペ前提パターンを 30 個そろえました:メールと URL、IPv4 と IPv6、ISO と米国式の日付、時刻、電話番号、強力なパスワードのルール、スラッグ、HTML タグ、UUID、semver、価格、あらゆる文字のハッシュタグ、後方参照を使った重複単語の発見まで。",
        "各レシピは、何をカバーし何をしないかを率直に書いています — メールのレシピは実用的なサブセットであって RFC 5322 ではない、クレジット カードのレシピは発行元の番号形状だけを見て、カードの真偽は決して判定しない。各パターンには必ずマッチするサンプル テキストが付き、解説は後から機械翻訳したものではなく、あなたの言語で書かれています。",
      ],
      steps: [
        "名前・パターン・説明からライブラリを検索します。",
        "必要なレシピを開き、一言のスコープ説明を読みます — 何にマッチし、何を意図的に無視するか。",
        "パターンをコピーします(テスト ケースが要ればサンプル テキストも)。",
        "テスターに貼って、自分のデータで期待どおりに動くか確認します。",
      ],
      faqs: [
        {
          q: "このパターンは本番で使えますか?",
          a: "「本番に正直」です:各レシピは適用範囲と限界を明記しています。メールのパターンは通常のフォームが受けるべきものを受け、実在のアドレスが必要なものを拒みません。RFC 5322 は実装しません — フォームも実装すべきではないからです。使う前に自分のデータで一度テストを — 本サイトのテスターまでワン クリックです。",
        },
        {
          q: "クレジット カードのパターンが発行元プレフィックスだけなのはなぜ?",
          a: "正規表現はカードの有効性を絶対に判定できないからです。それには Luhn チェックと発行元への問い合わせが必要です。このパターンは Visa・Mastercard・Amex・Discover の番号形状を認識して、入力の整形や桁のマスキングに使います。UX には良く、支払い判断には使わないでください。",
        },
        {
          q: "Unicode のレシピはどこでも動きますか?",
          a: "ハッシュタグと絵文字のレシピは \\p{…} クラスを使い、u フラグが必要です。最新のブラウザと Node、他言語の最近のランタイムなら動きます。Unicode プロパティ エスケープより前の環境では、各レシピにその旨の注記があり、明示的な文字範囲に置き換えられます。",
        },
      ],
    },
    es: {
      name: "Biblioteca de regex",
      h1: "Biblioteca de regex — patrones listos para copiar",
      tagline:
        "Treinta recetas de regex curadas con una explicación en tu idioma: email, URL, IPv4, fechas, colores hex, contraseñas, hashtags y más.",
      intro: [
        "Nadie debería escribir a mano un detector de IPv4 un viernes a las seis de la tarde. Esta biblioteca reúne treinta patrones probados, listos para copiar, para las tareas que se repiten: emails y URLs, IPv4 e IPv6, fechas ISO y americanas, horas, teléfonos, reglas de contraseña fuerte, slugs, etiquetas HTML, UUID, semver, precios, hashtags en cualquier alfabeto, hasta un buscador de palabras duplicadas basado en una retroreferencia.",
        "Cada entrada dice sin rodeos qué cubre y qué no — la receta de email es un subconjunto pragmático, no el RFC 5322, y la de tarjetas de crédito reconoce formas de emisor, nunca si una tarjeta es real. Cada patrón incluye un texto de muestra que coincide de forma verificable, y cada explicación está escrita en tu idioma, no traducida a máquina después.",
      ],
      steps: [
        "Busca en la biblioteca por nombre, patrón o descripción.",
        "Abre la receta que necesites y lee la nota de alcance: qué coincide y qué ignora a propósito.",
        "Copia el patrón (y el texto de muestra si quieres un caso de prueba listo).",
        "Pégalo en el probador para confirmar que se comporta como tus datos necesitan.",
      ],
      faqs: [
        {
          q: "¿Estos patrones están listos para producción?",
          a: "Son honestos para producción: cada entrada documenta su alcance y sus límites. El patrón de email acepta todo lo que un formulario normal debe aceptar y no rechaza nada que una dirección real necesite; no implementa el RFC 5322, porque ningún formulario debería. Prueba cada receta con tus datos antes de confiar en ella — el probador de este sitio está a un clic.",
        },
        {
          q: "¿Por qué el patrón de tarjetas solo mira prefijos de emisor?",
          a: "Porque una regex nunca puede decirte si una tarjeta es válida: eso exige el algoritmo de Luhn y una respuesta en vivo del emisor. El patrón reconoce las formas numéricas de Visa, Mastercard, Amex y Discover para preformatear la entrada o enmascarar dígitos. Úsalo para la experiencia de usuario, nunca para decisiones de pago.",
        },
        {
          q: "¿Las recetas Unicode funcionan en todos lados?",
          a: "Las recetas de hashtag y emoji usan clases \\p{…}, que requieren la bandera u — disponible en todos los navegadores modernos, en Node y en las versiones recientes de la mayoría de lenguajes. Si tu entorno es anterior a las escapes de propiedades Unicode, las entradas lo indican y puedes recurrir a rangos de caracteres explícitos.",
        },
      ],
    },
    pt: {
      name: "Biblioteca de regex",
      h1: "Biblioteca de regex — padrões prontos para copiar",
      tagline:
        "Trinta receitas de regex curadas com uma explicação no seu idioma: e-mail, URL, IPv4, datas, cores hex, senhas fortes, hashtags e mais.",
      intro: [
        "Ninguém deveria escrever à mão um detector de IPv4 numa sexta-feira às seis da tarde. Esta biblioteca reúne trinta padrões testados, prontos para copiar, para as tarefas que se repetem: e-mails e URLs, IPv4 e IPv6, datas ISO e americanas, horários, telefones, regras de senha forte, slugs, tags HTML, UUIDs, semver, preços, hashtags em qualquer alfabeto, até um caçador de palavras duplicadas baseado em referência inversa.",
        "Cada entrada diz com clareza o que cobre e o que não cobre — a receita de e-mail é um subconjunto pragmático, não o RFC 5322, e a de cartões de crédito reconhece formas de emissor, nunca se um cartão é real. Cada padrão vem com um texto de amostra que ele comprovadamente encontra, e cada explicação foi escrita no seu idioma, não traduzida por máquina depois.",
      ],
      steps: [
        "Pesquise na biblioteca por nome, padrão ou descrição.",
        "Abra a receita de que precisa e leia a nota de escopo: o que ela encontra e o que ignora de propósito.",
        "Copie o padrão (e o texto de amostra, se quiser um caso de teste pronto).",
        "Cole no testador para confirmar que ele se comporta como os seus dados exigem.",
      ],
      faqs: [
        {
          q: "Esses padrões estão prontos para produção?",
          a: "São honestos para produção: cada entrada documenta seu escopo e seus limites. O padrão de e-mail aceita tudo o que um formulário normal deve aceitar e não rejeita nada que um endereço real precise; não implementa o RFC 5322, porque nenhum formulário deveria. Teste cada receita com os seus dados antes de confiar — o testador deste site está a um clique.",
        },
        {
          q: "Por que o padrão de cartão olha apenas prefixos de emissor?",
          a: "Porque uma regex nunca pode dizer se um cartão é válido — isso exige o algoritmo de Luhn e uma resposta em tempo real do emissor. O padrão reconhece as formas numéricas de Visa, Mastercard, Amex e Discover para pré-formatar a entrada ou mascarar dígitos. Use para experiência do usuário, nunca para decisões de pagamento.",
        },
        {
          q: "As receitas Unicode funcionam em qualquer lugar?",
          a: "As receitas de hashtag e emoji usam classes \\p{…}, que exigem a flag u — disponível em todos os navegadores modernos, no Node e nas versões recentes da maioria das linguagens. Se o seu ambiente é anterior às property escapes Unicode, as entradas avisam e você pode recorrer a intervalos de caracteres explícitos.",
        },
      ],
    },
  },
});
