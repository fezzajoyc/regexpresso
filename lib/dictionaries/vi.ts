// vi — từ điển tiếng Việt. Hình dạng khóa phải khớp en chính xác (tests/seo.test.ts).
// Giữ nguyên "RegExpresso", các placeholder {n}/{count}/{query}/{category} và token kỹ thuật.
const vi = {
  brand: "RegExpresso",
  tagline: "Biểu thức chính quy, kiểm thử và giải thích ngay trong trình duyệt.",
  metaDesc:
    "Kiểm thử, giải thích và thay thế biểu thức chính quy bằng 15 ngôn ngữ: trình kiểm tra trực tiếp có tô sáng, trình giải thích bằng từ ngữ đơn giản và 30 mẫu sẵn sàng sao chép. Tất cả chạy trong trình duyệt.",

  nav: {
    tools: "Tất cả công cụ",
    categories: "Danh mục",
    about: "Giới thiệu",
    menu: "Menu",
    language: "Ngôn ngữ",
  },

  home: {
    heroTitle: "Biểu thức chính quy, được giải thích bằng ngôn ngữ của bạn",
    heroSub:
      "Kiểm thử mẫu trực tiếp, đọc chúng bằng lời đơn giản và mượn 30 công thức đã kiểm chứng. Công cụ regex bằng 15 ngôn ngữ — tất cả chạy cục bộ trong trình duyệt, không đăng ký, không tải lên.",
    browseAll: "Xem tất cả công cụ",
    pinned: "Đã ghim",
    pin: "Ghim lên đầu",
    unpin: "Bỏ ghim",
    popular: "Phổ biến ngay bây giờ",
    categoriesTitle: "Danh mục",
    featuredTitle: "Công cụ phổ biến",
    trustLocal: "Văn bản ở lại trên thiết bị của bạn",
    trustFree: "Miễn phí, không cần tài khoản",
    trustFast: "Tức thì, dùng được cả khi offline",
    rotating: [
      "Dán một mẫu và xem từng kết quả khớp sáng lên khi bạn gõ",
      "Đọc bất kỳ regex nào bằng lời đơn giản — bằng ngôn ngữ của bạn, không chỉ tiếng Anh",
      "Ba mươi công thức đã kiểm chứng: email, IPv4, ngày tháng, màu hex, mật khẩu",
      "Cảnh báo ReDoS trước khi mẫu rủi ro vào đến mã của bạn",
    ],
    statsLabels: { tools: "công cụ", languages: "ngôn ngữ", uploads: "lượt tải lên", accounts: "tài khoản" },
    eyebrow: "Miễn phí mãi mãi",
    heroCtaSecondary: "Cách hoạt động",
    statsTools: "{n} công cụ",
    statsLanguages: "{n} ngôn ngữ",
    statsUploads: "0 lượt tải lên",
    statsAccounts: "0 tài khoản",
    categoriesSub: "Một họ công cụ tập trung: kiểm thử, giải thích, thay thế và mượn biểu thức chính quy.",
    popularSub: "Những công cụ được mở nhiều nhất.",
    privacyTitle: "File của bạn không bao giờ rời khỏi thiết bị.",
    privacySub:
      "Không có bước tải lên. Các công cụ là JavaScript chạy trong trình duyệt của bạn — đó không phải lời hứa về chính sách, mà là cách chúng được xây dựng.",
    privacyPoint1T: "Xử lý cục bộ",
    privacyPoint1D: "Mẫu và văn bản kiểm thử được JavaScript xử lý trong bộ nhớ thiết bị của bạn. Không gửi đi đâu cả.",
    privacyPoint2T: "Không cần tài khoản",
    privacyPoint2D: "Không đăng ký, không email, không lưu lịch sử. Mở công cụ lên và dùng ngay.",
    privacyPoint3T: "Trung thực từ thiết kế",
    privacyPoint3D:
      "Nếu có gì đó thực sự không thể làm trong trình duyệt, chúng tôi nói thẳng thay vì giả vờ được.",
    privacyLink: "Đọc ghi chú riêng tư đầy đủ",
    endTitle: "Chọn một công cụ. Nó chỉ đơn giản là hoạt động.",
    endSub: "15 ngôn ngữ, không tải lên, không cần cài đặt.",
  },

  tools: {
    title: "Tất cả công cụ",
    subtitle: "Tìm kiếm trong {count} công cụ trình duyệt miễn phí. Không tải lên, không đăng ký.",
    filterPlaceholder: "Tìm công cụ…",
    count: "{count} công cụ",
    empty: "Không có công cụ nào khớp với “{query}”.",
  },

  categories: {
    pdf: { name: "PDF", desc: "Gộp, tách, chuyển đổi và chỉnh sửa file PDF mà không cần tải lên bất cứ đâu." },
    image: { name: "Ảnh", desc: "Nén, đổi kích thước, cắt và chuyển đổi ảnh ngay trong trình duyệt của bạn." },
    text: { name: "Văn bản", desc: "Đếm, làm sạch, sắp xếp và biến đổi văn bản tức thì khi bạn gõ." },
    developer: { name: "Regex", desc: "Kiểm thử, giải thích, thay thế và tái sử dụng biểu thức chính quy — trực tiếp, cục bộ và bằng 15 ngôn ngữ." },
    seo: { name: "SEO", desc: "Thẻ meta, dữ liệu có cấu trúc, xem trước SERP và các trợ thủ SEO trên trang." },
    security: { name: "Bảo mật", desc: "Mật khẩu, hàm băm và tra cứu — tạo và kiểm tra ngay trên thiết bị của bạn." },
    utility: { name: "Tiện ích", desc: "Bộ chuyển đổi đơn vị, máy tính và các trợ thủ hằng ngày." },
  },

  tool: {
    howTo: "Cách sử dụng",
    faq: "Câu hỏi thường gặp",
    related: "Công cụ liên quan",
    nextStep: "Bước tiếp theo",
    copyLink: "Sao chép liên kết",
    privacyNote:
      "Công cụ này chạy hoàn toàn trong trình duyệt của bạn. Dữ liệu không bao giờ rời khỏi thiết bị — không được tải lên bất kỳ máy chủ nào.",
    inCategory: "Xem thêm trong {category}",
    backToCategory: "Tất cả công cụ {category}",
  },

  common: {
    openTool: "Mở công cụ",
    copy: "Sao chép",
    copied: "Đã sao chép",
    download: "Tải xuống",
    reset: "Đặt lại",
    swap: "Đảo chiều",
    clear: "Xóa",
    error: "Đã xảy ra lỗi. Kiểm tra dữ liệu nhập và thử lại.",
    input: "Đầu vào",
    output: "Kết quả",
    settings: "Tùy chọn",
    dropFiles: "Kéo thả file vào đây hoặc bấm để chọn",
    dropFile: "Kéo thả file vào đây hoặc bấm để chọn",
    processing: "Đang xử lý…",
    fileSize: "Dung lượng",
    sample: "Dùng thử ví dụ",
    uppercase: "CHỮ IN HOA",
  },

  unit: {
    from: "Từ",
    to: "Sang",
    amount: "Số lượng",
    result: "Kết quả",
    common: "Chuyển đổi thường dùng",
    formula: "Công thức",
    allUnits: "Tất cả đơn vị",
  },

  text: {
    stats: {
      words: "Từ",
      characters: "Ký tự",
      charsNoSpaces: "Không khoảng trắng",
      sentences: "Câu",
      paragraphs: "Đoạn",
      lines: "Dòng",
      readingTime: "Thời gian đọc",
      readingMinutes: "{n} phút đọc",
    },
  },

  footer: {
    line: "Công cụ regex tôn trọng văn bản của bạn: mọi thứ chạy trong trình duyệt, không tải lên gì cả.",
    privacy: "Quyền riêng tư",
    terms: "Điều khoản",
    about: "Giới thiệu",
    badges: "Huy hiệu",
    language: "Ngôn ngữ",
  },

  badge: {
    title: "Huy hiệu RegExpresso",
    desc: "Đặt huy hiệu RegExpresso lên trang, README hoặc tài liệu của bạn. Nó dẫn về đây và cho biết các công cụ regex phía sau chạy hoàn toàn trong trình duyệt.",
    voluntary: "Việc nhúng hoàn toàn tự nguyện — chọn một huy hiệu nếu bạn thích dự án này. Không cần xin phép ai.",
    md: "Markdown (README)",
    html: "HTML (trang web)",
    thanks: "Cảm ơn bạn đã lan tỏa — mỗi lượt nhúng giúp nhiều người hơn khám phá những công cụ tôn trọng file của họ.",
  },

  embed: {
    title: "Nhúng công cụ này",
    desc: "Đưa công cụ này vào trang của bạn bằng một dòng — nó chạy trong trình duyệt của khách.",
  },

    mcp: {
    title: "Máy chủ MCP — công cụ cho AI gọi trực tiếp",
    desc1: "RegExpresso kèm máy chủ MCP (Model Context Protocol): các trợ lý AI như Claude hay Cursor có thể kiểm thử, giải thích và thay thế biểu thức chính quy bằng chính logic đã kiểm nghiệm của trang này.",
    desc2: "Các công cụ chạy các hàm thuần của trang (thực thi regex, tách token, sàng lọc ReDoS và thư viện mẫu). Chúng chạy qua npx trên máy của ứng dụng AI — không gửi gì đến máy chủ của chúng tôi.",
    toolsTitle: "Công cụ chạy được ({n})",
    requiresNode: "Cần Node.js 18+. Máy chủ chạy cục bộ qua stdio; chỉ các lệnh bạn gọi được tính trên máy của bạn.",
    privacy: "Cần Node.js 18+. Máy chủ chạy cục bộ qua stdio; chỉ các lệnh bạn gọi được tính trên máy của bạn.",
  },

    notFound: {
    title: "Không tìm thấy trang",
    body: "Công cụ bạn tìm không tồn tại. Hãy xem tất cả công cụ thay thế.",
    home: "Về trang chủ",
  },
};

export default vi;
