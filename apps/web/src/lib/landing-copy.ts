import type { Locale } from "./landing-i18n";

export interface LandingAct {
  title: string;
  body: string;
}

export type WorkspaceSceneId =
  | "capture"
  | "notes"
  | "graph"
  | "flashcards"
  | "telemetry";

export interface LandingProductTab {
  id: WorkspaceSceneId;
  name: string;
  caption: string;
  href: string;
  routeLabel: string;
  ctaLabel: string;
}

export interface LandingPrivacySample {
  id: string;
  label: string;
  rawText: string;
  localSummary: string;
  cloudSynthesis: string;
}

export interface LandingCopy {
  nav: {
    links: { label: string; target: string }[];
    cta: string;
    language: string;
  };
  hero: {
    lines: string[];
    sub: string;
    cta: string;
    secondaryCta: string;
    hint: string;
  };
  story: {
    rail: string[];
    acts: LandingAct[];
  };
  product: {
    title: string;
    sub: string;
    tabs: LandingProductTab[];
    scenes: {
      capture: {
        modes: [string, string, string];
        sourceDomain: string;
        sourceTitle: string;
        excerpt: string;
        voiceTranscript: string;
        quickDraft: string;
        tags: string[];
        savedLabel: string;
      };
      notes: {
        docTitle: string;
        docMeta: string;
        docBody: string;
        docQuote: string;
        copilotTitle: string;
        actions: {
          id: "summarize" | "eli5" | "related";
          label: string;
          latency: string;
          output: string;
        }[];
      };
      graph: {
        inspectorLabel: string;
        nodes: {
          id: string;
          label: string;
          cluster: "nano" | "core" | "study";
          x: number;
          y: number;
          summary: string;
          connections: number;
        }[];
        edges: [string, string, boolean?][];
      };
      flashcards: {
        boxLabels: [string, string, string];
        flipHint: string;
        question: string;
        answer: string;
        code: string;
        ratings: [string, string, string];
        masteryLabel: string;
      };
      telemetry: {
        ratioTitle: string;
        ratioValue: string;
        ratioSub: string;
        localBytesLabel: string;
        localBytesValue: string;
        localBytesSub: string;
        piiStatusLabel: string;
        piiStatusValue: string;
        piiStatusSub: string;
        latencyTitle: string;
        nanoBarLabel: string;
        cloudBarLabel: string;
        heatmapTitle: string;
      };
    };
  };
  why: {
    lines: string[];
    beats: { title: string; body: string }[];
    labels: { device: string; gate: string; nano: string; cloud: string };
    sandbox: {
      title: string;
      sampleLabel: string;
      localBtn: string;
      cloudBtn: string;
      rawLabel: string;
      sanitizedLabel: string;
      keptLocalNote: string;
      scrubbedNote: string;
      samples: LandingPrivacySample[];
    };
    facts: { value: string; label: string }[];
  };
}

