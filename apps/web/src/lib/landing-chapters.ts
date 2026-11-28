import type { Locale } from "./landing-i18n";

export interface ThreadStationCopy {
  step: string;
  label: string;
}

export interface HybridRouteRow {
  task: string;
  tier: "local" | "cloud";
  model: string;
  latency: string;
  ms: number;
  egress: string;
}

export interface HybridCompareRow {
  dimension: string;
  braindrop: string;
  cloudOnly: string;
}

export interface IndexItemCopy {
  name: string;
  line: string;
  href: string;
  routeLabel: string;
  imageSrc: string;
  imageAlt: string;
}

export interface ChaptersCopy {
  introCaption: string;
  hud: string[];
  hybrid: {
    title: string;
    italicWord: string;
    thesis: string;
    imageSrc: string;
    imageAlt: string;
    imageCaption: string;
    ledgerTitle: string;
    benchmarkHint: string;
    localSpeedNote: string;
    cloudSafetyNote: string;
    cloudRefLabel: string;
    ledgerHeaders: [string, string, string, string];
    routes: HybridRouteRow[];
    compareTitle: string;
    compareHeaders: [string, string, string];
    compare: HybridCompareRow[];
    offlineTitle: string;
    offlineBody: string;
    browserTitle: string;
    browserBody: string;
  };
  clipper: {
    title: string;
    hint: string;
    clipActionLabel: string;
    clippedPulseLabel: string;
    stations: [ThreadStationCopy, ThreadStationCopy, ThreadStationCopy, ThreadStationCopy];
    sentences: [string, string];
    autoIndex: number;
    sourceUrl: string;
    triage: {
      heading: string;
      summaries: [string, string];
      tagSets: [string[], string[]];
      runtime: string;
    };
    connect: {
      anchor: string;
      runtime: string;
      links: { title: string; score: string }[];
    };
    recall: {
      question: string;
      answer: string;
      revealLabel: string;
      hideLabel: string;
      cadence: string;
      openCapture: string;
    };
    vaultEmpty: string;
    vaultSaved: string;
    source: string;
    tags: string[];
    download: string;
  };
  index: {
    title: string;
    hint: string;
    mobileCaption: string;
    items: IndexItemCopy[];
  };
  closing: {
    thesis: string;
    cta: string;
    ctaHref: string;
    extensionCta: string;
    extensionHref: string;
    links: { label: string; href: string; download?: boolean }[];
    legal: string;
    author: string;
    backToTop: string;
  };
}

