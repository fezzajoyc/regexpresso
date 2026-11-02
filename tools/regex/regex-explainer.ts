import { defineTool } from "../_lib/types";
import { RegexExplainerEngine } from "../_engines/regex-explainer";

export default defineTool({
  slug: "regex-explainer",
  category: "developer",
  icon: "text",
  featured: true,
  engine: { component: RegexExplainerEngine },
  related: ["regex-tester", "regex-library", "regex-replace"],
  copy: {
    en: {
      name: "Regex Explainer",
      h1: "Regex Explainer — plain language, in your language",
      tagline:
        "Paste any regular expression and read it in plain words: every token, group, quantifier and lookaround explained sentence by sentence — in 15 languages.",
      intro: [
        "A regular expression is write-only code for most people: you can paste it, but six months later nobody — often not even the author — can say what it does. This tool breaks the pattern into tokens (text, character classes, quantifiers, groups, anchors, lookarounds) and describes each one in a plain sentence, in the language you think in. That last part is the point: regex explainers exist, but they explain in English only.",
        "The breakdown is honest about JavaScript's own semantics, including the forgiving corners of its non-unicode mode, and it reports syntax errors at the character position where the engine itself gives up. When a pattern repeats a group with nested or ambiguous quantifiers, the same ReDoS heuristic that powers the tester warns you here — explained, not just flagged.",
      ],
      steps: [
        "Paste a regular expression, or click one of the sample patterns.",
        "Read the token list: each piece shows its raw text and its role.",
        "Read the plain-language sentence under each token, with quantifier targets and group numbers spelled out.",
        "Copy the pattern back — or open the tester to check it against real text.",
      ],
      faqs: [
        {
          q: "How accurate is the explanation?",
          a: "It mirrors JavaScript's regex grammar (ECMA-262), including what its non-unicode mode tolerates, such as a bare { or ] treated literally. It explains what each piece means, not how a different engine like PCRE would interpret it — flavor differences are noted where they matter, for example \\p{…} needing the u flag.",
        },
        {
          q: "Does it validate my pattern?",
          a: "Yes. The tokenizer reports the same class of syntax errors the JS engine reports — unclosed groups, unterminated classes, quantifiers with nothing to repeat — with the character position where parsing gave up. The tester then gives you the engine's own error message if you want the canonical wording.",
        },
        {
          q: "Why sentences instead of a syntax tree?",
          a: "Because the goal is reading, not parsing practice. Each token gets one sentence in your language, in pattern order, with the quantifier's target and the group's number spelled out. You read top to bottom and know exactly what the pattern does — no tree vocabulary to learn first.",
        },
      ],
    },
    zh: {
      name: "正则解释器",
      h1: "正则表达式解释器——用你的语言说人话",
      tagline:
        "粘贴任意正则表达式,逐段读成人话:文本、字符类、量词、分组、锚点、环视,每一段都是一句大白话——支持 15 种语言。",
      intro: [
        "对大多数人来说,正则表达式是「只写不读」的代码:粘贴进去容易,半年后没人——常常连作者自己——说得清它到底在做什么。本工具把模式拆成词法单元(文本、字符类、量词、分组、锚点、环视),并逐个用一句平实的话解释,而且用的是你思考时用的语言。这正是差异所在:正则解释器并不少见,但只讲英语。",
        "拆解结果忠实于 JavaScript 自身语义,包括它非 Unicode 模式下的宽松角落;引擎在哪个字符位置放弃解析,工具就在哪个位置报语法错。当模式里出现嵌套或歧义量词的重复组时,驱动测试器的那个 ReDoS 启发式会在这里给出解释性警示——不只标红,还说清为什么。",
      ],
      steps: [
        "粘贴正则表达式,或点击示例模式。",
        "阅读词法单元列表:每段显示原文和角色。",
        "读每段下面的大白话:量词作用于谁、分组编号是多少,都写明了。",
        "把表达式复制回去——或打开测试器,用真实文本验证。",
      ],
      faqs: [
        {
          q: "解释有多准确?",
          a: "它对照 JavaScript 的正则文法(ECMA-262),包括非 Unicode 模式容忍的写法——比如裸的 { 或 ] 按字面量处理。它解释每一段的含义,而不是 PCRE 等其他引擎会如何解读;方言差异会在要紧处注明,例如 \\p{…} 需要 u 标志。",
        },
        {
          q: "它校验我的模式吗?",
          a: "会。分词器会报告与 JS 引擎同类别的语法错误——未闭合的分组、未终结的字符类、没有可重复对象的量词——并给出解析放弃时的字符位置。想要引擎的原话,可以去测试器看官方报错。",
        },
        {
          q: "为什么用句子而不用语法树?",
          a: "因为目标是「读懂」,不是练习解析。每个词法单元按模式顺序得到一句你的语言里的大白话,量词的作用对象、分组的编号都写明。从上往下读完,你就知道整个模式在做什么——不需要先学一套树的术语。",
        },
      ],
    },
    ja: {
      name: "正規表現解説",
      h1: "正規表現を平易な言葉で解説",
      tagline:
        "正規表現を貼り付けると、テキスト・文字クラス・量詞・グループ・アンカー・先読みを 1 文ずつやさしい言葉で解説 — 15 言語対応。",
      intro: [
        "正規表現は多くの人にとって「書けても読めない」コードです。貼り付けるのは簡単でも、半年後には誰も(作者自身ですら)何をしているのか説明できません。このツールはパターンをトークン(テキスト・文字クラス・量詞・グループ・アンカー・先読み)に分解し、それぞれをあなたが考えている言語の平易な一文で説明します。ここが差別化ポイント:正規表現の解説ツールはありますが、英語しか話せないのです。",
        "分解は JavaScript 本来の意味論に忠実で、非 Unicode モードの緩い隅(裸の { や ] がリテラル扱いになる等)も含みます。エンジンが解析を諦めた文字位置で構文エラーを報告します。入れ子や曖昧な量詞を含む繰り返しグループがある場合は、テスターを動かしているのと同じ ReDoS ヒューリスティックが、ただの赤表示ではなく説明付きで警告します。",
      ],
      steps: [
        "正規表現を貼り付けるか、サンプル パターンをクリックします。",
        "トークン リストを読みます。各部分に原文と役割が表示されます。",
        "各トークンの下の平易な文を読みます。量詞の対象とグループ番号も明示されます。",
        "パターンをコピーして戻す — またはテスターを開いて実テキストで確認します。",
      ],
      faqs: [
        {
          q: "解説はどのくらい正確ですか?",
          a: "JavaScript の正規表現文法(ECMA-262)に沿い、非 Unicode モードが許す書き方(裸の { や ] のリテラル扱いなど)も含みます。各部分の意味を説明するのであり、PCRE など別エンジンの解釈を説明するものではありません。方言の違いは必要な箇所で注記します(例:\\p{…} には u フラグが必要)。",
        },
        {
          q: "パターンの検証もしてくれますか?",
          a: "します。トークナイザは JS エンジンと同じ種類の構文エラー — 閉じられていないグループ、終端のない文字クラス、繰り返す対象のない量詞 — を、解析が止まった文字位置付きで報告します。エンジンの正式なエラーメッセージはテスターで確認できます。",
        },
        {
          q: "構文木ではなく文なのはなぜ?",
          a: "目的が「読めるようになること」だからです。各トークンに 1 文ずつ、パターン順に、あなたの言語で説明を付け、量詞の対象とグループ番号も明記します。上から下に読めばパターン全体が分かり、木の用語を先に覚える必要がありません。",
        },
      ],
    },
    es: {
      name: "Explicador de regex",
      h1: "Explicador de expresiones regulares en palabras claras",
      tagline:
        "Pega cualquier expresión regular y léela en palabras sencillas: cada token, grupo, cuantificador y lookaround explicado frase a frase — en 15 idiomas.",
      intro: [
        "Una expresión regular es código de solo escritura para la mayoría: pegarla es fácil, pero seis meses después nadie — a menudo ni el autor — puede decir qué hace. Esta herramienta divide el patrón en elementos (texto, clases de caracteres, cuantificadores, grupos, anclas, lookarounds) y describe cada uno con una frase sencilla, en el idioma en que piensas. Esa última parte es la diferencia: hay explicadores de regex, pero solo hablan inglés.",
        "El desglose es fiel a la semántica de JavaScript, incluidos los rincones indulgentes de su modo no unicode, y señala los errores de sintaxis en la posición exacta donde el motor se rinde. Cuando un patrón repite un grupo con cuantificadores anidados o ambiguos, la misma heurística de ReDoS que alimenta al probador te avisa aquí — explicada, no solo marcada.",
      ],
      steps: [
        "Pega una expresión regular o haz clic en uno de los patrones de ejemplo.",
        "Lee la lista de elementos: cada pieza muestra su texto y su función.",
        "Lee la frase sencilla bajo cada elemento, con el objetivo del cuantificador y el número de grupo a la vista.",
        "Copia el patrón de vuelta — o abre el probador para comprobarlo con texto real.",
      ],
      faqs: [
        {
          q: "¿Qué tan exacta es la explicación?",
          a: "Refleja la gramática regex de JavaScript (ECMA-262), incluido lo que su modo no unicode tolera, como una { o ] suelta tratada como literal. Explica qué significa cada pieza, no cómo la interpretaría otro motor como PCRE — las diferencias de sabor se indican donde importan, por ejemplo \\p{…} necesita la bandera u.",
        },
        {
          q: "¿Valida mi patrón?",
          a: "Sí. El tokenizador informa de la misma clase de errores de sintaxis que el motor JS — grupos sin cerrar, clases sin terminar, cuantificadores sin nada que repetir — con la posición del carácter donde el análisis se rindió. Si quieres el mensaje oficial del motor, el probador te lo muestra.",
        },
        {
          q: "¿Por qué frases y no un árbol sintáctico?",
          a: "Porque el objetivo es leer, no practicar el análisis. Cada elemento recibe una frase en tu idioma, en el orden del patrón, con el objetivo del cuantificador y el número del grupo por escrito. Lees de arriba abajo y sabes qué hace el patrón — sin aprender antes el vocabulario de los árboles.",
        },
      ],
    },
    pt: {
      name: "Explicador de regex",
      h1: "Explicador de expressões regulares em palavras simples",
      tagline:
        "Cole qualquer expressão regular e leia-a em palavras simples: cada token, grupo, quantificador e lookaround explicado frase a frase — em 15 idiomas.",
      intro: [
        "Para a maioria das pessoas, uma expressão regular é código que só se escreve: colar é fácil, mas seis meses depois ninguém — às vezes nem o autor — sabe dizer o que ela faz. Esta ferramenta divide o padrão em elementos (texto, classes de caracteres, quantificadores, grupos, âncoras, lookarounds) e descreve cada um com uma frase simples, no idioma em que você pensa. É aí que está a diferença: existem explicadores de regex, mas eles só falam inglês.",
        "O detalhamento é fiel à semântica do JavaScript, incluindo os cantos tolerantes do modo não unicode, e aponta erros de sintaxe na posição exata em que o motor desiste. Quando um padrão repete um grupo com quantificadores aninhados ou ambíguos, a mesma heurística de ReDoS que move o testador avisa aqui — com explicação, não apenas um destaque vermelho.",
      ],
      steps: [
        "Cole uma expressão regular ou clique em um dos padrões de exemplo.",
        "Leia a lista de elementos: cada pedaço mostra o texto original e o papel que exerce.",
        "Leia a frase simples sob cada elemento, com o alvo do quantificador e o número do grupo explícitos.",
        "Copie o padrão de volta — ou abra o testador para conferir com texto real.",
      ],
      faqs: [
        {
          q: "Quão precisa é a explicação?",
          a: "Ela segue a gramática regex do JavaScript (ECMA-262), inclusive o que o modo não unicode tolera, como uma { ou ] solta tratada como literal. Explica o que cada pedaço significa, não como um outro motor como o PCRE interpretaria — diferenças de dialeto são notadas onde importam, por exemplo \\p{…} exige a flag u.",
        },
        {
          q: "Ela valida meu padrão?",
          a: "Sim. O tokenizador informa a mesma classe de erros de sintaxe que o motor JS — grupos sem fechar, classes sem terminar, quantificadores sem nada para repetir — com a posição do caractere onde a análise parou. Se quiser a mensagem oficial do motor, o testador mostra.",
        },
        {
          q: "Por que frases em vez de uma árvore sintática?",
          a: "Porque o objetivo é leitura, não treino de análise. Cada elemento recebe uma frase no seu idioma, na ordem do padrão, com o alvo do quantificador e o número do grupo por extenso. Você lê de cima para baixo e sabe o que o padrão faz — sem precisar aprender antes o vocabulário de árvores.",
        },
      ],
    },
  },
});
