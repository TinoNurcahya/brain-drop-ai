import type { Locale } from "./landing-i18n";

export interface WaltonChapterMeta {
  id: string;
  num: string;
  title: string;
}

export interface PortalCurtainItem {
  id: "local" | "speed" | "privacy";
  badge: string;
  statPre: string;
  statItalic: string;
  statPost: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
}

export interface SplitPortraitSide {
  statPre: string;
  statItalic: string;
  statPost: string;
  body: string;
}

export interface SquareDataCardItem {
  id: "notes" | "recall" | "pii";
  badge: string;
  statPre: string;
  statItalic: string;
  statPost: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  align: "left" | "right";
}

export interface VaultRoomItem {
  id: "capture" | "notes" | "graph" | "flashcards" | "dashboard";
  index: string;
  label: string;
  title: string;
  locationLine: string;
  tierLabel: string;
  synopsis: string;
  specALabel: string;
  specAValue: string;
  specBLabel: string;
  specBValue: string;
  imageSrc: string;
  imageAlt: string;
  studyCaption: string;
  route: string;
  cta: string;
}

export interface ObsidianPillar {
  title: string;
  body: string;
}

export interface RedactionPreset {
  id: string;
  label: string;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface WaltonCopy {
  hud: {
    skip: string;
    menuLabel: string;
    closeLabel: string;
    langAria: string;
    contextCta: string;
    chaptersHeading: string;
    workspaceHeading: string;
    chapters: WaltonChapterMeta[];
    workspaceLinks: { label: string; href: string }[];
  };
  hero: {
    lines: [string, string, string, string];
    lead: string;
    cta: string;
    scrollNote: string;
  };
  thesis: {
    index: string;
    leadA: string;
    leadItalic: string;
    leadB: string;
    sub: string;
  };
  portal: {
    index: string;
    questionPre: string;
    questionItalic: string;
    questionPost: string;
    bridgeLead: string;
    bridgeHighlight: string;
    bridgeTail: string;
    curtains: [PortalCurtainItem, PortalCurtainItem, PortalCurtainItem];
  };
  whisper: {
    line: string;
  };
  splitPortrait: {
    index: string;
    headingPre: string;
    headingItalic: string;
    headingPost: string;
    left: SplitPortraitSide;
    right: SplitPortraitSide;
    firstImg: string;
    firstAlt: string;
    secondImg: string;
    secondAlt: string;
  };
  cards: {
    index: string;
    headingPre: string;
    headingItalic: string;
    headingPost: string;
    items: [SquareDataCardItem, SquareDataCardItem, SquareDataCardItem];
  };
  vault: {
    index: string;
    headingPre: string;
    headingItalic: string;
    headingPost: string;
    sub: string;
    liveMode: string;
    studyMode: string;
    expandLabel: string;
    closeLabel: string;
    prevLabel: string;
    nextLabel: string;
    rooms: VaultRoomItem[];
  };
  hybrid: {
    index: string;
    lead: string;
    pillars: [ObsidianPillar, ObsidianPillar, ObsidianPillar];
    cta: string;
    filmCaptions: [string, string, string, string];
    privacyHeading: string;
    privacySub: string;
    beforeLabel: string;
    afterLabel: string;
    textareaLabel: string;
    maskedSuffix: string;
    clearLabel: string;
    presets: RedactionPreset[];
  };
  manifesto: {
    index: string;
    quoteLines: { text: string; italicWord?: string }[];
    attribution: string;
    faqIndex: string;
    faqHeading: string;
    extensionCta: string;
    faqs: FaqItem[];
  };
  footer: {
    heading: string;
    sub: string;
    primaryCta: string;
    secondaryCta: string;
    colWorkspace: string;
    colChapters: string;
    copyright: string;
    backToTop: string;
  };
}

export const WALTON_COPY: Record<Locale, WaltonCopy> = {
  en: {
    hud: {
      skip: "Skip to content",
      menuLabel: "Menu",
      closeLabel: "Close",
      langAria: "Switch language to Indonesian",
      contextCta: "Open BrainDrop",
      chaptersHeading: "Chapters",
      workspaceHeading: "Live Workspace",
      chapters: [
        { id: "ch-hero", num: "01", title: "Where Ideas Take Root" },
        { id: "ch-portal", num: "02", title: "Inside Browser Memory" },
        { id: "ch-split", num: "03", title: "Local vs. Cloud Speed" },
        { id: "ch-proof", num: "04", title: "Measured Proof" },
        { id: "ch-vault", num: "05", title: "The Five-Room Vault" },
        { id: "ch-hybrid", num: "06", title: "Hybrid Architecture & Privacy" },
        { id: "ch-manifesto", num: "07", title: "Retention Manifesto" },
        { id: "ch-faq", num: "08", title: "Questions & Extension" },
      ],
      workspaceLinks: [
        { label: "Capture", href: "/capture" },
        { label: "Notes", href: "/notes" },
        { label: "Knowledge Graph", href: "/graph" },
        { label: "Flashcards", href: "/flashcards" },
        { label: "Dashboard", href: "/dashboard" },
      ],
    },
    hero: {
      lines: ["WHERE", "IDEAS", "TAKE", "ROOT"],
      lead: "An on-device second brain powered by Chrome Gemini Nano 4 and IndexedDB — keeping your raw thinking local while connecting what matters.",
      cta: "Open BrainDrop",
      scrollNote: "Scroll to trace a thought",
    },
    thesis: {
      index: "[ 01 ]",
      leadA: "Every day we gather dozens of tabs, sharp passages, and half-formed hypotheses — yet most tools force a trade-off between ",
      leadItalic: "privacy",
      leadB: " and intelligence.",
      sub: "BrainDrop anchors every web clip, manuscript note, and semantic connection directly on your machine first, reaching out to Gemini 3.8 Flash only after sensitive fields are scrubbed locally.",
    },
    portal: {
      index: "[ 02 ]",
      questionPre: "What happens to everything you ",
      questionItalic: "read",
      questionPost: " today?",
      bridgeLead: "Across hundreds of clipped passages, research notes, and study cards, our ",
      bridgeHighlight: "Hybrid Telemetry",
      bridgeTail: " tracks exactly how much thinking stays private on your own hardware.",
      curtains: [
        {
          id: "local",
          badge: "88% local",
          statPre: "88%",
          statItalic: "of",
          statPost: "daily thinking",
          body: "Routine tagging, summarizing, and note matching happen inside browser memory with zero network round-trips.",
          imageSrc: "/images/preview-graph.jpg",
          imageAlt: "Spatial carbon nodes linked by optical glass rods",
        },
        {
          id: "speed",
          badge: "38 ms",
          statPre: "38ms",
          statItalic: "on",
          statPost: "your device",
          body: "Chrome Built-in Gemini Nano 4 executes directly on WebGPU and releases memory cleanly inside a finally block.",
          imageSrc: "/images/preview-capture.jpg",
          imageAlt: "Optical loupe resting on annotated cotton paper",
        },
        {
          id: "privacy",
          badge: "0 B leaked",
          statPre: "Zero",
          statItalic: "unmasked",
          statPost: "bytes",
          body: "Before any multi-note synthesis reaches the cloud, six classes of personal identifiers and API keys are masked locally.",
          imageSrc: "/images/hybrid-overview.jpg",
          imageAlt: "Optical prism and drafting straightedge on linen surface",
        },
      ],
    },
    whisper: {
      line: "Let’s go deeper into how a fleeting highlight becomes durable memory…",
    },
    splitPortrait: {
      index: "[ 03 ]",
      headingPre: "Speed that feels like ",
      headingItalic: "paper,",
      headingPost: " backed by local silicon.",
      left: {
        statPre: "12ms",
        statItalic: "to",
        statPost: "anchor a clip",
        body: "One click from the Chrome MV3 extension writes your highlighted quote, title, and origin URL straight into IndexedDB offline.",
      },
      right: {
        statPre: "16×",
        statItalic: "faster",
        statPost: "on device",
        body: "Local Gemini Nano 4 answers in ~38ms compared with ~680ms cloud round-trips — keeping your reading flow unbroken.",
      },
      firstImg: "/images/preview-capture.jpg",
      firstAlt: "Optical loupe inspecting ruled cotton archival stock",
      secondImg: "/images/preview-notes.jpg",
      secondAlt: "Fountain pen beside optical glass straightedge on manuscript paper",
    },
    cards: {
      index: "[ 04 ]",
      headingPre: "Quiet precision at every ",
      headingItalic: "step",
      headingPost: " of research.",
      items: [
        {
          id: "notes",
          badge: "45 ms",
          statPre: "3 tags",
          statItalic: "in",
          statPost: "45 milliseconds",
          body: "On-device triage extracts clean topic tags and crisp summaries inside a distraction-free Tiptap manuscript.",
          imageSrc: "/images/preview-notes.jpg",
          imageAlt: "Matte black fountain pen and optical glass ruler on lined paper",
          align: "left",
        },
        {
          id: "recall",
          badge: "1 · 3 · 7 d",
          statPre: "3 boxes",
          statItalic: "of",
          statPost: "spaced recall",
          body: "Leitner review cards resurface essential arguments at 1-day, 3-day, and 7-day intervals right before they fade.",
          imageSrc: "/images/preview-flashcards.jpg",
          imageAlt: "Linen index card box with divider tab",
          align: "right",
        },
        {
          id: "pii",
          badge: "< 2 ms",
          statPre: "6 classes",
          statItalic: "of",
          statPost: "sensitive data",
          body: "Emails, phone numbers, payment cards, national IDs, IP addresses, and API secrets are redacted deterministically.",
          imageSrc: "/images/preview-dashboard.jpg",
          imageAlt: "Tactile rotary telemetry gauge and level bars",
          align: "left",
        },
      ],
    },
    vault: {
      index: "[ 05 ]",
      headingPre: "Step inside the ",
      headingItalic: "five-room",
      headingPost: " vault.",
      sub: "Test every live instrument directly below, or switch to inspect its physical atelier study.",
      liveMode: "Live Instrument",
      studyMode: "Atelier Study",
      expandLabel: "Expand",
      closeLabel: "Close",
      prevLabel: "Previous room",
      nextLabel: "Next room",
      rooms: [
        {
          id: "capture",
          index: "01",
          label: "Capture",
          title: "The Clipper Desk",
          locationLine: "Chrome MV3 Extension · IndexedDB",
          tierLabel: "On-Device",
          synopsis:
            "Save highlighted web passages, URLs, and voice thoughts with exact source provenance stored offline.",
          specALabel: "Storage",
          specAValue: "100% IndexedDB",
          specBLabel: "Egress",
          specBValue: "0 Bytes",
          imageSrc: "/images/preview-capture.jpg",
          imageAlt: "Optical loupe over annotated archival paper",
          studyCaption: "Study 01 — Optical loupe on ruled cotton stock",
          route: "/capture",
          cta: "Open Capture",
        },
        {
          id: "notes",
          index: "02",
          label: "Notes",
          title: "The Manuscript Canvas",
          locationLine: "Tiptap Editor · Gemini Nano 4",
          tierLabel: "On-Device",
          synopsis:
            "A calm writing surface where local WebGPU inference generates summaries, simplifications, and links in 38 ms.",
          specALabel: "Latency",
          specAValue: "38 ms Local",
          specBLabel: "Egress",
          specBValue: "0 Bytes",
          imageSrc: "/images/preview-notes.jpg",
          imageAlt: "Fountain pen and glass straightedge on paper",
          studyCaption: "Study 02 — Fountain pen & optical straightedge",
          route: "/notes",
          cta: "Open Notes",
        },
        {
          id: "graph",
          index: "03",
          label: "Graph",
          title: "The Constellation Map",
          locationLine: "Force-Directed Canvas · Browser Memory",
          tierLabel: "On-Device",
          synopsis:
            "Semantic similarity matching connects related notes at 60 fps in memory without uploading your personal index.",
          specALabel: "Matching",
          specAValue: "30 ms · 60 fps",
          specBLabel: "Egress",
          specBValue: "0 Bytes",
          imageSrc: "/images/preview-graph.jpg",
          imageAlt: "Sculptural node and rod linkage model",
          studyCaption: "Study 03 — Spatial node-and-rod linkage study",
          route: "/graph",
          cta: "Open Graph",
        },
        {
          id: "flashcards",
          index: "04",
          label: "Flashcards",
          title: "The Leitner Recall Deck",
          locationLine: "3-Box Spaced Review · Sanitized Flash",
          tierLabel: "Sanitized Cloud",
          synopsis:
            "Turn sanitized notes into 3D active-recall cards scheduled across 1-day, 3-day, and 7-day mastery intervals.",
          specALabel: "Retention",
          specAValue: "3-Box Leitner",
          specBLabel: "Payload",
          specBValue: "Redacted Only",
          imageSrc: "/images/preview-flashcards.jpg",
          imageAlt: "Linen index card box",
          studyCaption: "Study 04 — Three-interval linen card tray",
          route: "/flashcards",
          cta: "Open Flashcards",
        },
        {
          id: "dashboard",
          index: "05",
          label: "Dashboard",
          title: "The Telemetry Ledger",
          locationLine: "Live Audit Log · @braindrop/core",
          tierLabel: "Sanitized Cloud",
          synopsis:
            "Inspect local-versus-cloud routing ratios, kilobytes kept on-device, and every redaction event in real time.",
          specALabel: "Sanitizer",
          specAValue: "< 2 ms · 6 Classes",
          specBLabel: "Audit",
          specBValue: "Real-Time",
          imageSrc: "/images/preview-dashboard.jpg",
          imageAlt: "Rotary telemetry gauge",
          studyCaption: "Study 05 — Tactile telemetry ratio scale",
          route: "/dashboard",
          cta: "Open Dashboard",
        },
      ],
    },
    hybrid: {
      index: "[ 06 ]",
      lead: "We combine local WebGPU speed with sanitized cloud synthesis so your vault stays sovereign. Our hybrid router guarantees:",
      pillars: [
        {
          title: "Local by default",
          body: "Every clip, draft, graph edge, and review score lives inside IndexedDB on your own machine with zero account wall.",
        },
        {
          title: "Deterministic client redaction",
          body: "Before any cloud request leaves Chrome, @braindrop/core strips emails, secrets, phones, cards, IDs, and IPs in under 2 ms.",
        },
        {
          title: "Synthesis on demand",
          body: "Gemini 3.8 Flash via Firebase AI Logic is invoked strictly when you ask to synthesize multiple redacted notes into a brief.",
        },
      ],
      cta: "Launch Workspace",
      filmCaptions: [
        "01 · Local IndexedDB provenance",
        "02 · Calm Tiptap manuscript",
        "03 · 60 fps in-memory topology",
        "04 · Hybrid local-cloud split",
      ],
      privacyHeading: "Test the local redaction gate live.",
      privacySub:
        "Edit any text below. Sensitive fields are replaced instantaneously inside your browser before Gemini 3.8 Flash ever sees the payload.",
      beforeLabel: "Raw draft in browser",
      afterLabel: "Sanitized payload for cloud",
      textareaLabel: "Draft text to sanitize locally",
      maskedSuffix: "fields masked · < 2 ms",
      clearLabel: "0 fields masked · clean",
      presets: [
        {
          id: "contact",
          label: "Contact Draft",
          text: "Email sara.chen@example.com or call +6281234567890 before Friday regarding the Q3 research grant.",
        },
        {
          id: "secret",
          label: "API Secret",
          text: "Rotate staging secret=sk-proj-8a9b2c4d6e8f0a1b2c3d4e5f6a7b8c9d and verify webhook access from 192.168.1.44.",
        },
        {
          id: "billing",
          label: "Receipt Note",
          text: "Archive card 4532-8910-2234-9901 billed to alex@example.org for the conference travel claim.",
        },
      ],
    },
    manifesto: {
      index: "[ 07 ]",
      quoteLines: [
        { text: "IT IS NOT WHAT" },
        { text: "YOU BOOKMARK", italicWord: "BOOKMARK" },
        { text: "IN TABS," },
        { text: "IT’S WHAT YOU" },
        { text: "CONNECT", italicWord: "CONNECT" },
        { text: "AND RETAIN" },
        { text: "THAT SHAPES HOW" },
        { text: "CLEARLY YOU THINK." },
      ],
      attribution: "BrainDrop AI — Local-First Knowledge Architecture",
      faqIndex: "[ 08 ]",
      faqHeading: "Questions, answered plainly.",
      extensionCta: "Download Chrome MV3 Clipper (.zip)",
      faqs: [
        {
          q: "Does BrainDrop upload my notes to a server automatically?",
          a: "No. All notes, web clips, graph edges, and flashcards remain in IndexedDB inside your browser. Everyday tagging, summarizing, and searching run locally via Chrome Built-in Gemini Nano 4 with 0 bytes uploaded.",
        },
        {
          q: "What happens when I request a cross-note synthesis in the cloud?",
          a: "Before any request reaches Gemini 3.8 Flash, @braindrop/core runs a deterministic client-side sanitizer in under 2 milliseconds to replace emails, phone numbers, credit cards, national IDs, IP addresses, and API secrets with [REDACTED_*] tokens.",
        },
        {
          q: "What if my browser does not have Chrome Built-in AI enabled yet?",
          a: "BrainDrop falls back automatically to a deterministic Simulation Mode so you can explore Capture, Notes, Graph, Flashcards, and Dashboard seamlessly on any modern desktop or mobile browser.",
        },
        {
          q: "How do I install the Chrome MV3 Web Clipper extension?",
          a: "Download the open-source .zip package from this page, extract it, open chrome://extensions, enable Developer Mode, and click Load Unpacked on the extracted folder.",
        },
      ],
    },
    footer: {
      heading: "Ready to give your reading a permanent home?",
      sub: "No sign-up wall, no cloud lock-in, and Apache 2.0 open source.",
      primaryCta: "Open BrainDrop",
      secondaryCta: "Get Extension (.zip)",
      colWorkspace: "Workspace",
      colChapters: "Chapters",
      copyright: "© 2026 BrainDrop AI · Apache 2.0 · Built for #BuildHybridAI",
      backToTop: "Back to top",
    },
  },
  id: {
    hud: {
      skip: "Lompat ke konten",
      menuLabel: "Menu",
      closeLabel: "Tutup",
      langAria: "Ganti bahasa ke Inggris",
      contextCta: "Buka BrainDrop",
      chaptersHeading: "Bab Cerita",
      workspaceHeading: "Workspace Aktif",
      chapters: [
        { id: "ch-hero", num: "01", title: "Tempat Gagasan Tumbuh" },
        { id: "ch-portal", num: "02", title: "Di Memori Browser" },
        { id: "ch-split", num: "03", title: "Kecepatan Lokal vs Cloud" },
        { id: "ch-proof", num: "04", title: "Bukti Terukur" },
        { id: "ch-vault", num: "05", title: "Vault Lima Ruang" },
        { id: "ch-hybrid", num: "06", title: "Arsitektur Hibrida & Privasi" },
        { id: "ch-manifesto", num: "07", title: "Manifesto Ingatan" },
        { id: "ch-faq", num: "08", title: "Pertanyaan & Ekstensi" },
      ],
      workspaceLinks: [
        { label: "Capture", href: "/capture" },
        { label: "Notes", href: "/notes" },
        { label: "Knowledge Graph", href: "/graph" },
        { label: "Flashcards", href: "/flashcards" },
        { label: "Dashboard", href: "/dashboard" },
      ],
    },
    hero: {
      lines: ["TEMPAT", "GAGASAN", "TUMBUH", "UTUH"],
      lead: "Otak kedua di perangkat berbasis Chrome Gemini Nano 4 dan IndexedDB — menjaga draf pribadimu tetap lokal sembari menautkan hal-hal penting.",
      cta: "Buka BrainDrop",
      scrollNote: "Gulir untuk menelusuri alur ide",
    },
    thesis: {
      index: "[ 01 ]",
      leadA: "Setiap hari kita menumpuk puluhan tab, kutipan tajam, dan draf mentah — namun kebanyakan aplikasi memaksa kita memilih antara ",
      leadItalic: "privasi",
      leadB: " atau kecerdasan.",
      sub: "BrainDrop menambatkan setiap klip web, manuskrip, dan tautan semantik langsung di perangkatmu lebih dulu, dan baru memanggil Gemini 3.8 Flash setelah data sensitif disensor secara lokal.",
    },
    portal: {
      index: "[ 02 ]",
      questionPre: "Apa yang terjadi pada semua yang kamu ",
      questionItalic: "baca",
      questionPost: " hari ini?",
      bridgeLead: "Dari ratusan sorotan artikel, draf riset, dan kartu belajar, sistem ",
      bridgeHighlight: "Telemetri Hibrida",
      bridgeTail: " kami mencatat persis seberapa banyak proses berpikir yang tetap privat di perangkatmu.",
      curtains: [
        {
          id: "local",
          badge: "88% lokal",
          statPre: "88%",
          statItalic: "dari",
          statPost: "proses berpikir",
          body: "Penandaan topik, ringkasan, dan pencocokan catatan berjalan di memori browser tanpa bolak-balik server.",
          imageSrc: "/images/preview-graph.jpg",
          imageAlt: "Simpul karbon terhubung batang kaca optik",
        },
        {
          id: "speed",
          badge: "38 ms",
          statPre: "38ms",
          statItalic: "di",
          statPost: "perangkatmu",
          body: "Chrome Built-in Gemini Nano 4 berjalan langsung di WebGPU dan melepas memori secara bersih di blok finally.",
          imageSrc: "/images/preview-capture.jpg",
          imageAlt: "Lensa loupe optik di atas kertas katun",
        },
        {
          id: "privacy",
          badge: "0 B bocor",
          statPre: "Nol",
          statItalic: "byte",
          statPost: "tanpa sensor",
          body: "Sebelum sintesis lintas-catatan menyentuh cloud, enam kelas identitas pribadi dan kunci API disensor lokal.",
          imageSrc: "/images/hybrid-overview.jpg",
          imageAlt: "Prisma kaca optik dan mistar gambar di atas linen",
        },
      ],
    },
    whisper: {
      line: "Mari selami lebih dalam bagaimana satu sorotan singkat tumbuh menjadi ingatan utuh…",
    },
    splitPortrait: {
      index: "[ 03 ]",
      headingPre: "Kecepatan serasa ",
      headingItalic: "kertas,",
      headingPost: " ditenagai silikon lokal.",
      left: {
        statPre: "12ms",
        statItalic: "untuk",
        statPost: "menyimpan klip",
        body: "Satu klik dari ekstensi Chrome MV3 menuliskan kutipan, judul halaman, dan URL asli langsung ke IndexedDB secara offline.",
      },
      right: {
        statPre: "16×",
        statItalic: "lebih cepat",
        statPost: "di perangkat",
        body: "Gemini Nano 4 lokal menjawab dalam ~38ms dibanding ~680ms bolak-balik cloud — menjaga fokus bacamu tidak terputus.",
      },
      firstImg: "/images/preview-capture.jpg",
      firstAlt: "Loupe optik memeriksa kertas katun arsip",
      secondImg: "/images/preview-notes.jpg",
      secondAlt: "Pena hitam di samping penggaris kaca optik di atas kertas manuskrip",
    },
    cards: {
      index: "[ 04 ]",
      headingPre: "Presisi tenang di setiap ",
      headingItalic: "tahap",
      headingPost: " risetmu.",
      items: [
        {
          id: "notes",
          badge: "45 ms",
          statPre: "3 tag",
          statItalic: "dalam",
          statPost: "45 milidetik",
          body: "Inferensi lokal mengekstrak tag topik dan ringkasan jernih di dalam editor Tiptap bebas gangguan.",
          imageSrc: "/images/preview-notes.jpg",
          imageAlt: "Pena hitam dan penggaris kaca optik di atas kertas bergaris",
          align: "left",
        },
        {
          id: "recall",
          badge: "1 · 3 · 7 h",
          statPre: "3 kotak",
          statItalic: "ulasan",
          statPost: "berkala",
          body: "Kartu ulasan Leitner memunculkan kembali konsep penting pada interval 1, 3, dan 7 hari tepat sebelum terlupa.",
          imageSrc: "/images/preview-flashcards.jpg",
          imageAlt: "Kotak kartu indeks linen",
          align: "right",
        },
        {
          id: "pii",
          badge: "< 2 ms",
          statPre: "6 kelas",
          statItalic: "data",
          statPost: "sensitif",
          body: "Email, nomor telepon, kartu pembayaran, NIK, alamat IP, dan kunci API disensor secara deterministik.",
          imageSrc: "/images/preview-dashboard.jpg",
          imageAlt: "Meter telemetri taktil dengan kenop putar",
          align: "left",
        },
      ],
    },
    vault: {
      index: "[ 05 ]",
      headingPre: "Masuki vault ",
      headingItalic: "lima ruang",
      headingPost: " secara langsung.",
      sub: "Uji setiap instrumen interaktif di bawah ini, atau beralih melihat studi material atelier-nya.",
      liveMode: "Instrumen Live",
      studyMode: "Studi Atelier",
      expandLabel: "Perluas",
      closeLabel: "Tutup",
      prevLabel: "Ruang sebelumnya",
      nextLabel: "Ruang berikutnya",
      rooms: [
        {
          id: "capture",
          index: "01",
          label: "Capture",
          title: "Meja Kliper",
          locationLine: "Ekstensi Chrome MV3 · IndexedDB",
          tierLabel: "Di Perangkat",
          synopsis:
            "Simpan sorotan web, URL, dan catatan suara lengkap dengan jejak sumber yang tersimpan offline.",
          specALabel: "Penyimpanan",
          specAValue: "100% IndexedDB",
          specBLabel: "Data Keluar",
          specBValue: "0 Byte",
          imageSrc: "/images/preview-capture.jpg",
          imageAlt: "Loupe optik di atas kertas arsip",
          studyCaption: "Studi 01 — Loupe optik di atas kertas katun",
          route: "/capture",
          cta: "Buka Capture",
        },
        {
          id: "notes",
          index: "02",
          label: "Notes",
          title: "Kanvas Manuskrip",
          locationLine: "Editor Tiptap · Gemini Nano 4",
          tierLabel: "Di Perangkat",
          synopsis:
            "Ruang tulis tenang tempat inferensi WebGPU menyusun ringkasan, penyederhanaan, dan tautan dalam 38 ms.",
          specALabel: "Latensi",
          specAValue: "38 ms Lokal",
          specBLabel: "Data Keluar",
          specBValue: "0 Byte",
          imageSrc: "/images/preview-notes.jpg",
          imageAlt: "Pena dan penggaris kaca di atas kertas",
          studyCaption: "Studi 02 — Pena & penggaris kaca optik",
          route: "/notes",
          cta: "Buka Notes",
        },
        {
          id: "graph",
          index: "03",
          label: "Graph",
          title: "Peta Konstelasi",
          locationLine: "Kanvas Fisika · Memori Browser",
          tierLabel: "Di Perangkat",
          synopsis:
            "Pencocokan semantik menautkan catatan terkait pada 60 fps di memori tanpa mengunggah indeks pribadimu.",
          specALabel: "Pencocokan",
          specAValue: "30 ms · 60 fps",
          specBLabel: "Data Keluar",
          specBValue: "0 Byte",
          imageSrc: "/images/preview-graph.jpg",
          imageAlt: "Model simpul dan batang kaca",
          studyCaption: "Studi 03 — Model spasial simpul & tautan",
          route: "/graph",
          cta: "Buka Graph",
        },
        {
          id: "flashcards",
          index: "04",
          label: "Flashcards",
          title: "Dek Ulasan Leitner",
          locationLine: "Ulasan 3 Kotak · Flash Tersensor",
          tierLabel: "Cloud Tersensor",
          synopsis:
            "Ubah catatan tersensor menjadi kartu belajar 3D terjadwal pada interval 1 hari, 3 hari, dan 7 hari.",
          specALabel: "Retensi",
          specAValue: "Leitner 3 Kotak",
          specBLabel: "Muatan",
          specBValue: "Hanya Tersensor",
          imageSrc: "/images/preview-flashcards.jpg",
          imageAlt: "Kotak kartu indeks linen",
          studyCaption: "Studi 04 — Kotak kartu indeks tiga interval",
          route: "/flashcards",
          cta: "Buka Flashcards",
        },
        {
          id: "dashboard",
          index: "05",
          label: "Dashboard",
          title: "Buku Besar Telemetri",
          locationLine: "Audit Langsung · @braindrop/core",
          tierLabel: "Cloud Tersensor",
          synopsis:
            "Pantau rasio rute lokal vs cloud, kilobyte yang tetap di perangkat, dan log waktu setiap sensor PII.",
          specALabel: "Sanitizer",
          specAValue: "< 2 ms · 6 Kelas",
          specBLabel: "Audit",
          specBValue: "Real-Time",
          imageSrc: "/images/preview-dashboard.jpg",
          imageAlt: "Meter telemetri putar",
          studyCaption: "Studi 05 — Skala rasio telemetri taktil",
          route: "/dashboard",
          cta: "Buka Dashboard",
        },
      ],
    },
    hybrid: {
      index: "[ 06 ]",
      lead: "Kami memadukan kecepatan WebGPU lokal dengan sintesis cloud tersensor agar vault-mu tetap berdaulat. Router hibrida kami menjamin:",
      pillars: [
        {
          title: "Lokal sejak awal",
          body: "Setiap klip, draf, tautan graf, dan skor ulasan tersimpan di IndexedDB perangkatmu sendiri tanpa paksaan membuat akun.",
        },
        {
          title: "Sensor klien deterministik",
          body: "Sebelum permintaan keluar dari Chrome, @braindrop/core menyensor email, kunci API, telepon, kartu, NIK, dan IP dalam < 2 ms.",
        },
        {
          title: "Sintesis saat diminta",
          body: "Gemini 3.8 Flash via Firebase AI Logic hanya dipanggil ketika kamu meminta rangkuman mendalam lintas catatan tersensor.",
        },
      ],
      cta: "Buka Workspace",
      filmCaptions: [
        "01 · Jejak sumber IndexedDB lokal",
        "02 · Manuskrip Tiptap tenang",
        "03 · Topologi memori 60 fps",
        "04 · Pembagian hibrida lokal-cloud",
      ],
      privacyHeading: "Uji gerbang penyensoran lokal sekarang.",
      privacySub:
        "Ubah teks apa pun di bawah ini. Data sensitif diganti seketika di dalam browsermu sebelum Gemini 3.8 Flash menerima muatannya.",
      beforeLabel: "Draf asli di browser",
      afterLabel: "Muatan tersensor ke cloud",
      textareaLabel: "Teks draf untuk disensor secara lokal",
      maskedSuffix: "bidang disensor · < 2 ms",
      clearLabel: "0 bidang disensor · bersih",
      presets: [
        {
          id: "contact",
          label: "Draf Kontak",
          text: "Kirim email ke sara.chen@example.com atau hubungi +6281234567890 sebelum Jumat soal hibah riset Q3.",
        },
        {
          id: "secret",
          label: "Kunci API",
          text: "Ganti kunci staging secret=sk-proj-8a9b2c4d6e8f0a1b2c3d4e5f6a7b8c9d dan cek akses webhook dari 192.168.1.44.",
        },
        {
          id: "billing",
          label: "Tanda Terima",
          text: "Arsipkan kartu 4532-8910-2234-9901 atas nama alex@example.org untuk klaim perjalanan konferensi.",
        },
      ],
    },
    manifesto: {
      index: "[ 07 ]",
      quoteLines: [
        { text: "BUKAN SEBERAPA" },
        { text: "BANYAK SIMPANAN", italicWord: "SIMPANAN" },
        { text: "DI TABMU," },
        { text: "MELAINKAN APA" },
        { text: "YANG TERHUBUNG", italicWord: "TERHUBUNG" },
        { text: "DAN DIINGAT" },
        { text: "YANG MENENTUKAN" },
        { text: "JERNIHNYA PIKIRANMU." },
      ],
      attribution: "BrainDrop AI — Arsitektur Pengetahuan Lokal-First",
      faqIndex: "[ 08 ]",
      faqHeading: "Pertanyaan yang sering diajukan.",
      extensionCta: "Unduh Kliper Chrome MV3 (.zip)",
      faqs: [
        {
          q: "Apakah BrainDrop otomatis mengunggah catatan saya ke server?",
          a: "Tidak. Seluruh catatan, klip web, tautan graf, dan flashcard tetap berada di IndexedDB dalam browsermu. Penandaan, ringkasan, dan pencarian harian berjalan lokal lewat Chrome Built-in Gemini Nano 4 dengan 0 byte terunggah.",
        },
        {
          q: "Apa yang terjadi saat saya meminta sintesis lintas-catatan di cloud?",
          a: "Sebelum permintaan menyentuh Gemini 3.8 Flash, @braindrop/core menjalankan sanitizer sisi klien dalam kurang dari 2 milidetik untuk mengganti email, nomor telepon, kartu kredit, NIK, alamat IP, dan kunci API menjadi token [REDACTED_*].",
        },
        {
          q: "Bagaimana jika browser saya belum mengaktifkan Chrome Built-in AI?",
          a: "BrainDrop otomatis beralih ke Simulation Mode deterministik agar kamu tetap bisa menjelajahi Capture, Notes, Graph, Flashcards, dan Dashboard dengan mulus di browser modern mana pun.",
        },
        {
          q: "Bagaimana cara memasang ekstensi Web Clipper Chrome MV3?",
          a: "Unduh paket .zip open-source dari halaman ini, ekstrak foldernya, buka chrome://extensions, aktifkan Developer Mode, lalu klik Load Unpacked pada folder hasil ekstrak.",
        },
      ],
    },
    footer: {
      heading: "Siap memberi rumah permanen bagi seluruh bacaanmu?",
      sub: "Tanpa paksaan daftar akun, tanpa terkunci cloud, dan open-source Apache 2.0.",
      primaryCta: "Buka BrainDrop",
      secondaryCta: "Unduh Ekstensi (.zip)",
      colWorkspace: "Workspace",
      colChapters: "Bab",
      copyright: "© 2026 BrainDrop AI · Apache 2.0 · Dibangun untuk #BuildHybridAI",
      backToTop: "Kembali ke atas",
    },
  },
};
