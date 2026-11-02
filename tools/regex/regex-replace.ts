import { defineTool } from "../_lib/types";
import { RegexReplaceEngine } from "../_engines/regex-replace";

export default defineTool({
  slug: "regex-replace",
  category: "developer",
  icon: "swap",
  engine: { component: RegexReplaceEngine },
  related: ["regex-tester", "regex-explainer", "regex-library"],
  copy: {
    en: {
      name: "Regex Replace",
      h1: "Regex Find & Replace",
      tagline:
        "Find and replace with regular expressions right in the browser: group references, live preview and an honest match count — nothing is uploaded.",
      intro: [
        "Paste a pattern, a replacement and your text: the result updates as you type, with a count of exactly how many matches were replaced — so you can tell a global swap from an accidental single hit. Replacements use JavaScript's full grammar: $1 and friends for capture groups, $& for the whole match, $<name> for named groups, $$ for a literal dollar.",
        "The replace runs on your device with the same tested wrapper the site's API uses, capped like the tester (20,000 characters, 500 matches counted) so a runaway pattern cannot grind silently. And because it is the real String.replace semantics — including greedy quantifiers and non-overlapping matches — what you see here is what your code will do.",
      ],
      steps: [
        "Enter the pattern and the replacement, using $1, $& or $<name> to reuse what matched.",
        "Toggle the flags — remember that without g only the first match is replaced.",
        "Paste the text; the output and the replaced-count update live.",
        "Copy the result, or adjust until the count matches what you expected.",
      ],
      faqs: [
        {
          q: "Which $ references can I use in the replacement?",
          a: "The full JavaScript set: $1…$99 for capture groups, $<name> for named groups, $& for the whole match, $` for the part before and $' for the part after, and $$ for a literal dollar sign. Undefined groups become an empty string, exactly as in code.",
        },
        {
          q: "Why was only the first match replaced?",
          a: "Because the global flag (g) is off — without it, String.replace stops after the first hit. That is the standard JavaScript behavior, and the match count tells you which mode you are in: 1 usually means the flag is missing, while the full count confirms every occurrence was handled.",
        },
        {
          q: "Can I use this to transform a whole file?",
          a: "Yes, within the preview cap: text is processed up to 20,000 characters and match counting stops at 500, which covers config files, log excerpts and typical documents. For a 50 MB dump you want a CLI anyway — this tool is for seeing the transformation before you commit it.",
        },
      ],
    },
    zh: {
      name: "正则替换",
      h1: "正则查找与替换",
      tagline:
        "在浏览器里用正则做查找替换:分组引用、实时预览、诚实的匹配计数——全程本地,不上传任何内容。",
      intro: [
        "粘贴模式、替换文本和原文:结果随输入实时更新,并精确统计替换了几处——一眼分清「全局替换」和「只换了第一处」。替换串支持 JavaScript 完整语法:$1 等捕获组引用、$& 整个匹配、$<名字> 命名组、$$ 表示字面美元符。",
        "替换在本机运行,用的是与站点 API 相同、经过测试的封装,上限与测试器一致(20,000 字符、计数上限 500 处),失控的模式无法悄悄卡死页面。而且这就是真正的 String.replace 语义——包括贪婪量词与不重叠匹配——你在这里看到什么,代码里就是什么。",
      ],
      steps: [
        "输入模式和替换文本,用 $1、$& 或 $<名字> 复用匹配到的内容。",
        "切换标志位——记住不开 g 只会替换第一处。",
        "粘贴文本;输出和替换计数实时更新。",
        "复制结果;如果计数和预期不符,回头调整模式。",
      ],
      faqs: [
        {
          q: "替换串里能用哪些 $ 引用?",
          a: "JavaScript 全集:$1…$99 捕获组、$<名字> 命名组、$& 整个匹配、$` 匹配前的部分、$' 匹配后的部分、$$ 字面美元符。未参与的组会替换成空串,和代码里的行为完全一致。",
        },
        {
          q: "为什么只替换了第一处?",
          a: "因为没开 global(g)标志——不开时 String.replace 只处理第一个匹配,这是 JavaScript 的标准行为。替换计数会告诉你当前模式:计数是 1 通常意味着漏了 g;计数等于全部命中数,才说明每一处都被处理了。",
        },
        {
          q: "能拿它转换整个文件吗?",
          a: "可以,但受预览上限约束:文本最多处理 20,000 字符,计数到 500 处为止——覆盖配置文件、日志节选和常见文档绰绰有余。50 MB 的转储请用命令行工具;这个工具的价值是「提交之前先看清变换结果」。",
        },
      ],
    },
    ja: {
      name: "正規表現置換",
      h1: "正規表現での検索と置換",
      tagline:
        "ブラウザ内で正規表現による検索と置換:グループ参照、ライブ プレビュー、正直なマッチ件数 — 何もアップロードしません。",
      intro: [
        "パターンと置換後テキストと本文を貼る:入力するたびに結果が更新され、何件置換されたかを正確に数えます — 全置換と「最初の 1 件だけ」の取り違えがすぐ分かります。置換文字列は JavaScript の完全な文法に対応:$1 などのキャプチャ グループ、$& でマッチ全体、$<名前> で名前付きグループ、$$ でドル記号そのもの。",
        "置換はあなたの端末上で、サイトの API と同じテスト済みラッパーで実行され、テスターと同じ上限(20,000 文字、カウント 500 件)を設けているので、暴走パターンが黙ってページを固めることはありません。しかも本物の String.replace の意味論 — 貪欲な量詞も重ならないマッチもそのまま — なので、ここで見た結果がそのままコードの結果です。",
      ],
      steps: [
        "パターンと置換後テキストを入力し、$1・$&・$<名前> でマッチ内容を再利用します。",
        "フラグを切り替えます — g がなければ最初の 1 件しか置換されない点に注意。",
        "テキストを貼ります。出力と置換件数がリアルタイムで更新されます。",
        "結果をコピーします。件数が期待と違えば、パターンを調整してから。",
      ],
      faqs: [
        {
          q: "置換文字列にはどの $ 参照が使えますか?",
          a: "JavaScript のフル セットです:$1…$99 のキャプチャ グループ、$<名前> の名前付きグループ、$& のマッチ全体、$` でマッチの前、$' でマッチの後、$$ でリテラルのドル記号。未定義のグループは空文字列になります — コードと同じ挙動です。",
        },
        {
          q: "最初の 1 件しか置換されないのはなぜ?",
          a: "global(g)フラグが付いていないからです。なければ String.replace は最初のマッチで止まります。これは JavaScript の標準動作で、置換件数が今のモードを教えてくれます:1 件ならたいてい g がない、全件数ならすべて処理済みです。",
        },
        {
          q: "ファイル全体の変換にも使えますか?",
          a: "使えますが、プレビュー上限の範囲内です:テキストは最大 20,000 文字、カウントは 500 件まで。設定ファイル、ログの抜粋、通常の文書なら十分です。50 MB のダンプには CLI の方が良い — このツールの価値は、確定する前に変換結果を眼で確認できることです。",
        },
      ],
    },
    es: {
      name: "Reemplazo con regex",
      h1: "Buscar y reemplazar con expresiones regulares",
      tagline:
        "Busca y reemplaza con expresiones regulares en el navegador: referencias de grupo, vista previa en vivo y un recuento honesto — nada se sube.",
      intro: [
        "Pega un patrón, un reemplazo y tu texto: el resultado se actualiza al escribir, con el número exacto de coincidencias reemplazadas — distingue un cambio global de un golpe accidental único. El reemplazo admite la gramática completa de JavaScript: $1 y compañía para grupos de captura, $& para el fallo entero, $<nombre> para grupos con nombre y $$ para un dólar literal.",
        "El reemplazo corre en tu dispositivo con el mismo envoltorio probado que usa la API del sitio, con los mismos límites del probador (20.000 caracteres, 500 coincidencias contadas) para que un patrón desbocado no se atasque en silencio. Y como es la semántica real de String.replace — incluidos cuantificadores glotones y coincidencias no superpuestas — lo que ves aquí es lo que hará tu código.",
      ],
      steps: [
        "Introduce el patrón y el reemplazo, usando $1, $& o $<nombre> para reutilizar lo que coincida.",
        "Activa las banderas — recuerda que sin g solo se reemplaza la primera coincidencia.",
        "Pega el texto; la salida y el recuento se actualizan en vivo.",
        "Copia el resultado, o ajusta hasta que el recuento coincida con lo esperado.",
      ],
      faqs: [
        {
          q: "¿Qué referencias $ puedo usar en el reemplazo?",
          a: "El set completo de JavaScript: $1…$99 para grupos de captura, $<nombre> para grupos con nombre, $& para el fallo entero, $` para la parte anterior y $' para la posterior, y $$ para un signo de dólar literal. Los grupos indefinidos se vuelven una cadena vacía, igual que en el código.",
        },
        {
          q: "¿Por qué solo se reemplazó la primera coincidencia?",
          a: "Porque la bandera global (g) está apagada — sin ella, String.replace se detiene tras el primer hallazgo. Es el comportamiento estándar de JavaScript, y el recuento te dice en qué modo estás: 1 suele significar que falta la bandera; el recuento completo confirma que se procesaron todas las ocurrencias.",
        },
        {
          q: "¿Puedo transformar un archivo entero?",
          a: "Sí, dentro del límite de vista previa: se procesan hasta 20.000 caracteres y el recuento se detiene en 500, lo que cubre archivos de configuración, extractos de logs y documentos típicos. Para un volcado de 50 MB quieres una CLI de todos modos — esta herramienta sirve para ver la transformación antes de confirmarla.",
        },
      ],
    },
    pt: {
      name: "Substituição com regex",
      h1: "Buscar e substituir com expressões regulares",
      tagline:
        "Busque e substitua com expressões regulares no navegador: referências de grupo, pré-visualização ao vivo e uma contagem honesta — nada é enviado.",
      intro: [
        "Cole um padrão, uma substituição e o seu texto: o resultado se atualiza enquanto você digita, com a contagem exata de correspondências substituídas — dá para distinguir uma troca global de um acerto único acidental. A substituição aceita a gramática completa do JavaScript: $1 e companhia para grupos de captura, $& para o trecho inteiro, $<nome> para grupos nomeados e $$ para um cifrão literal.",
        "A substituição roda no seu dispositivo com o mesmo wrapper testado que a API do site usa, com os mesmos limites do testador (20.000 caracteres, 500 correspondências contadas) para que um padrão desgarrado não trave tudo em silêncio. E como é a semântica real do String.replace — inclusive quantificadores gananciosos e correspondências não sobrepostas — o que você vê aqui é o que o seu código fará.",
      ],
      steps: [
        "Informe o padrão e a substituição, usando $1, $& ou $<nome> para reutilizar o que corresponder.",
        "Alterne as flags — lembre que sem g apenas a primeira correspondência é substituída.",
        "Cole o texto; a saída e a contagem se atualizam ao vivo.",
        "Copie o resultado, ou ajuste até a contagem bater com o esperado.",
      ],
      faqs: [
        {
          q: "Quais referências $ posso usar na substituição?",
          a: "O conjunto completo do JavaScript: $1…$99 para grupos de captura, $<nome> para grupos nomeados, $& para o trecho inteiro, $` para a parte antes e $' para a depois, e $$ para um cifrão literal. Grupos indefinidos viram string vazia, exatamente como no código.",
        },
        {
          q: "Por que só a primeira correspondência foi substituída?",
          a: "Porque a flag global (g) está desligada — sem ela, o String.replace para depois do primeiro achado. É o comportamento padrão do JavaScript, e a contagem diz em qual modo você está: 1 normalmente significa que falta a flag; a contagem completa confirma que todas as ocorrências foram tratadas.",
        },
        {
          q: "Dá para transformar um arquivo inteiro?",
          a: "Sim, dentro do limite da pré-visualização: até 20.000 caracteres processados e 500 correspondências contadas, o que cobre arquivos de configuração, trechos de log e documentos típicos. Para um dump de 50 MB você vai querer uma CLI de qualquer forma — esta ferramenta serve para ver a transformação antes de aplicá-la.",
        },
      ],
    },
  },
});
