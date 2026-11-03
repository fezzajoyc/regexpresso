import type { Dictionary } from "../i18n";

const zh: Dictionary = {
  brand: "RegExpresso",
  tagline: "正则表达式,在浏览器里测试、读懂。",
  metaDesc:
    "用 15 种语言测试、解释、替换正则表达式:实时匹配高亮的正则测试器、大白话解释器、30 条复制即用的配方——全部在浏览器本地运行。",

  nav: {
    tools: "全部工具",
    categories: "分类",
    about: "关于",
    menu: "菜单",
    language: "语言",
  },

  home: {
    heroTitle: "正则表达式,用你的语言解释明白",
    heroSub:
      "实时测试模式、逐段读懂含义、从 30 条久经考验的配方里直接借用。15 种语言的正则工具——全部本地运行,免注册、不上传。",
    browseAll: "浏览全部工具",
    pinned: "置顶",
    pin: "置顶到首页",
    unpin: "取消置顶",
    popular: "大家都在用",
    categoriesTitle: "分类",
    featuredTitle: "热门工具",
    trustLocal: "文本留在你的设备上",
    trustFree: "免费,无需账号",
    trustFast: "即开即用,离线可用",
    rotating: [
      "粘贴一个模式,看着每一处匹配随输入实时点亮",
      "把任意正则读成大白话——用你的语言,而不只是英语",
      "30 条久经考验的配方:邮箱、IPv4、日期、十六进制颜色、密码",
      "危险模式进入代码库之前,先收到 ReDoS 警示",
    ],
    statsLabels: { tools: "工具", languages: "语言", uploads: "上传", accounts: "账号" },
    eyebrow: "永久免费",
    heroCtaSecondary: "了解工作方式",
    statsTools: "{n} 个工具",
    statsLanguages: "{n} 种语言",
    statsUploads: "0 次上传",
    statsAccounts: "0 个账号",
    categoriesSub: "一个专注的家:测试、解释、替换、借用正则表达式。",
    popularSub: "大家最常用的工具。",
    privacyTitle: "你的文件,从不离开你的设备。",
    privacySub: "这里没有“上传”这个步骤——工具就是运行在你浏览器里的 JavaScript。这不是政策承诺,而是构造方式。",
    privacyPoint1T: "本地处理",
    privacyPoint1D: "模式和测试文本由 JavaScript 在你设备的内存里处理,不对外传输。",
    privacyPoint2T: "没有账号",
    privacyPoint2D: "无需注册、不要邮箱、不留历史,打开即用。",
    privacyPoint3T: "诚实设计",
    privacyPoint3D: "浏览器做不到的事,我们直说,而不是假装做到。",
    privacyLink: "阅读完整隐私说明",
    endTitle: "挑一个工具,打开就能用。",
    endSub: "15 种语言,0 次上传,无需安装。",
  },

  tools: {
    title: "全部工具",
    subtitle: "搜索 {count} 个免费浏览器工具。无需上传,无需注册。",
    filterPlaceholder: "搜索工具…",
    count: "{count} 个工具",
    empty: "没有匹配“{query}”的工具。",
  },

  categories: {
    pdf: { name: "PDF", desc: "合并、拆分、转换、编辑 PDF,全程无需上传到任何服务器。" },
    image: { name: "图片", desc: "压缩、缩放、裁剪、格式转换,直接在浏览器里完成。" },
    text: { name: "文本", desc: "统计、清洗、排序、变换,边输入边出结果。" },
    developer: { name: "正则", desc: "实时测试、解释、替换和复用正则表达式——本地运行,15 种语言。" },
    seo: { name: "SEO", desc: "Meta 标签、结构化数据、SERP 预览等页面级 SEO 助手。" },
    security: { name: "安全", desc: "密码、哈希与查询——都在你的设备上生成与校验。" },
    utility: { name: "实用工具", desc: "单位换算、计算器与日常小工具。" },
  },

  tool: {
    howTo: "使用方法",
    faq: "常见问题",
    related: "相关工具",
    nextStep: "下一步",
    copyLink: "复制链接",
    privacyNote:
      "该工具完全在你的浏览器中运行,数据不会离开你的设备,不会上传到任何服务器。",
    inCategory: "{category}分类下的更多工具",
    backToCategory: "全部{category}工具",
  },

  common: {
    openTool: "打开工具",
    copy: "复制",
    copied: "已复制",
    download: "下载",
    reset: "重置",
    swap: "交换",
    clear: "清空",
    error: "出错了,请检查输入后重试。",
    input: "输入",
    output: "结果",
    settings: "选项",
    dropFiles: "拖拽文件到此处,或点击选择",
    dropFile: "拖拽文件到此处,或点击选择",
    processing: "处理中…",
    fileSize: "大小",
    sample: "试个例子",
    uppercase: "大写",
  },

  unit: {
    from: "从",
    to: "到",
    amount: "数值",
    result: "结果",
    common: "常用换算",
    formula: "公式",
    allUnits: "全部单位",
  },

  text: {
    stats: {
      words: "词数",
      characters: "字符数",
      charsNoSpaces: "不含空格",
      sentences: "句数",
      paragraphs: "段落数",
      lines: "行数",
      readingTime: "阅读时长",
      readingMinutes: "约 {n} 分钟",
    },
  },

  footer: {
    line: "尊重你文本的正则工具:一切都在浏览器里运行,没有任何上传。",
    privacy: "隐私",
    terms: "条款",
    about: "关于",
    badges: "徽章",
    language: "语言",
  },

  badge: {
    title: "RegExpresso 徽章",
    desc: "把 RegExpresso 徽章放到你的网站、README 或文档里。它链接回本站,并告诉别人:它背后的正则工具完全在浏览器里运行。",
    voluntary: "嵌入完全出于自愿——喜欢这个项目就挑一枚,无需申请授权。",
    md: "Markdown(README)",
    html: "HTML(网页)",
    thanks: "感谢帮忙传播——每一次嵌入,都让更多人发现尊重自己文件的工具。",
  },

    embed: {
    title: "嵌入这个工具",
    desc: "一行代码把工具放到你的网站——它在访客的浏览器里运行。",
  },

    mcp: {
    title: "MCP 服务器——AI 可调用的工具",
    desc1: "RegExpresso 提供 MCP(Model Context Protocol)服务器:Claude、Cursor 等 AI 助手可以直接测试、解释、替换正则表达式——用的是与本站相同的经过测试的逻辑,不是重新实现。",
    desc2: "这些工具运行本站的纯函数(正则执行、分词解释、ReDoS 检查、配方库)。通过 npx 在 AI 客户端所在的机器上执行——不会发送到我们的服务器。",
    toolsTitle: "可执行工具({n} 个)",
    requiresNode: "需要 Node.js 18+。服务器通过 stdio 在本地运行;只有你发起的工具调用会在本机计算。",
    privacy: "需要 Node.js 18+。服务器通过 stdio 在本地运行;只有你发起的工具调用会在本机计算。",
  },

    notFound: {
    title: "页面不存在",
    body: "你要找的工具不存在,去看看全部工具吧。",
    home: "回到首页",
  },
};

export default zh;
