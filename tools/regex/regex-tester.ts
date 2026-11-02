import { defineTool } from "../_lib/types";
import { RegexTesterEngine } from "../_engines/regex-tester";

export default defineTool({
  slug: "regex-tester",
  category: "developer",
  icon: "code",
  featured: true,
  engine: { component: RegexTesterEngine },
  related: ["regex-explainer", "regex-library", "regex-replace"],
  copy: {
    en: {
      name: "Regex Tester",
      h1: "Regex Tester",
      tagline:
        "Test regular expressions live in your browser: match highlighting, capture-group breakdown and a ReDoS warning before a risky pattern ships.",
      intro: [
        "Write a pattern, tick the flags, paste your text — every match lights up as you type, with its position and all capture groups (numbered and named) listed underneath. The engine is the real JavaScript RegExp, running entirely on your device: nothing is uploaded, nothing is logged, and there is no server round-trip between edits.",
        "The tester is honest about the one way regexes go wrong in production: catastrophic backtracking. If your pattern nests quantifiers — think (a+)+ — or repeats a group with ambiguous alternatives, a heuristic check flags it before you copy it into code. That check is a heuristic, not a proof, and long inputs are capped at 20,000 characters with 500 matches shown, so a pathological pattern cannot freeze the page silently.",
      ],
      steps: [
        "Type or paste a pattern and toggle the flags you need (g, i, m, s, u).",
        "Paste the text you want to search — a log line, a document, a config dump.",
        "Read the highlighted preview and the match list below it: position, text and groups for every hit.",
        "If the ReDoS warning appears, bound or simplify the pattern before shipping it.",
      ],
      faqs: [
        {
          q: "Which regex flavor does this use?",
          a: "JavaScript's own engine (ECMA-262), the same one that runs in every browser and in Node. It differs from PCRE, Python or Go in small ways: named groups are (?<name>…), possessive quantifiers and atomic groups are not supported, and lookbehind is available in all modern engines. If your pattern works here, it will behave the same in your JavaScript code.",
        },
        {
          q: "What is the ReDoS warning about?",
          a: "ReDoS (Regular expression Denial of Service) happens when a pattern can match the same span of text in many different ways, so the engine backtracks exponentially — the classic example is (a+)+. The tester runs a lightweight heuristic that detects nested unbounded quantifiers and overlapping alternations inside repeated groups. It is deliberately conservative: it can miss exotic cases and it can warn on harmless patterns. Either way, the advice is the same — bound your quantifiers and make alternatives unambiguous.",
        },
        {
          q: "Does my text or pattern get uploaded anywhere?",
          a: "No. Matching happens with the browser's own RegExp on your device. There is no backend, no telemetry and no storage: closing the tab erases everything. That also means the tool works offline once the page has loaded.",
        },
        {
          q: "Why do I see fewer matches than grep finds?",
          a: "Two common reasons: the global flag (g) is off, so only the first match is reported; or the pattern matches overlapping spans, which JavaScript — like every regex engine — reports as consecutive, non-overlapping matches. The match list shows each hit's index so you can see exactly where the engine resumed searching.",
        },
      ],
    },
    zh: {
      name: "正则测试器",
      h1: "正则表达式测试器",
      tagline:
        "在浏览器里实时测试正则表达式:匹配高亮、捕获组拆解,还有 ReDoS 风险警示——上线前先发现会卡死的模式。",
      intro: [
        "写一个模式,勾上标志位,粘贴测试文本——每次输入,匹配结果即时点亮,位置、编号捕获组、命名捕获组一并列出。底层就是浏览器自己的 JavaScript RegExp:全程本地运行,不上传、不记录,编辑之间没有任何服务器往返。",
        "这个测试器对正则在生产环境里最常见的翻车方式——灾难性回溯——保持诚实。如果模式里出现嵌套量词(比如 (a+)+)或带歧义分支的重复组,启发式检查会在你复制进代码之前先报警。启发式不等于证明:它可能漏掉罕见构造,也可能误报无害模式,所以测试文本上限 20,000 字符、最多显示 500 处匹配,病态模式也无法悄悄冻住页面。",
      ],
      steps: [
        "输入或粘贴正则表达式,按需切换标志位(g、i、m、s、u)。",
        "粘贴要搜索的文本——一行日志、一份文档、一段配置。",
        "阅读高亮预览和下方的匹配列表:每处命中都有位置、文本和捕获组。",
        "如果出现 ReDoS 警示,先限制量词范围或简化分支,再放进代码。",
      ],
      faqs: [
        {
          q: "这里用的是哪种正则方言?",
          a: "JavaScript 自己的引擎(ECMA-262),与每个浏览器和 Node 里的完全相同。它与 PCRE、Python、Go 有细微差别:命名组写作 (?<name>…),不支持占有量词和原子组;现代引擎都支持后顾断言。在这里能跑通的模式,放进你的 JavaScript 代码行为一致。",
        },
        {
          q: "ReDoS 警示在说什么?",
          a: "ReDoS(正则拒绝服务)指一个模式能以多种方式匹配同一段文本,引擎因此指数级回溯——经典例子是 (a+)+。测试器内置一个轻量启发式:检测嵌套的无界量词、重复组里的重叠分支。它刻意保守:可能漏掉罕见情况,也可能对无害模式报警。无论如何,建议都一样——给量词设边界,让分支互不重叠。",
        },
        {
          q: "文本和表达式会被上传吗?",
          a: "不会。匹配由浏览器自带的 RegExp 在你的设备上完成:没有后端、没有统计、没有存储,关掉标签页一切消失。页面加载完成后离线也能用。",
        },
        {
          q: "为什么匹配数量比 grep 少?",
          a: "两个常见原因:没开 global(g)标志,只报告第一个匹配;或者模式会匹配重叠区间,而 JavaScript 和所有正则引擎一样,只报告连续、不重叠的匹配。匹配列表里列出了每处命中的下标,可以看到引擎从哪里继续搜索。",
        },
      ],
    },
    ja: {
      name: "正規表現テスター",
      h1: "正規表現テスター",
      tagline:
        "ブラウザで正規表現をライブテスト:マッチのハイライト、キャプチャ グループの分解、さらに危険なパターンを搬入前に警告する ReDoS チェック。",
      intro: [
        "パターンを書き、フラグを選び、テキストを貼る — 入力するたびにマッチが即座にハイライトされ、位置とすべてのキャプチャ グループ(番号付き・名前付き)が下に並びます。エンジンはブラウザ本来の JavaScript RegExp。端末内で完結し、アップロードも記録もなく、編集のたびのサーバー往復もありません。",
        "このテスターは、本番で正規表現が壊れるいちばん典型的な道 — 災害的バックトラッキング — について正直です。(a+)+ のような入れ子の量詞や、曖昧な選択肢を持つ繰り返しグループがあると、コードにコピーする前にヒューリスティックが警告します。ヒューリスティックは証明ではありません:珍しい構造を見逃すことも、無害なパターンに警告することもあります。そのためテキストは 20,000 文字、表示は 500 マッチで上限とし、病的なパターンでもページが黙って固まることはありません。",
      ],
      steps: [
        "正規表現を入力し、必要なフラグ(g・i・m・s・u)を切り替えます。",
        "検索したいテキスト(ログの 1 行、文書、設定のダンプなど)を貼り付けます。",
        "ハイライト表示とマッチ リストを読みます。各マッチに位置・テキスト・グループが付きます。",
        "ReDoS 警告が出たら、量詞に上限を付けるか選択肢を曖昧でなくしてから搬入してください。",
      ],
      faqs: [
        {
          q: "どの正規表現方言を使っていますか?",
          a: "JavaScript 本来のエンジン(ECMA-262)です。すべてのブラウザと Node で動くのと同じもの。PCRE・Python・Go とは細部が違います:名前付きグループは (?<name>…)、絶対量詞やアトミック グループは非対応、ルックビハインドは最新エンジンなら利用可能。ここで動くパターンはあなたの JavaScript コードでも同じ挙動になります。",
        },
        {
          q: "ReDoS 警告は何を伝えていますか?",
          a: "ReDoS(正規表現サービス拒否)は、1 つのパターンが同じ範囲を何通りにもマッチでき、エンジンが指数回のバックトラッキングをする現象です。定番の例は (a+)+。テスターは軽量ヒューリスティックで、入れ子になった無限容量の量詞と、繰り返しグループ内の重なる選択肢を検出します。意図的に保守的で、稀なケースを見逃すことも無害なパターンに警告することもあります。対策はひとつ:量詞に上限を付け、選択肢を曖昧にしないことです。",
        },
        {
          q: "テキストやパターンはどこかに送信されますか?",
          a: "いいえ。マッチングはブラウザの RegExp があなたの端末で行います。バックエンドもテレメトリも保存もなく、タブを閉じればすべて消えます。ページを読み込めばオフラインでも使えます。",
        },
        {
          q: "grep よりマッチが少ないのはなぜ?",
          a: "よくある理由は 2 つ。global(g)フラグが付いておらず最初の 1 件しか報告されないか、パターンが重なり得る範囲にマッチする一方で、JavaScript は(他のエンジン同様)連続して重ならないマッチしか報告しないかです。マッチ リストに各ヒットの位置を出しているので、エンジンがどこから検索を再開したか正確に分かります。",
        },
      ],
    },
    es: {
      name: "Probador de regex",
      h1: "Probador de expresiones regulares",
      tagline:
        "Prueba expresiones regulares en vivo en tu navegador: resaltado de coincidencias, desglose de grupos de captura y aviso de ReDoS antes de enviar un patrón arriesgado.",
      intro: [
        "Escribe un patrón, marca las banderas, pega tu texto — cada coincidencia se ilumina al instante, con su posición y todos los grupos de captura (numerados y con nombre) debajo. El motor es el RegExp real de JavaScript, ejecutándose por completo en tu dispositivo: nada se sube, nada se registra y no hay viaje al servidor entre ediciones.",
        "El probador es honesto con la forma en que las regex fallan en producción: el retroceso catastrófico. Si tu patrón anida cuantificadores — piensa en (a+)+ — o repite un grupo con alternativas ambiguas, una comprobación heurística lo avisa antes de que lo copies a tu código. Esa comprobación es una heurística, no una prueba: puede pasar por alto casos exóticos y avisar sobre patrones inofensivos. Por eso el texto se limita a 20.000 caracteres y se muestran 500 coincidencias como máximo, para que un patrón patológico no congele la página en silencio.",
      ],
      steps: [
        "Escribe o pega un patrón y activa las banderas que necesites (g, i, m, s, u).",
        "Pega el texto que quieres buscar: una línea de log, un documento, una configuración.",
        "Lee la vista resaltada y la lista de coincidencias: posición, texto y grupos de cada hallazgo.",
        "Si aparece el aviso de ReDoS, acota o simplifica el patrón antes de enviarlo.",
      ],
      faqs: [
        {
          q: "¿Qué sabor de regex utiliza?",
          a: "El motor propio de JavaScript (ECMA-262), el mismo que corre en todos los navegadores y en Node. Difiere de PCRE, Python o Go en detalles: los grupos con nombre son (?<name>…), no hay cuantificadores posesivos ni grupos atómicos, y el lookbehind está disponible en todos los motores modernos. Si tu patrón funciona aquí, se comportará igual en tu código JavaScript.",
        },
        {
          q: "¿Qué significa el aviso de ReDoS?",
          a: "ReDoS (denegación de servicio por expresión regular) ocurre cuando un patrón puede coincidir con el mismo tramo de muchas formas y el motor retrocede exponencialmente — el clásico es (a+)+. El probador aplica una heurística ligera que detecta cuantificadores sin límite anidados y alternativas que se solapan dentro de grupos repetidos. Es deliberadamente conservador: puede escapársele casos raros y avisar sobre patrones inofensivos. El consejo es el mismo en ambos casos: acota los cuantificadores y haz las alternativas inequívocas.",
        },
        {
          q: "¿Se sube mi texto o mi patrón a algún sitio?",
          a: "No. La búsqueda la hace el RegExp del navegador en tu dispositivo. No hay backend, ni telemetría, ni almacenamiento: al cerrar la pestaña todo desaparece. Además, la herramienta funciona sin conexión una vez cargada la página.",
        },
        {
          q: "¿Por qué veo menos coincidencias que con grep?",
          a: "Dos razones habituales: la bandera global (g) está apagada y solo se informa de la primera coincidencia; o el patrón coincide con tramos que se solapan, y JavaScript — como todos los motores — informa de coincidencias consecutivas, no superpuestas. La lista muestra el índice de cada hallazgo para que veas dónde reanudó la búsqueda el motor.",
        },
      ],
    },
    pt: {
      name: "Testador de regex",
      h1: "Testador de expressões regulares",
      tagline:
        "Teste expressões regulares ao vivo no navegador: destaque de correspondências, detalhamento de grupos de captura e alerta de ReDoS antes de um padrão arriscado ir para produção.",
      intro: [
        "Escreva um padrão, marque as flags, cole o texto — cada correspondência acende enquanto você digita, com posição e todos os grupos de captura (numerados e nomeados) listados abaixo. O motor é o RegExp real do JavaScript, rodando inteiramente no seu dispositivo: nada é enviado, nada é registrado e não há viagem ao servidor entre uma edição e outra.",
        "O testador é honesto quanto ao jeito clássico de regex falhar em produção: o retrocesso catastrófico. Se o seu padrão aninha quantificadores — pense em (a+)+ — ou repete um grupo com alternativas ambíguas, uma verificação heurística avisa antes de você copiar para o código. A verificação é uma heurística, não uma prova: pode deixar passar casos exóticos e pode alertar sobre padrões inofensivos. Por isso o texto é limitado a 20.000 caracteres e 500 correspondências, para que um padrão patológico não congele a página em silêncio.",
      ],
      steps: [
        "Digite ou cole um padrão e ative as flags de que precisa (g, i, m, s, u).",
        "Cole o texto que quer pesquisar: uma linha de log, um documento, uma configuração.",
        "Leia a pré-visualização destacada e a lista de correspondências: posição, texto e grupos de cada ocorrência.",
        "Se o alerta de ReDoS aparecer, delimite ou simplifique o padrão antes de enviá-lo.",
      ],
      faqs: [
        {
          q: "Qual dialeto de regex é usado?",
          a: "O motor nativo do JavaScript (ECMA-262), o mesmo que roda em todos os navegadores e no Node. Difere de PCRE, Python ou Go em detalhes: grupos nomeados são (?<name>…), não há quantificadores possessivos nem grupos atômicos, e o lookbehind está disponível em todos os motores modernos. Se o padrão funciona aqui, ele se comportará igual no seu código JavaScript.",
        },
        {
          q: "Sobre o que é o alerta de ReDoS?",
          a: "ReDoS (negação de serviço por expressão regular) acontece quando um padrão pode corresponder ao mesmo trecho de muitas maneiras e o motor retrocede exponencialmente — o clássico é (a+)+. O testador aplica uma heurística leve que detecta quantificadores ilimitados aninhados e alternativas que se sobrepõem dentro de grupos repetidos. Ela é deliberadamente conservadora: pode escapar de casos raros e pode alertar sobre padrões inofensivos. O conselho é o mesmo nos dois casos: delimite os quantificadores e torne as alternativas inequívocas.",
        },
        {
          q: "Meu texto ou padrão é enviado para algum lugar?",
          a: "Não. A busca acontece com o RegExp do navegador, no seu dispositivo. Não há backend, nem telemetria, nem armazenamento: fechar a aba apaga tudo. E a ferramenta funciona offline depois que a página carrega.",
        },
        {
          q: "Por que vejo menos correspondências que no grep?",
          a: "Dois motivos comuns: a flag global (g) está desligada e só a primeira correspondência é reportada; ou o padrão corresponde a trechos que se sobrepõem, e o JavaScript — como todo motor — reporta correspondências consecutivas, não sobrepostas. A lista mostra o índice de cada ocorrência para você ver exatamente onde o motor retomou a busca.",
        },
      ],
    },
  },
});