export const LANDING_COPY: Record<Locale, LandingCopy> = {
  en: {
    nav: {
      links: [
        { label: "Story", target: "#story" },
        { label: "Workspace", target: "#workspace" },
        { label: "Hybrid", target: "#hybrid" },
        { label: "Clipper", target: "#clipper" },
        { label: "Privacy", target: "#privacy" },
        { label: "Index", target: "#index" },
      ],
      cta: "Open workspace",
      language: "Switch language",
    },
    hero: {
      lines: ["Ideas fall", "like rain."],
      sub: "Save passages from anywhere on the web, let local intelligence connect them inside your browser, and recall what matters without giving away your privacy.",
      cta: "Start writing",
      secondaryCta: "Quick capture",
      hint: "Scroll to follow a thought",
    },
    story: {
      rail: ["Rain", "Capture", "Connect", "Remember"],
      acts: [
        {
          title: "Capture",
          body: "One click from any article, paper, or voice note. The page address, title, and surrounding paragraph stay attached to the excerpt.",
        },
        {
          title: "Connect",
          body: "Gemini Nano reads and links related notes directly in browser memory, so your map of ideas forms quietly on its own.",
        },
        {
          title: "Remember",
          body: "Turn scattered reading into clear syntheses and spaced review cards, with sensitive details redacted before any cloud request.",
        },
      ],
    },
    product: {
      title: "See it work.",
      sub: "Try all five parts of the workspace right here, or step directly into the app.",
      tabs: [
        {
          id: "capture",
          name: "Capture",
          caption: "Save web highlights, extract clean articles from links, or record quick voice thoughts.",
          href: "/capture",
          routeLabel: "braindrop.ai/capture",
          ctaLabel: "Open Capture",
        },
        {
          id: "notes",
          name: "Notes",
          caption: "A calm Markdown editor with instant local summaries, plain-language rewrites, and related links.",
          href: "/notes",
          routeLabel: "braindrop.ai/notes",
          ctaLabel: "Open Notes",
        },
        {
          id: "graph",
          name: "Graph",
          caption: "An interactive constellation showing how separate notes and topics relate to one another.",
          href: "/graph",
          routeLabel: "braindrop.ai/graph",
          ctaLabel: "Open Graph",
        },
        {
          id: "flashcards",
          name: "Flashcards",
          caption: "Three-stage Leitner study cards that bring key ideas back right before they fade.",
          href: "/flashcards",
          routeLabel: "braindrop.ai/flashcards",
          ctaLabel: "Study Cards",
        },
        {
          id: "telemetry",
          name: "Activity",
          caption: "A transparent log of what ran on your device, how fast it answered, and how much stayed local.",
          href: "/dashboard",
          routeLabel: "braindrop.ai/dashboard",
          ctaLabel: "Open Dashboard",
        },
      ],
      scenes: {
        capture: {
          modes: ["Web clip", "Quick note", "Voice memo"],
          sourceDomain: "developer.chrome.com/docs/ai/built-in",
          sourceTitle: "Running language models inside the browser",
          excerpt:
            "On-device models run directly inside browser memory, removing server round-trips and keeping personal drafts private by default.",
          voiceTranscript:
            "“Voice note (00:14) — Compare spring attraction against hierarchical trees when organizing dense research notes…”",
          quickDraft:
            "Keeping everyday tagging and summaries on the device cuts cloud usage dramatically while feeling instantaneous.",
          tags: ["browser-ai", "local-first", "research"],
          savedLabel: "Saved with source link",
        },
        notes: {
          docTitle: "Hybrid local and cloud reasoning",
          docMeta: "Edited 2 minutes ago",
          docBody:
            "Everyday writing, tagging, and summarizing happen locally inside Chrome. Deeper synthesis across long collections is only sent out when you ask.",
          docQuote:
            "Before a multi-note request leaves the browser, personal identifiers and credentials are automatically masked.",
          copilotTitle: "Local assistant",
          actions: [
            {
              id: "summarize",
              label: "Summarize",
              latency: "29ms",
              output:
                "Routine reading and writing tasks stay inside browser memory (~29ms), while deeper multi-note synthesis uses sanitized cloud requests.",
            },
            {
              id: "eli5",
              label: "Simplify",
              latency: "34ms",
              output:
                "Quick tasks happen privately on your own laptop; when you ask the cloud for heavier help, sensitive details are blacked out first.",
            },
            {
              id: "related",
              label: "Related notes",
              latency: "38ms",
              output:
                "Found 3 connected notes: Browser language models (0.94), Client redaction rules (0.91), and Force-directed layouts (0.86).",
            },
          ],
        },
        graph: {
          inspectorLabel: "Hover or select a node to trace its neighbors",
          nodes: [
            {
              id: "nano",
              label: "Local Model",
              cluster: "nano",
              x: 24,
              y: 34,
              summary: "Runs summaries, tags, and note matching inside browser memory.",
              connections: 4,
            },
            {
              id: "router",
              label: "Task Router",
              cluster: "core",
              x: 50,
              y: 48,
              summary: "Keeps private tasks on-device and prepares sanitized cloud requests.",
              connections: 5,
            },
            {
              id: "pii",
              label: "Redaction",
              cluster: "nano",
              x: 34,
              y: 74,
              summary: "Masks emails, keys, phone numbers, IDs, cards, and IP addresses.",
              connections: 3,
            },
            {
              id: "flash",
              label: "Cloud Synthesis",
              cluster: "core",
              x: 76,
              y: 28,
              summary: "Compiles structured research briefs across multiple sanitized notes.",
              connections: 3,
            },
            {
              id: "srs",
              label: "Study Deck",
              cluster: "study",
              x: 78,
              y: 72,
              summary: "Schedules 1-day, 3-day, and 7-day active recall reviews.",
              connections: 3,
            },
            {
              id: "clipper",
              label: "Web Clipper",
              cluster: "nano",
              x: 16,
              y: 62,
              summary: "Saves highlighted passages together with their source page.",
              connections: 2,
            },
          ],
          edges: [
            ["clipper", "nano"],
            ["nano", "router"],
            ["nano", "pii", true],
            ["router", "pii"],
            ["pii", "flash"],
            ["router", "flash"],
            ["router", "srs", true],
            ["flash", "srs"],
          ],
        },
        flashcards: {
          boxLabels: ["Daily", "Every 3 days", "Weekly"],
          flipHint: "Click card to turn over",
          question: "How does BrainDrop release browser memory right after a local model finishes?",
          answer:
            "Each model session is created for the task at hand and immediately closed inside a finally block with session.destroy().",
          code: "const s = await window.ai.languageModel.create();\ntry { return await s.prompt(input); }\nfinally { s.destroy(); }",
          ratings: ["Review again", "Good recall", "Easy"],
          masteryLabel: "Retention",
        },
        telemetry: {
          ratioTitle: "Handled on device",
          ratioValue: "88%",
          ratioSub: "156 local tasks, 21 cloud tasks",
          localBytesLabel: "Kept on device",
          localBytesValue: "284.6 KB",
          localBytesSub: "Never uploaded",
          piiStatusLabel: "Sensitive fields",
          piiStatusValue: "Masked",
          piiStatusSub: "Emails, keys, phones, IDs",
          latencyTitle: "Average response time",
          nanoBarLabel: "On device (38ms)",
          cloudBarLabel: "Cloud synthesis (680ms)",
          heatmapTitle: "Last 30 days of notes",
        },
      },
    },
    why: {
      lines: ["Private by default.", "Powerful on demand."],
      beats: [
        {
          title: "Your notes stay here.",
          body: "Everything you clip and write lives inside your browser on your own machine.",
        },
        {
          title: "Everyday thinking stays local.",
          body: "Gemini Nano tags, summarizes, and connects notes in roughly 38 milliseconds without touching the network.",
        },
        {
          title: "Redacted before it leaves.",
          body: "When you ask for deeper synthesis across notes, personal details and secrets are masked before the request goes out.",
        },
      ],
      labels: {
        device: "Your device",
        gate: "Redaction gate",
        nano: "Gemini Nano",
        cloud: "Gemini Flash",
      },
      sandbox: {
        title: "Try the privacy check",
        sampleLabel: "Sample note",
        localBtn: "Run locally (38ms)",
        cloudBtn: "Mask and ask cloud",
        rawLabel: "Original note in browser",
        sanitizedLabel: "Sent for cloud synthesis",
        keptLocalNote: "Stays on device",
        scrubbedNote: "items masked",
        samples: [
          {
            id: "eng",
            label: "Engineering note",
            rawText:
              "Sync Q4 launch brief with arya.putra@acme-corp.id on staging 10.24.188.42 using token=bd_demo_98a7bc65def4ab2c89de.",
            localSummary:
              "Summarized locally in 34ms: Q4 launch coordination, staging verification, and credential check.",
            cloudSynthesis:
              "Sanitized text sent to Gemini Flash—addresses, IPs, and tokens never leave your browser.",
          },
          {
            id: "research",
            label: "Interview note",
            rawText:
              "Participant sarah.ux@startup.sg (+6281294837261) asked that unpublished competitor notes remain strictly confidential.",
            localSummary:
              "Summarized locally in 31ms: Interviewee requested strict confidentiality for pre-launch research.",
            cloudSynthesis:
              "Contact details were replaced with placeholders before generating the cross-note brief.",
          },
        ],
      },
      facts: [
        { value: "38ms", label: "typical response time on your device" },
        { value: "0", label: "unmasked personal fields sent to the cloud" },
        { value: "6", label: "types of sensitive data scrubbed automatically" },
      ],
    },
  },
  id: {
    nav: {
      links: [
        { label: "Cerita", target: "#story" },
        { label: "Workspace", target: "#workspace" },
        { label: "Hibrida", target: "#hybrid" },
        { label: "Clipper", target: "#clipper" },
        { label: "Privasi", target: "#privacy" },
        { label: "Index", target: "#index" },
      ],
      cta: "Buka workspace",
      language: "Ganti bahasa",
    },
    hero: {
      lines: ["Ide jatuh", "seperti hujan."],
      sub: "Simpan kutipan dari halaman mana pun, biarkan AI di browser menghubungkannya secara lokal, dan ingat kembali saat dibutuhkan tanpa mengorbankan privasi.",
      cta: "Mulai menulis",
      secondaryCta: "Tangkap cepat",
      hint: "Gulir untuk mengikuti alur ide",
    },
    story: {
      rail: ["Hujan", "Tangkap", "Hubungkan", "Ingat"],
      acts: [
        {
          title: "Tangkap",
          body: "Satu klik dari artikel, jurnal, atau catatan suara. Alamat halaman, judul, dan paragraf sekitarnya tetap tersimpan utuh bersama kutipanmu.",
        },
        {
          title: "Hubungkan",
          body: "Gemini Nano membaca dan menautkan catatan yang berkaitan langsung di memori browser, sehingga peta idemu tumbuh dengan sendirinya.",
        },
        {
          title: "Ingat",
          body: "Ubah bacaan yang tersebar menjadi rangkuman utuh dan kartu belajar terjadwal, dengan data sensitif disensor lebih dulu sebelum meminta bantuan cloud.",
        },
      ],
    },
    product: {
      title: "Lihat cara kerjanya.",
      sub: "Coba langsung kelima bagian workspace di bawah ini, atau masuk langsung ke aplikasinya.",
      tabs: [
        {
          id: "capture",
          name: "Capture",
          caption: "Simpan sorotan web, ambil teks bersih dari tautan, atau rekam ide lewat suara.",
          href: "/capture",
          routeLabel: "braindrop.ai/capture",
          ctaLabel: "Buka Capture",
        },
        {
          id: "notes",
          name: "Notes",
          caption: "Editor Markdown yang tenang dengan ringkasan instan, penyederhanaan bahasa, dan tautan catatan lokal.",
          href: "/notes",
          routeLabel: "braindrop.ai/notes",
          ctaLabel: "Buka Notes",
        },
        {
          id: "graph",
          name: "Graph",
          caption: "Peta interaktif yang memperlihatkan bagaimana catatan dan topik saling terhubung.",
          href: "/graph",
          routeLabel: "braindrop.ai/graph",
          ctaLabel: "Buka Graph",
        },
        {
          id: "flashcards",
          name: "Flashcards",
          caption: "Kartu belajar tiga tahap Leitner yang memunculkan kembali konsep penting sebelum terlupa.",
          href: "/flashcards",
          routeLabel: "braindrop.ai/flashcards",
          ctaLabel: "Mulai Belajar",
        },
        {
          id: "telemetry",
          name: "Aktivitas",
          caption: "Catatan transparan mengenai apa yang diproses di perangkatmu, kecepatannya, dan data yang tetap lokal.",
          href: "/dashboard",
          routeLabel: "braindrop.ai/dashboard",
          ctaLabel: "Buka Dashboard",
        },
      ],
      scenes: {
        capture: {
          modes: ["Klip web", "Catatan cepat", "Memo suara"],
          sourceDomain: "developer.chrome.com/docs/ai/built-in",
          sourceTitle: "Menjalankan model bahasa langsung di dalam browser",
          excerpt:
            "Model di perangkat bekerja langsung di memori browser, menghapus jeda bolak-balik server dan menjaga draf pribadi tetap aman sejak awal.",
          voiceTranscript:
            "“Memo suara (00:14) — Bandingkan gaya tarik pegas dengan struktur pohon untuk merapikan kumpulan catatan riset…”",
          quickDraft:
            "Menjalankan penandaan topik dan ringkasan harian di perangkat membuat respons terasa seketika sekaligus hemat kuota cloud.",
          tags: ["browser-ai", "lokal", "riset"],
          savedLabel: "Tersimpan beserta tautan asal",
        },
        notes: {
          docTitle: "Penalaran lokal dan cloud yang seimbang",
          docMeta: "Diedit 2 menit lalu",
          docBody:
            "Menulis, memberi tag, dan meringkas bacaan berjalan lokal di dalam Chrome. Sintesis panjang lintas-catatan hanya dikirim saat kamu memintanya.",
          docQuote:
            "Sebelum permintaan lintas-catatan keluar dari browser, alamat email, nomor kontak, dan kunci rahasia disensor otomatis.",
          copilotTitle: "Asisten lokal",
          actions: [
            {
              id: "summarize",
              label: "Ringkas",
              latency: "29ms",
              output:
                "Tugas baca-tulis harian diproses di memori browser (~29ms), sedangkan sintesis lintas-catatan memakai permintaan cloud yang telah disensor.",
            },
            {
              id: "eli5",
              label: "Sederhanakan",
              latency: "34ms",
              output:
                "Pekerjaan cepat selesai langsung di laptopmu; saat kamu butuh bantuan cloud untuk merangkum banyak bahan, data rahasia ditutupi lebih dulu.",
            },
            {
              id: "related",
              label: "Catatan terkait",
              latency: "38ms",
              output:
                "Ditemukan 3 catatan terhubung: Model bahasa di browser (0.94), Aturan sensor klien (0.91), dan Tata letak graf fisika (0.86).",
            },
          ],
        },
        graph: {
          inspectorLabel: "Arahkan atau pilih titik untuk menelusuri hubungannya",
          nodes: [
            {
              id: "nano",
              label: "Model Lokal",
              cluster: "nano",
              x: 24,
              y: 34,
              summary: "Menjalankan ringkasan, tag, dan pencocokan catatan di memori browser.",
              connections: 4,
            },
            {
              id: "router",
              label: "Pengarah Tugas",
              cluster: "core",
              x: 50,
              y: 48,
              summary: "Menjaga tugas pribadi tetap lokal dan menyiapkan permintaan cloud yang aman.",
              connections: 5,
            },
            {
              id: "pii",
              label: "Sensor Data",
              cluster: "nano",
              x: 34,
              y: 74,
              summary: "Menyensor email, kunci API, telepon, NIK, kartu, dan alamat IP.",
              connections: 3,
            },
            {
              id: "flash",
              label: "Sintesis Cloud",
              cluster: "core",
              x: 76,
              y: 28,
              summary: "Menyusun rangkuman riset utuh dari beberapa catatan yang telah disensor.",
              connections: 3,
            },
            {
              id: "srs",
              label: "Dek Belajar",
              cluster: "study",
              x: 78,
              y: 72,
              summary: "Mengatur jadwal ulasan 1 hari, 3 hari, dan 7 hari.",
              connections: 3,
            },
            {
              id: "clipper",
              label: "Web Clipper",
              cluster: "nano",
              x: 16,
              y: 62,
              summary: "Menyimpan sorotan kalimat lengkap dengan alamat halaman asalnya.",
              connections: 2,
            },
          ],
          edges: [
            ["clipper", "nano"],
            ["nano", "router"],
            ["nano", "pii", true],
            ["router", "pii"],
            ["pii", "flash"],
            ["router", "flash"],
            ["router", "srs", true],
            ["flash", "srs"],
          ],
        },
        flashcards: {
          boxLabels: ["Harian", "Tiap 3 hari", "Mingguan"],
          flipHint: "Klik kartu untuk membalik",
          question: "Bagaimana BrainDrop membebaskan memori browser sesaat setelah model lokal selesai menjawab?",
          answer:
            "Setiap sesi model dibuat seperlunya lalu langsung ditutup di dalam blok finally menggunakan session.destroy().",
          code: "const s = await window.ai.languageModel.create();\ntry { return await s.prompt(input); }\nfinally { s.destroy(); }",
          ratings: ["Ulangi lagi", "Ingat baik", "Mudah"],
          masteryLabel: "Daya ingat",
        },
        telemetry: {
          ratioTitle: "Diproses di perangkat",
          ratioValue: "88%",
          ratioSub: "156 tugas lokal, 21 tugas cloud",
          localBytesLabel: "Tetap di perangkat",
          localBytesValue: "284.6 KB",
          localBytesSub: "Tidak pernah diunggah",
          piiStatusLabel: "Data sensitif",
          piiStatusValue: "Tersensor",
          piiStatusSub: "Email, kunci, telepon, ID",
          latencyTitle: "Rata-rata waktu jawab",
          nanoBarLabel: "Di perangkat (38ms)",
          cloudBarLabel: "Sintesis cloud (680ms)",
          heatmapTitle: "Aktivitas catatan 30 hari terakhir",
        },
      },
    },
    why: {
      lines: ["Privat sejak awal.", "Bertenaga saat diminta."],
      beats: [
        {
          title: "Catatanmu tetap di sini.",
          body: "Semua yang kamu kutip dan tulis tersimpan di dalam browser pada perangkatmu sendiri.",
        },
        {
          title: "Pemikiran harian selesai lokal.",
          body: "Gemini Nano memberi tag, meringkas, dan menghubungkan catatan dalam sekitar 38 milidetik tanpa menyentuh jaringan.",
        },
        {
          title: "Disensor sebelum keluar.",
          body: "Saat kamu meminta sintesis lintas-catatan, identitas pribadi dan kunci rahasia ditutupi lebih dulu sebelum dikirim.",
        },
      ],
      labels: {
        device: "Perangkatmu",
        gate: "Gerbang sensor",
        nano: "Gemini Nano",
        cloud: "Gemini Flash",
      },
      sandbox: {
        title: "Coba pemeriksaan privasi",
        sampleLabel: "Contoh catatan",
        localBtn: "Proses lokal (38ms)",
        cloudBtn: "Sensor lalu tanya cloud",
        rawLabel: "Catatan asli di browser",
        sanitizedLabel: "Teks yang dikirim ke cloud",
        keptLocalNote: "Tetap di perangkat",
        scrubbedNote: "data disensor",
        samples: [
          {
            id: "eng",
            label: "Catatan teknis",
            rawText:
              "Sinkronkan rencana rilis Q4 bersama arya.putra@acme-corp.id di server 10.24.188.42 dengan token=bd_demo_98a7bc65def4ab2c89de.",
            localSummary:
              "Diringkas lokal dalam 34ms: Koordinasi rilis Q4, pengecekan server staging, dan verifikasi akses.",
            cloudSynthesis:
              "Teks yang telah disensor dikirim ke Gemini Flash—alamat email, IP, dan token tidak pernah keluar dari browser.",
          },
          {
            id: "research",
            label: "Catatan wawancara",
            rawText:
              "Narasumber sarah.ux@startup.sg (+6281294837261) meminta seluruh catatan riset kompetitor dijaga kerahasiaannya.",
            localSummary:
              "Diringkas lokal dalam 31ms: Narasumber meminta kerahasiaan penuh atas temuan riset pra-rilis.",
            cloudSynthesis:
              "Informasi kontak diganti tanda sensor sebelum rangkuman lintas-catatan disusun.",
          },
        ],
      },
      facts: [
        { value: "38ms", label: "waktu respons rata-rata di perangkatmu" },
        { value: "0", label: "data pribadi mentah terkirim ke cloud" },
        { value: "6", label: "jenis informasi sensitif disensor otomatis" },
      ],
    },
  },
};
