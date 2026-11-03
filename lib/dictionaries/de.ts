// de:Deutsche Übersetzung — Werte natürlich übersetzt, Schlüsselform identisch mit en.
// Vertrag: Schlüsselform muss mit en exakt übereinstimmen (tests/seo.test.ts tiefvergleichend), Werte müssen de sein.
const de = {
  brand: "RegExpresso",
  tagline: "Reguläre Ausdrücke – im Browser getestet und erklärt.",
  metaDesc:
    "Reguläre Ausdrücke in 15 Sprachen testen, erklären und ersetzen: Live-Tester mit Hervorhebung, Erklärer in klarer Sprache und 30 kopierfertige Muster. Alles im Browser.",

  nav: {
    tools: "Alle Tools",
    categories: "Kategorien",
    about: "Über uns",
    menu: "Menü",
    language: "Sprache",
  },

  home: {
    heroTitle: "Reguläre Ausdrücke, erklärt in Ihrer Sprache",
    heroSub:
      "Muster live testen, in klaren Worten lesen und auf 30 erprobte Rezepte zurückgreifen. Regex-Werkzeuge in 15 Sprachen – alles lokal im Browser, ohne Anmeldung, ohne Uploads.",
    browseAll: "Alle Tools ansehen",
    categoriesTitle: "Kategorien",
    featuredTitle: "Beliebte Tools",
    trustLocal: "Text bleibt auf Ihrem Gerät",
    trustFree: "Kostenlos, ohne Konto",
    trustFast: "Sofort, funktioniert offline",
    rotating: [
      "Muster einfügen und zusehen, wie jeder Treffer beim Tippen aufleuchtet",
      "Jede Regex in klaren Worten lesen – in Ihrer Sprache, nicht nur auf Englisch",
      "Dreißig erprobte Rezepte: E-Mail, IPv4, Daten, Hex-Farben, Passwörter",
      "ReDoS-Warnung, bevor ein riskantes Muster in Ihren Code gelangt",
    ],
    statsLabels: { tools: "Tools", languages: "Sprachen", uploads: "Uploads", accounts: "Konten" },
    eyebrow: "Für immer kostenlos",
    heroCtaSecondary: "So funktioniert es",
    statsTools: "{n} Tools",
    statsLanguages: "{n} Sprachen",
    statsUploads: "0 Uploads",
    statsAccounts: "0 Konten",
    categoriesSub: "Eine gebündelte Familie: reguläre Ausdrücke testen, erklären, ersetzen und entleihen.",
    popularSub: "Die Tools, die am häufigsten geöffnet werden.",
    privacyTitle: "Ihre Dateien verlassen Ihr Gerät nie.",
    privacySub:
      "Es gibt keinen Upload-Schritt. Die Tools sind JavaScript, das in Ihrem Browser läuft — das ist kein Versprechen in einer Datenschutzerklärung, sondern die Art, wie sie gebaut sind.",
    privacyPoint1T: "Lokale Verarbeitung",
    privacyPoint1D: "Muster und Testtext werden von JavaScript im Arbeitsspeicher Ihres Geräts verarbeitet. Nichts wird übertragen.",
    privacyPoint2T: "Keine Konten",
    privacyPoint2D: "Keine Anmeldung, keine E-Mail, kein gespeicherter Verlauf. Tool öffnen und loslegen.",
    privacyPoint3T: "Ehrlich von Grund auf",
    privacyPoint3D:
      "Wenn etwas im Browser wirklich nicht geht, sagen wir das — statt es so zu tun, als würde es funktionieren.",
    privacyLink: "Die vollständigen Datenschutzhinweise lesen",
    endTitle: "Wählen Sie ein Tool. Es funktioniert einfach.",
    endSub: "15 Sprachen, null Uploads, nichts zu installieren.",
  },

  tools: {
    title: "Alle Tools",
    subtitle: "Durchsuchen Sie {count} kostenlose Browser-Tools. Kein Upload, keine Anmeldung.",
    filterPlaceholder: "Tools suchen…",
    count: "{count} Tools",
    empty: "Keine Tools passen zu „{query}“.",
  },

  categories: {
    pdf: { name: "PDF", desc: "PDF-Dateien zusammenfügen, teilen, konvertieren und bearbeiten — ohne sie irgendwo hochzuladen." },
    image: { name: "Bilder", desc: "Bilder direkt im Browser komprimieren, skalieren, zuschneiden und konvertieren." },
    text: { name: "Text", desc: "Text zählen, bereinigen, sortieren und umwandeln — sofort bei jeder Eingabe." },
    developer: { name: "Regex", desc: "Reguläre Ausdrücke live testen, erklären, ersetzen und wiederverwenden – lokal und in 15 Sprachen." },
    seo: { name: "SEO", desc: "Meta-Tags, Schema-Markup, SERP-Vorschau und weitere On-Page-SEO-Helfer." },
    security: { name: "Sicherheit", desc: "Passwörter, Hashes und Lookups — auf Ihrem Gerät erzeugt und geprüft." },
    utility: { name: "Werkzeuge", desc: "Einheitenrechner, Taschenrechner und Alltags-Helfer." },
  },

  tool: {
    howTo: "So verwenden Sie es",
    faq: "Häufige Fragen",
    related: "Verwandte Tools",
    privacyNote:
      "Dieses Tool läuft vollständig in Ihrem Browser. Ihre Daten verlassen Ihr Gerät nie — sie werden auf keinen Server hochgeladen.",
    inCategory: "Mehr in {category}",
    backToCategory: "Alle {category}-Tools",
  },

  common: {
    openTool: "Werkzeug öffnen",
    copy: "Kopieren",
    copied: "Kopiert",
    download: "Herunterladen",
    reset: "Zurücksetzen",
    swap: "Tauschen",
    clear: "Leeren",
    error: "Etwas ist schiefgelaufen. Prüfen Sie Ihre Eingabe und versuchen Sie es erneut.",
    input: "Eingabe",
    output: "Ergebnis",
    settings: "Optionen",
    dropFiles: "Dateien hierher ziehen oder klicken zum Auswählen",
    dropFile: "Datei hierher ziehen oder klicken zum Auswählen",
    processing: "Verarbeitung…",
    fileSize: "Größe",
    sample: "Beispiel ausprobieren",
    uppercase: "GROSSBUCHSTABEN",
  },

  unit: {
    from: "Von",
    to: "Nach",
    amount: "Menge",
    result: "Ergebnis",
    common: "Häufige Umrechnungen",
    formula: "Formel",
    allUnits: "Alle Einheiten",
  },

  text: {
    stats: {
      words: "Wörter",
      characters: "Zeichen",
      charsNoSpaces: "Ohne Leerzeichen",
      sentences: "Sätze",
      paragraphs: "Absätze",
      lines: "Zeilen",
      readingTime: "Lesezeit",
      readingMinutes: "{n} Min. Lesezeit",
    },
  },

  footer: {
    line: "Regex-Werkzeuge, die Ihren Text respektieren: alles läuft im Browser, nichts wird hochgeladen.",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    about: "Über uns",
    badges: "Badges",
    language: "Sprache",
  },

  badge: {
    title: "RegExpresso-Badges",
    desc: "Setzen Sie einen RegExpresso-Badge auf Ihre Website, Ihr README oder Ihre Doku. Er verlinkt hierher und sagt: Die Regex-Werkzeuge dahinter laufen komplett im Browser.",
    voluntary: "Das Einbetten ist völlig freiwillig — nehmen Sie ein Badge, wenn Ihnen das Projekt gefällt. Keine Erlaubnis nötig.",
    md: "Markdown (README)",
    html: "HTML (Website)",
    thanks: "Danke für die Weiterempfehlung — jede Einbettung hilft mehr Menschen, Tools zu entdecken, die ihre Dateien respektieren.",
  },

    embed: {
    title: "Dieses Tool einbetten",
    desc: "Binden Sie dieses Tool mit einer Zeile in Ihre Website ein — es läuft im Browser des Besuchers.",
  },

    mcp: {
    title: "MCP-Server — KI-zugängliche Tools",
    desc1: "RegExpresso bringt einen MCP-Server (Model Context Protocol) mit: KI-Assistenten wie Claude oder Cursor können Regex mit derselben getesteten Logik wie auf dieser Seite testen, erklären und ersetzen – keine Neuimplementierung.",
    desc2: "Die Werkzeuge führen die reinen Funktionen der Seite aus (Regex-Ausführung, Tokenisierung, ReDoS-Prüfung und die Musterbibliothek). Sie laufen per npx auf dem Rechner des KI-Clients – nichts erreicht unsere Server.",
    toolsTitle: "Ausführbare Tools ({n})",
    requiresNode: "Benötigt Node.js 18+. Der Server läuft lokal über stdio; nur die von Ihnen aufgerufenen Tools werden auf Ihrer Maschine berechnet.",
    privacy: "Benötigt Node.js 18+. Der Server läuft lokal über stdio; nur die von Ihnen aufgerufenen Tools werden auf Ihrer Maschine berechnet.",
  },

    notFound: {
    title: "Seite nicht gefunden",
    body: "Das gesuchte Tool existiert nicht. Sehen Sie sich stattdessen alle Tools an.",
    home: "Zur Startseite",
  },
};

export default de;