export const LANDING_CHAPTERS: Record<Locale, ChaptersCopy> = {
  en: {
    introCaption: "Local-first second brain",
    hud: ["Story", "Workspace", "Hybrid", "Clipper", "Privacy", "Index", "Close"],
    hybrid: {
      title: "Fast on your machine. Deep when you ask.",
      italicWord: "ask.",
      thesis:
        "Most notes never need a remote server. BrainDrop keeps everyday thinking inside your browser (offline, private, and free) and reaches for the cloud only after sensitive fields are stripped away.",
      imageSrc: "/images/hybrid-overview.jpg",
      imageAlt: "BrainDrop AI workspace architecture preview",
      imageCaption: "Local Gemini Nano 4 for everyday clarity · Sanitized Gemini 3.8 Flash only for multi-note depth",
      ledgerTitle: "How every task is routed",
      benchmarkHint: "Select or hover any row to compare response speed",
      localSpeedNote: "faster than cloud round-trip · 0 bytes uploaded",
      cloudSafetyNote: "6 PII classes redacted locally (<2ms) prior to Firebase AI Logic call",
      cloudRefLabel: "Cloud synthesis baseline (680ms)",
      ledgerHeaders: ["Task", "Where it runs", "Speed", "Data sent"],
      routes: [
        { task: "Auto-tag web clips", tier: "local", model: "Gemini Nano 4 · On-device", latency: "~38ms", ms: 38, egress: "None · Offline" },
        { task: "Quick note summary", tier: "local", model: "Gemini Nano 4 · On-device", latency: "~45ms", ms: 45, egress: "None · Offline" },
        { task: "Semantic search & linking", tier: "local", model: "Gemini Nano 4 · On-device", latency: "~30ms", ms: 30, egress: "None · Offline" },
        { task: "PII & secret detection", tier: "local", model: "Local sanitizer · Regex", latency: "<2ms", ms: 2, egress: "None · Offline" },
        { task: "Cross-note research brief", tier: "cloud", model: "Gemini 3.8 Flash · Cloud", latency: "~680ms", ms: 680, egress: "Redacted only" },
        { task: "Leitner flashcard deck", tier: "cloud", model: "Gemini 3.8 Flash · Cloud", latency: "~820ms", ms: 820, egress: "Redacted only" },
      ],
      compareTitle: "Compared to cloud-only note apps",
      compareHeaders: ["Dimension", "BrainDrop AI", "Cloud-only tools"],
      compare: [
        { dimension: "Everyday AI", braindrop: "Runs inside Chrome (~38ms, $0)", cloudOnly: "Every keystroke hits remote servers" },
        { dimension: "Offline work", braindrop: "Tagging, search, and summaries keep working", cloudOnly: "Stops the moment Wi-Fi drops" },
        { dimension: "Sensitive drafts", braindrop: "6 PII classes masked before any upload", cloudOnly: "Full unredacted text sent to APIs" },
      ],
      offlineTitle: "Works offline, at zero token cost",
      offlineBody:
        "Routine reading, tagging, and local graph discovery consume zero cloud quota and continue uninterrupted on a flight or unstable connection.",
      browserTitle: "Ready in any browser, with no setup required",
      browserBody:
        "Chrome with Built-in AI runs Gemini Nano 4 directly on WebGPU. On standard browsers, deterministic Simulation Mode keeps every workflow smooth at 60fps with no login wall.",
    },
    clipper: {
      title: "Highlight anywhere. Trace how it connects.",
      hint: "Scroll to follow the Chrome MV3 clipper thread, or highlight/click any sentence.",
      clipActionLabel: "Clip to BrainDrop ↵",
      clippedPulseLabel: "Clipped · Routed to Nano (~38ms)",
      stations: [
        { step: "01", label: "Clip from any webpage" },
        { step: "02", label: "Tagged on-device (~38ms)" },
        { step: "03", label: "Linked in browser memory" },
        { step: "04", label: "Returned before it fades" },
      ],
      sentences: [
        "Research falls apart when a good highlight is copied into a blank page and forgets where it came from.",
        "A quiet extension keeps the source URL, page title, and surrounding context attached to every sentence you save.",
      ],
      autoIndex: 1,
      sourceUrl: "developer.chrome.com/docs/extensions/mv3 · 1-click capture",
      triage: {
        heading: "Instant local summary & topic tags",
        summaries: [
          "Copying raw snippets strips away source provenance; keeping origin metadata intact prevents fragmented research.",
          "The MV3 content script preserves URL, document title, and surrounding paragraphs alongside each saved highlight.",
        ],
        tagSets: [
          ["#provenance", "#context-retention", "#research-flow"],
          ["#chrome-mv3", "#web-clipper", "#on-device-nano"],
        ],
        runtime: "Gemini Nano 4 · 0 bytes sent · session.destroy()",
      },
      connect: {
        anchor: "On-device language models",
        runtime: "Gemini Nano 4 · 38ms local match",
        links: [
          { title: "Browser memory lifecycle", score: "0.94" },
          { title: "Chrome MV3 side-panel architecture", score: "0.91" },
          { title: "Force-directed knowledge maps", score: "0.86" },
        ],
      },
      recall: {
        question: "Why close every Gemini Nano session inside a finally block?",
        answer:
          "Calling session.destroy() releases browser GPU/RAM immediately after each local prompt so memory never leaks across long research sessions.",
        revealLabel: "Reveal answer",
        hideLabel: "Hide answer",
        cadence: "Box 1 (Daily) → Box 2 (3d) → Box 3 (7d) · 88% retention",
        openCapture: "Open Capture",
      },
      vaultEmpty: "Click or highlight a sentence at station 01 to clip it.",
      vaultSaved: "Saved via MV3 Clipper",
      source: "developer.chrome.com",
      tags: ["chrome-mv3", "on-device", "provenance"],
      download: "Get the Chrome extension (.zip)",
    },
    index: {
      title: "Five places to think.",
      hint: "Hover a module to preview",
      mobileCaption: "Interactive workspace preview",
      items: [
        {
          name: "Capture",
          line: "Web passages, URL scraper, and voice notes.",
          href: "/capture",
          routeLabel: "braindrop.ai/capture",
          imageSrc: "/images/preview-capture.jpg",
          imageAlt: "Capture module preview",
        },
        {
          name: "Notes",
          line: "A calm Tiptap editor with local Nano summaries.",
          href: "/notes",
          routeLabel: "braindrop.ai/notes",
          imageSrc: "/images/preview-notes.jpg",
          imageAlt: "Smart Note Canvas preview",
        },
        {
          name: "Knowledge Graph",
          line: "60fps force-directed notes that find each other.",
          href: "/graph",
          routeLabel: "braindrop.ai/graph",
          imageSrc: "/images/preview-graph.jpg",
          imageAlt: "Knowledge Graph Canvas preview",
        },
        {
          name: "Flashcards",
          line: "Three-box Leitner review right before you forget.",
          href: "/flashcards",
          routeLabel: "braindrop.ai/flashcards",
          imageSrc: "/images/preview-flashcards.jpg",
          imageAlt: "Leitner Flashcards study suite preview",
        },
        {
          name: "Dashboard",
          line: "Transparent local-vs-cloud telemetry and speed.",
          href: "/dashboard",
          routeLabel: "braindrop.ai/dashboard",
          imageSrc: "/images/preview-dashboard.jpg",
          imageAlt: "Research Analytics & Privacy Dashboard preview",
        },
      ],
    },
    closing: {
      thesis:
        "Your thinking belongs on your own machine: captured in one click, connected inside browser memory, and remembered right before it fades.",
      cta: "Open BrainDrop",
      ctaHref: "/notes",
      extensionCta: "Download Chrome Extension (.zip)",
      extensionHref: "/braindrop-extension.zip",
      links: [
        { label: "Capture", href: "/capture" },
        { label: "Notes", href: "/notes" },
        { label: "Graph", href: "/graph" },
        { label: "Flashcards", href: "/flashcards" },
        { label: "Dashboard", href: "/dashboard" },
      ],
      legal: "Open source under Apache 2.0",
      author: "By Tino Nurcahya",
      backToTop: "Back to the beginning",
    },
  },
  id: {
    introCaption: "Otak kedua di perangkatmu",
    hud: ["Cerita", "Workspace", "Hibrida", "Clipper", "Privasi", "Index", "Penutup"],
    hybrid: {
      title: "Cepat di perangkatmu. Dalam saat diminta.",
      italicWord: "diminta.",
      thesis:
        "Sebagian besar catatan tidak pernah membutuhkan server jauh. BrainDrop menjaga pekerjaan harian tetap di dalam browser (offline, privat, dan gratis), lalu memanggil cloud hanya setelah data sensitif disensor.",
      imageSrc: "/images/hybrid-overview.jpg",
      imageAlt: "Pratinjau arsitektur workspace BrainDrop AI",
      imageCaption: "Gemini Nano 4 lokal untuk tugas harian · Gemini 3.8 Flash tersensor khusus sintesis lintas-catatan",
      ledgerTitle: "Bagaimana setiap tugas diarahkan",
      benchmarkHint: "Pilih atau arahkan ke baris mana pun untuk membandingkan kecepatan",
      localSpeedNote: "lebih cepat dari bolak-balik cloud · 0 byte diunggah",
      cloudSafetyNote: "6 kelas PII disensor lokal (<2ms) sebelum memanggil Firebase AI Logic",
      cloudRefLabel: "Patokan sintesis cloud (680ms)",
      ledgerHeaders: ["Tugas", "Lokasi proses", "Kecepatan", "Data keluar"],
      routes: [
        { task: "Tag otomatis klip web", tier: "local", model: "Gemini Nano 4 · Lokal", latency: "~38ms", ms: 38, egress: "Nol · Offline" },
        { task: "Ringkasan catatan cepat", tier: "local", model: "Gemini Nano 4 · Lokal", latency: "~45ms", ms: 45, egress: "Nol · Offline" },
        { task: "Pencarian & tautan semantik", tier: "local", model: "Gemini Nano 4 · Lokal", latency: "~30ms", ms: 30, egress: "Nol · Offline" },
        { task: "Deteksi PII & rahasia", tier: "local", model: "Sanitizer lokal · Regex", latency: "<2ms", ms: 2, egress: "Nol · Offline" },
        { task: "Rangkuman lintas-catatan", tier: "cloud", model: "Gemini 3.8 Flash · Cloud", latency: "~680ms", ms: 680, egress: "Hanya tersensor" },
        { task: "Dek flashcard Leitner", tier: "cloud", model: "Gemini 3.8 Flash · Cloud", latency: "~820ms", ms: 820, egress: "Hanya tersensor" },
      ],
      compareTitle: "Dibanding aplikasi catatan cloud-only",
      compareHeaders: ["Aspek", "BrainDrop AI", "Aplikasi cloud-only"],
      compare: [
        { dimension: "AI harian", braindrop: "Berjalan di Chrome (~38ms, Rp 0)", cloudOnly: "Setiap proses dikirim ke server luar" },
        { dimension: "Kerja offline", braindrop: "Tag, pencarian, dan ringkasan tetap aktif", cloudOnly: "Berhenti saat koneksi terputus" },
        { dimension: "Draf sensitif", braindrop: "6 kelas PII disensor sebelum unggah", cloudOnly: "Teks mentah utuh dikirim ke API" },
      ],
      offlineTitle: "Berjalan offline, tanpa biaya token",
      offlineBody:
        "Membaca, menandai topik, dan menemukan relasi lokal tidak memakan kuota cloud sedikit pun, sehingga tetap lancar di pesawat maupun jaringan tidak stabil.",
      browserTitle: "Siap dicoba di browser apa pun, tanpa login",
      browserBody:
        "Chrome dengan Built-in AI menjalankan Gemini Nano 4 langsung di WebGPU. Di browser standar, Simulation Mode deterministik menjaga seluruh alur tetap 60fps tanpa error.",
    },
    clipper: {
      title: "Sorot di mana saja. Telusuri benang merahnya.",
      hint: "Gulir untuk mengikuti alur ekstensi Chrome MV3, atau sorot/klik kalimat.",
      clipActionLabel: "Simpan ke BrainDrop ↵",
      clippedPulseLabel: "Tersimpan · Diproses Nano (~38ms)",
      stations: [
        { step: "01", label: "Kutip dari halaman web" },
        { step: "02", label: "Ditandai lokal (~38ms)" },
        { step: "03", label: "Terhubung di memori browser" },
        { step: "04", label: "Diingat sebelum terlupa" },
      ],
      sentences: [
        "Riset berantakan ketika sorotan yang bagus disalin ke halaman kosong dan lupa dari mana asalnya.",
        "Ekstensi yang tenang menjaga URL sumber, judul halaman, dan konteks paragraf tetap menempel pada setiap kutipan.",
      ],
      autoIndex: 1,
      sourceUrl: "developer.chrome.com/docs/extensions/mv3 · 1-klik simpan",
      triage: {
        heading: "Ringkasan & tag otomatis di perangkat",
        summaries: [
          "Menyalin kutipan mentah menghilangkan jejak sumber; menjaga metadata asal mencegah riset tercerai-berai.",
          "Content script MV3 menyimpan URL, judul dokumen, dan paragraf pengapit bersama setiap kalimat yang disorot.",
        ],
        tagSets: [
          ["#provenance", "#konteks-utuh", "#alur-riset"],
          ["#chrome-mv3", "#web-clipper", "#nano-lokal"],
        ],
        runtime: "Gemini Nano 4 · 0 byte keluar · session.destroy()",
      },
      connect: {
        anchor: "Model bahasa di perangkat",
        runtime: "Gemini Nano 4 · 38ms pencocokan lokal",
        links: [
          { title: "Siklus memori browser", score: "0.94" },
          { title: "Arsitektur side-panel Chrome MV3", score: "0.91" },
          { title: "Peta pengetahuan berbasis fisika", score: "0.86" },
        ],
      },
      recall: {
        question: "Mengapa setiap sesi Gemini Nano ditutup di dalam blok finally?",
        answer:
          "Memanggil session.destroy() langsung membebaskan memori GPU/RAM browser setelah prompt selesai agar sesi riset panjang tetap ringan.",
        revealLabel: "Lihat jawaban",
        hideLabel: "Tutup jawaban",
        cadence: "Box 1 (Harian) → Box 2 (3h) → Box 3 (7h) · 88% daya ingat",
        openCapture: "Buka Capture",
      },
      vaultEmpty: "Klik atau sorot kalimat di stasiun 01 untuk menyimpannya.",
      vaultSaved: "Tersimpan via MV3 Clipper",
      source: "developer.chrome.com",
      tags: ["chrome-mv3", "lokal", "provenance"],
      download: "Unduh ekstensi Chrome (.zip)",
    },
    index: {
      title: "Lima tempat untuk berpikir.",
      hint: "Arahkan ke modul untuk pratinjau",
      mobileCaption: "Pratinjau modul workspace",
      items: [
        {
          name: "Capture",
          line: "Kutipan web, ekstraktor tautan, dan catatan suara.",
          href: "/capture",
          routeLabel: "braindrop.ai/capture",
          imageSrc: "/images/preview-capture.jpg",
          imageAlt: "Pratinjau modul Capture",
        },
        {
          name: "Notes",
          line: "Editor Tiptap tenang dengan ringkasan Nano lokal.",
          href: "/notes",
          routeLabel: "braindrop.ai/notes",
          imageSrc: "/images/preview-notes.jpg",
          imageAlt: "Pratinjau Smart Note Canvas",
        },
        {
          name: "Knowledge Graph",
          line: "Graf fisika 60fps yang saling menemukan relasi.",
          href: "/graph",
          routeLabel: "braindrop.ai/graph",
          imageSrc: "/images/preview-graph.jpg",
          imageAlt: "Pratinjau Knowledge Graph Canvas",
        },
        {
          name: "Flashcards",
          line: "Ulasan 3 kotak Leitner tepat sebelum terlupa.",
          href: "/flashcards",
          routeLabel: "braindrop.ai/flashcards",
          imageSrc: "/images/preview-flashcards.jpg",
          imageAlt: "Pratinjau studi Flashcards Leitner",
        },
        {
          name: "Dashboard",
          line: "Telemetri transparan proses lokal vs cloud.",
          href: "/dashboard",
          routeLabel: "braindrop.ai/dashboard",
          imageSrc: "/images/preview-dashboard.jpg",
          imageAlt: "Pratinjau Dashboard Riset & Privasi",
        },
      ],
    },
    closing: {
      thesis:
        "Pemikiranmu adalah milik perangkatmu sendiri: ditangkap dalam satu klik, terhubung di memori browser, dan diingat tepat sebelum terlupa.",
      cta: "Buka BrainDrop",
      ctaHref: "/notes",
      extensionCta: "Unduh Ekstensi Chrome (.zip)",
      extensionHref: "/braindrop-extension.zip",
      links: [
        { label: "Capture", href: "/capture" },
        { label: "Notes", href: "/notes" },
        { label: "Graph", href: "/graph" },
        { label: "Flashcards", href: "/flashcards" },
        { label: "Dashboard", href: "/dashboard" },
      ],
      legal: "Kode terbuka berlisensi Apache 2.0",
      author: "Oleh Tino Nurcahya",
      backToTop: "Kembali ke awal",
    },
  },
};
