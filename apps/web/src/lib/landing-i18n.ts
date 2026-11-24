export type Locale = "en" | "id";

export interface WaypointCopy {
  index: number;
  badge: string;
  headline: string;
  accent: string;
  subtext: string;
}

export interface ExplodedLayerCopy {
  id: "dom" | "vector" | "graph";
  index: string;
  name: string;
  latency: string;
  title: string;
  description: string;
  metrics: string[];
  snippetTag: string;
  snippetText: string;
}

export interface PlaygroundPresetCopy {
  id: string;
  label: string;
  category: string;
  content: string;
  vectorPreview: string;
  targetIds: string[];
  similarity: string;
}

export interface PlaygroundNodeCopy {
  id: string;
  title: string;
  tag: string;
  snippet: string;
  coords: string;
  x: number;
  y: number;
  tone: "cyan" | "emerald" | "amber" | "slate";
}

export interface GalleryStationCopy {
  id: string;
  code: string;
  title: string;
  accent: string;
  description: string;
  videoSrc: string;
  fallbackImage: string;
  imageAlt: string;
  telemetry: string[];
  overlayTag: string;
  overlayMetric: string;
  overlayNote: string;
  href: string;
  cta: string;
}

export interface NeuralClusterCopy {
  id: number;
  key: string;
  label: string;
  nodeCount: string;
  coherence: string;
  centerTopic: string;
  connectedNotes: string[];
  insight: string;
}

export interface LandingCopy {
  header: {
    subtitle: string;
    launchWorkspace: string;
  };
  hud: {
    waypoints: WaypointCopy[];
    launchWorkspace: string;
    quickCapture: string;
    scrollCue: string;
  };
  mobile: {
    quickCaptureNote: string;
    milestones: {
      title: string;
      meta: string;
      description: string;
    }[];
  };
  explodedPipeline: {
    stageIndex: string;
    titleLine1: string;
    titleLine2: string;
    titleAccent: string;
    subtitle: string;
    focusAllLabel: string;
    layers: ExplodedLayerCopy[];
  };
  playground: {
    stageIndex: string;
    titleLine1: string;
    titleAccent: string;
    subtitle: string;
    inputPlaceholder: string;
    dropButtonLabel: string;
    resetButtonLabel: string;
    presetsLabel: string;
    activeMatchLabel: string;
    vectorStatusLabel: string;
    presets: PlaygroundPresetCopy[];
    initialNodes: PlaygroundNodeCopy[];
  };
  horizontalGallery: {
    stageIndex: string;
    titleLine1: string;
    titleAccent: string;
    scrollHint: string;
    stations: GalleryStationCopy[];
  };
  neuralGraph3D: {
    stageIndex: string;
    titleLine1: string;
    titleAccent: string;
    subtitle: string;
    allClustersLabel: string;
    coherenceLabel: string;
    linkedNodesLabel: string;
    bridgeInsightLabel: string;
    openGraphCta: string;
    clusters: NeuralClusterCopy[];
  };
  portalFooter: {
    stageIndex: string;
    manifestoQuote: string;
    titleLine1: string;
    titleAccent: string;
    primaryCta: string;
    extensionCta: string;
    secondaryCta: string;
    graphCta: string;
    cardsCta: string;
    backToTop: string;
    colophon: string;
    disclosure: string;
  };
}

export const LANDING_COPY: Record<Locale, LandingCopy> = {
  en: {
    header: {
      subtitle: "Hybrid second brain · Local NPU & Cloud",
      launchWorkspace: "Launch workspace",
    },
    hud: {
      waypoints: [
        {
          index: 0,
          badge: "[WAYPOINT 00 // THE VOID]",
          headline: "Capture anything.",
          accent: "Forget nothing.",
          subtext:
            "The privacy-first hybrid second brain. Process private notes on-device with Gemini Nano, and synthesize complex research with cloud intelligence.",
        },
        {
          index: 1,
          badge: "[WAYPOINT 01 // LOCAL NANO INFERENCE]",
          headline: "Capture without",
          accent: "friction.",
          subtext:
            "Zero folder hierarchies. Zero latency lag. Local Gemini Nano parses unstructured research notes in ~48ms directly on your device NPU.",
        },
        {
          index: 2,
          badge: "[WAYPOINT 02 // TOPOLOGY FORMATION]",
          headline: "Thoughts naturally",
          accent: "connect.",
          subtext:
            "Your curiosity forms an organic knowledge graph. Related passages, concepts, and research papers link autonomously through neural proximity.",
        },
        {
          index: 3,
          badge: "[WAYPOINT 03 // DEEP HYBRID SYNTHESIS]",
          headline: "Synthesize the",
          accent: "unseen.",
          subtext:
            "When research demands macroscopic understanding, Gemini 3.8 Flash fuses disparate threads into cohesive literature reviews and insights.",
        },
        {
          index: 4,
          badge: "[WAYPOINT 04 // ACTIVE RECALL & HORIZON]",
          headline: "Make what you learn",
          accent: "stay forever.",
          subtext:
            "Convert fleeting bookmarks into permanent cognitive pathways with spaced retrieval flashcards and active recall testing.",
        },
      ],
      launchWorkspace: "Launch Workspace",
      quickCapture: "Quick Capture",
      scrollCue: "SCROLL TO TRAVERSE WORKSPACE",
    },
    mobile: {
      quickCaptureNote: "Quick Capture Note",
      milestones: [
        {
          title: "Workspace Dashboard",
          meta: "~48ms Latency",
          description:
            "Zero folder hierarchies. Local Gemini Nano parses unstructured research notes directly on your device NPU without network latency.",
        },
        {
          title: "Autonomous Knowledge Graph",
          meta: "1536-Dim Vectors",
          description:
            "Your thoughts form an organic knowledge graph. Related passages, concepts, and papers link autonomously through neural proximity.",
        },
        {
          title: "Cross-Document AI Synthesis",
          meta: "Gemini 3.8 Flash",
          description:
            "When research demands macroscopic understanding, Gemini 3.8 Flash fuses disparate threads into cohesive literature reviews.",
        },
        {
          title: "Active Retrieval & Study Cards",
          meta: "Leitner Curve",
          description:
            "Invert the forgetting curve with spaced retrieval flashcards and active testing generated from your verified vault notes.",
        },
      ],
    },
    explodedPipeline: {
      stageIndex: "STAGE 01 // EXPLODED PIPELINE ARCHITECTURE",
      titleLine1: "One captured fragment.",
      titleLine2: "Three spatial layers of",
      titleAccent: "neural synthesis.",
      subtitle:
        "Scroll or inspect each structural plane to trace how an unstructured highlight decomposes into clean Markdown, local NPU embeddings, and permanent synaptic links.",
      focusAllLabel: "All Planes Exploded",
      layers: [
        {
          id: "dom",
          index: "PLANE 01",
          name: "DOM Clipper & Sticky Capture",
          latency: "01 · 12ms Parse",
          title: "Tactile Highlight Extraction",
          description:
            "Cleanly strips navigation clutter from articles, PDFs, and ArXiv preprints while preserving citation URLs and spatial coordinates inside your IndexedDB vault.",
          metrics: ["Clean Markdown AST", "Zero Tracking Pixels", "Source URL Anchor"],
          snippetTag: "RAW CAPTURE // 22:14",
          snippetText:
            "\"Attention heads specialize into local syntactic trackers and long-range semantic bridges during continual pretraining.\"",
        },
        {
          id: "vector",
          index: "PLANE 02",
          name: "On-Device NPU & 1536-D Embedding",
          latency: "02 · ~48ms Local NPU",
          title: "Semantic Tensor Projection",
          description:
            "Chrome built-in Gemini Nano extracts entities, keywords, and intent privately offline—routing zero sensitive drafts to external cloud servers unless explicitly requested.",
          metrics: ["1536-D Float32 Vector", "Gemini Nano Offline", "0.94 Cosine Precision"],
          snippetTag: "TENSOR // NPU PRIVATE",
          snippetText:
            "[0.842, -0.319, 0.674, 0.911 ... 1536 dims] · Entities: #SparseAttention #MemoryConsolidation",
        },
        {
          id: "graph",
          index: "PLANE 03",
          name: "Autonomous Synapse & SM-2 Recall",
          latency: "03 · Live Topology",
          title: "Bidirectional Graph & Retrieval Loop",
          description:
            "Matches new vectors against existing knowledge clusters via Cubic Bézier synapse edges and schedules adaptive SM-2 active recall cards before memory decays.",
          metrics: ["Autonomous Backlinks", "SM-2 Interval Engine", "Cloud Flash Synthesis"],
          snippetTag: "SYNAPSE // +2 BRIDGES",
          snippetText:
            "Linked -> [Hippocampal Replay Note] (0.91) · Linked -> [Transformer KV Cache Notes] (0.88) · Next recall: +4d",
        },
      ],
    },
    playground: {
      stageIndex: "STAGE 02 // LIVE SPATIAL THOUGHT-DROP PLAYGROUND",
      titleLine1: "Drop a raw thought.",
      titleAccent: "Watch synapses fire in real time.",
      subtitle:
        "Type a hypothesis or choose a sample research fragment below. Watch it land directly onto the coordinate canvas and weave live Cubic Bézier synapses with related notes.",
      inputPlaceholder: "Type a thought (e.g., How do WebGL shaders visualize high-dimensional vector clusters?)",
      dropButtonLabel: "Drop Thought ↵",
      resetButtonLabel: "Reset Board",
      presetsLabel: "Sample fragments:",
      activeMatchLabel: "Cosine Synapse Active",
      vectorStatusLabel: "On-Device Vector Match",
      presets: [
        {
          id: "preset-sleep",
          label: "Memory Consolidation",
          category: "NEUROSCIENCE",
          content: "Slow-wave sleep replays daytime firing sequences to compress ephemeral hippocampus buffers into neocortical graphs.",
          vectorPreview: "[0.91, 0.44, -0.28, 0.87]",
          targetIds: ["node-neuro", "node-sm2"],
          similarity: "0.94 Cosine Match",
        },
        {
          id: "preset-nano",
          label: "Private Local NPU",
          category: "LOCAL AI",
          content: "Running Gemini Nano in Chromium keeps journal triage inside local RAM at ~48ms without network roundtrips.",
          vectorPreview: "[0.79, -0.52, 0.88, 0.34]",
          targetIds: ["node-nano", "node-vector"],
          similarity: "0.92 Cosine Match",
        },
        {
          id: "preset-bezier",
          label: "Spatial Graph UI",
          category: "TOPOLOGY",
          content: "Spatial coordinate canvases reduce cognitive load by letting visual proximity encode semantic similarity.",
          vectorPreview: "[-0.31, 0.89, 0.64, 0.77]",
          targetIds: ["node-vector", "node-neuro"],
          similarity: "0.90 Cosine Match",
        },
        {
          id: "preset-flashcards",
          label: "Active Recall Spacing",
          category: "LEARNING",
          content: "Generating cloze prompts directly from annotated clips cuts review friction and keeps 90-day retention above 91%.",
          vectorPreview: "[0.68, 0.73, -0.19, 0.95]",
          targetIds: ["node-sm2", "node-nano"],
          similarity: "0.95 Cosine Match",
        },
      ],
      initialNodes: [
        {
          id: "node-nano",
          title: "Chrome Built-in Gemini Nano",
          tag: "LOCAL NPU // 48MS",
          coords: "X:110 · Y:084",
          snippet: "On-device entity extraction and tag inference inside IndexedDB without external API exposure.",
          x: 6,
          y: 10,
          tone: "cyan",
        },
        {
          id: "node-vector",
          title: "1536-Dim Semantic Space",
          tag: "EMBEDDING // COSINE",
          coords: "X:640 · Y:092",
          snippet: "Every paragraph becomes a dense vector point so forgotten notes surface when context aligns.",
          x: 61,
          y: 8,
          tone: "amber",
        },
        {
          id: "node-neuro",
          title: "Hippocampal Synaptic Replay",
          tag: "RESEARCH // COGNITION",
          coords: "X:135 · Y:410",
          snippet: "Sparse associative links outperform brittle nested folders across months of multi-topic reading.",
          x: 8,
          y: 57,
          tone: "slate",
        },
        {
          id: "node-sm2",
          title: "Leitner & SM-2 Interval Curve",
          tag: "RETRIEVAL // 92% RETENTION",
          coords: "X:620 · Y:430",
          snippet: "Adaptive testing schedules turn passive bookmarks into durable long-term working memory.",
          x: 60,
          y: 56,
          tone: "emerald",
        },
      ],
    },
    horizontalGallery: {
      stageIndex: "STAGE 03 // HORIZONTAL SPATIAL WORKFLOW GALLERY",
      titleLine1: "Four continuous stations.",
      titleAccent: "Zero folder friction.",
      scrollHint: "SCROLL TO TRAVERSE HORIZONTAL WORKFLOW →",
      stations: [
        {
          id: "station-capture",
          code: "01 // CAPTURE",
          title: "Instant DOM Web Clipper",
          accent: "& zero-hierarchy inbox.",
          description:
            "Clip any webpage, highlight paragraphs, or dictate spontaneous ideas straight from Chrome. Notes enter your spatial stream with exact metadata and clean Markdown.",
          videoSrc: "/braindrop-clipper.mp4",
          fallbackImage: "/dashboard-desktop-dark.png",
          imageAlt: "BrainDrop AI Capture and Workspace Dashboard",
          telemetry: ["Chrome Extension", "Clean Markdown", "IndexedDB Sync"],
          overlayTag: "INCOMING CLIP // 12ms",
          overlayMetric: "0 Folders Required",
          overlayNote: "\"Clipped passage auto-tagged with #NeuralIndexing & source provenance.\"",
          href: "/capture",
          cta: "Open Capture Console",
        },
        {
          id: "station-synthesize",
          code: "02 // SYNTHESIZE",
          title: "Hybrid Gemini Nano",
          accent: "& Cloud Flash fusion.",
          description:
            "Quick summarization runs instantaneously on local NPU weights. When tackling multi-paper literature reviews, escalate seamlessly to Gemini 3.8 Flash grounded strictly in your vault.",
          videoSrc: "/braindrop-synthesis.mp4",
          fallbackImage: "/chat-desktop-dark.png",
          imageAlt: "BrainDrop AI Hybrid Synthesis and Chat View",
          telemetry: ["~48ms Local Nano", "Gemini 3.8 Flash", "Citation Grounded"],
          overlayTag: "HYBRID ENGINE",
          overlayMetric: "48ms Local / 1M Cloud",
          overlayNote: "\"Synthesized 14 fragmented PDF highlights into 3 falsifiable hypotheses.\"",
          href: "/notes",
          cta: "Explore Workspace Notes",
        },
        {
          id: "station-connect",
          code: "03 // CONNECT",
          title: "Autonomous 1536-D",
          accent: "knowledge topology.",
          description:
            "Forget manual [[wikilink]] maintenance. Your second brain computes cosine proximity continuously—surfacing structural bridges across research collected weeks apart.",
          videoSrc: "/braindrop-graph.mp4",
          fallbackImage: "/topics-desktop-dark.png",
          imageAlt: "BrainDrop AI Autonomous Knowledge Graph Topics",
          telemetry: ["1536-D Embeddings", "Cluster Discovery", "Zero Manual Tagging"],
          overlayTag: "TOPOLOGY LINKER",
          overlayMetric: "0.94 Cosine Bridge",
          overlayNote: "\"Connected May neuroscience clip to today's Transformer attention note.\"",
          href: "/graph",
          cta: "Inspect Live Graph",
        },
        {
          id: "station-retain",
          code: "04 // RETAIN",
          title: "SM-2 Active Recall",
          accent: "& mastery telemetry.",
          description:
            "Insights evaporate without retrieval. Braindrop compiles high-signal vault passages into adaptive flashcards calibrated to your real-time forgetting curve.",
          videoSrc: "/braindrop-recall.mp4",
          fallbackImage: "/reflection-desktop-dark.png",
          imageAlt: "BrainDrop AI Active Recall Flashcards and Reflection",
          telemetry: ["SM-2 Algorithm", "Auto-Generated Cards", "90-Day Mastery"],
          overlayTag: "RETRIEVAL LOOP",
          overlayMetric: "92% Recall Rate",
          overlayNote: "\"4 cards scheduled right before synaptic decay threshold (t = +6d).\"",
          href: "/flashcards",
          cta: "Practice Flashcards",
        },
      ],
    },
    neuralGraph3D: {
      stageIndex: "STAGE 04 // INTERACTIVE 3D WEBGL KNOWLEDGE TOPOLOGY",
      titleLine1: "Navigate your living",
      titleAccent: "3D neural constellation.",
      subtitle:
        "Move your pointer to orbit the 3D shader field in real time. Select any semantic cluster to lock camera coordinates onto connected research nodes and inspect synthesized bridges.",
      allClustersLabel: "All Clusters (72 Nodes)",
      coherenceLabel: "Cluster Coherence",
      linkedNodesLabel: "High-Density Nodes",
      bridgeInsightLabel: "Synthesized Cross-Cluster Bridge",
      openGraphCta: "Launch Full 2D/3D Graph",
      clusters: [
        {
          id: 0,
          key: "npu",
          label: "01 · Local NPU Inference",
          nodeCount: "18 Nodes",
          coherence: "0.96 Coherence",
          centerTopic: "Private On-Device Gemini Nano",
          connectedNotes: [
            "Zero-Latency Draft Parsing (~48ms)",
            "IndexedDB Encrypted Local Store",
            "Chrome AI Prompt API Pipeline",
          ],
          insight:
            "Keeping exploratory drafts on local silicon cuts latency by 10x and keeps raw thoughts outside cloud training pipelines.",
        },
        {
          id: 1,
          key: "vectors",
          label: "02 · 1536-D Vector Space",
          nodeCount: "21 Nodes",
          coherence: "0.94 Coherence",
          centerTopic: "Dense Semantic Similarity Engine",
          connectedNotes: [
            "Cosine Distance Threshold (>0.82)",
            "Multi-Chunk Paragraph Indexing",
            "Cross-Language Conceptual Matching",
          ],
          insight:
            "Notes captured in Bahasa Indonesia and English automatically cluster together when underlying conceptual vectors align.",
        },
        {
          id: 2,
          key: "topology",
          label: "03 · Synapse Graph",
          nodeCount: "17 Nodes",
          coherence: "0.93 Coherence",
          centerTopic: "Autonomous Topic Clustering",
          connectedNotes: [
            "Hub Detection Across Research Arcs",
            "Temporal Decay & Freshness Weighting",
            "Cubic Bézier Visual Paths",
          ],
          insight:
            "Isolated bookmarks become structural bridges when cosine similarity links older literature clips to active hypotheses.",
        },
        {
          id: 3,
          key: "recall",
          label: "04 · SM-2 Active Recall",
          nodeCount: "16 Nodes",
          coherence: "0.95 Coherence",
          centerTopic: "Spaced Cognitive Consolidation",
          connectedNotes: [
            "Leitner Difficulty Calibration",
            "Source-Linked Cloze Prompts",
            "Forgetting Curve Inversion Telemetry",
          ],
          insight:
            "Converting dense highlights into 1-question active recall prompts preserves 92% conceptual accuracy after 90 days.",
        },
      ],
    },
    portalFooter: {
      stageIndex: "STAGE 05 // SPATIAL WORKSPACE PORTAL",
      manifestoQuote:
        "Folders bury your thinking. A living spatial canvas lets every captured fragment find its own neural constellation.",
      titleLine1: "Step inside your",
      titleAccent: "spatial second brain.",
      primaryCta: "Open Workspace",
      extensionCta: "Download Chrome Extension",
      secondaryCta: "Quick Capture",
      graphCta: "Knowledge Graph",
      cardsCta: "Study Cards",
      backToTop: "Return to Canvas Top",
      colophon: "BRAINDROP / AI · SPATIAL KNOWLEDGE ARCHITECTURE",
      disclosure:
        "Engineered with Chrome Built-in Gemini Nano, Gemini 3.8 Flash via Firebase AI Logic, WebGL/GLSL Shaders, GSAP ScrollTrigger & local IndexedDB vector topology.",
    },
  },
  id: {
    header: {
      subtitle: "Second brain hybrid · NPU Lokal & Cloud",
      launchWorkspace: "Buka workspace",
    },
    hud: {
      waypoints: [
        {
          index: 0,
          badge: "[WAYPOINT 00 // THE VOID]",
          headline: "Catat apa saja.",
          accent: "Jangan lupakan apa pun.",
          subtext:
            "Second brain hybrid yang mengutamakan privasi. Proses catatan pribadi langsung di perangkat dengan Gemini Nano, dan sintesis riset kompleks dengan kecerdasan cloud.",
        },
        {
          index: 1,
          badge: "[WAYPOINT 01 // INFERENSI NANO LOKAL]",
          headline: "Tangkap ide tanpa",
          accent: "hambatan.",
          subtext:
            "Tanpa hierarki folder rumit. Tanpa jeda jaringan. Gemini Nano lokal mengurai catatan riset mentah dalam ~48ms langsung di NPU perangkat Anda.",
        },
        {
          index: 2,
          badge: "[WAYPOINT 02 // PEMBENTUKAN TOPOLOGI]",
          headline: "Setiap gagasan saling",
          accent: "terhubung.",
          subtext:
            "Rasa ingin tahu Anda membentuk knowledge graph organik. Kutipan, konsep, dan makalah riset terkait tertaut otomatis lewat kedekatan neural.",
        },
        {
          index: 3,
          badge: "[WAYPOINT 03 // SINTESIS HYBRID MENDALAM]",
          headline: "Sintesis pola yang",
          accent: "tak terlihat.",
          subtext:
            "Saat riset membutuhkan pemahaman makroskopis, Gemini 3.8 Flash memadukan berbagai catatan terpisah menjadi tinjauan pustaka dan insight utuh.",
        },
        {
          index: 4,
          badge: "[WAYPOINT 04 // ACTIVE RECALL & HORIZON]",
          headline: "Jadikan ilmu Anda",
          accent: "melekat selamanya.",
          subtext:
            "Ubah bookmark sesaat menjadi jalur memori permanen lewat flashcard spaced retrieval dan latihan active recall.",
        },
      ],
      launchWorkspace: "Buka Workspace",
      quickCapture: "Catat Cepat",
      scrollCue: "GULIR UNTUK MENJELAJAHI WORKSPACE",
    },
    mobile: {
      quickCaptureNote: "Catatan Cepat",
      milestones: [
        {
          title: "Workspace Dashboard",
          meta: "Latensi ~48ms",
          description:
            "Tanpa folder bertumpuk. Gemini Nano lokal memproses catatan riset langsung di NPU perangkat Anda tanpa latensi jaringan.",
        },
        {
          title: "Autonomous Knowledge Graph",
          meta: "Vektor 1536-Dim",
          description:
            "Catatan membentuk graf pengetahuan organik. Konsep dan makalah riset terhubung otomatis berdasarkan kedekatan semantik.",
        },
        {
          title: "Sintesis AI Lintas Dokumen",
          meta: "Gemini 3.8 Flash",
          description:
            "Ketika riset butuh sudut pandang menyeluruh, Gemini 3.8 Flash menggabungkan beragam thread catatan menjadi sintesis utuh.",
        },
        {
          title: "Active Retrieval & Kartu Studi",
          meta: "Kurva Leitner",
          description:
            "Lawan kurva lupa dengan flashcard spaced retrieval dan active recall yang dibuat otomatis dari vault Anda.",
        },
      ],
    },
    explodedPipeline: {
      stageIndex: "STAGE 01 // ARSITEKTUR PIPELINE TERURAI",
      titleLine1: "Satu fragmen catatan.",
      titleLine2: "Tiga lapisan spasial",
      titleAccent: "sintesis neural.",
      subtitle:
        "Gulir atau pilih tiap bidang struktural untuk melihat bagaimana potongan web mentah terurai menjadi Markdown bersih, tensor vektor NPU lokal, dan jaringan sinapsis permanen.",
      focusAllLabel: "Urai Semua Lapisan",
      layers: [
        {
          id: "dom",
          index: "BIDANG 01",
          name: "DOM Clipper & Catatan Spasial",
          latency: "01 · 12ms Parse",
          title: "Ekstraksi Kutipan Presisi",
          description:
            "Membersihkan navigasi dan gangguan dari artikel, PDF, maupun pracetak riset sambil menjaga tautan sumber dan koordinat spasial di IndexedDB.",
          metrics: ["Markdown AST Bersih", "Nol Piksel Pelacak", "Jangkar URL Sumber"],
          snippetTag: "TANGKAPAN MENTAH // 22:14",
          snippetText:
            "\"Attention heads beradaptasi menjadi pelacak sintaksis lokal sekaligus jembatan semantik jarak jauh saat continual pretraining.\"",
        },
        {
          id: "vector",
          index: "BIDANG 02",
          name: "NPU Lokal & Embedding 1536-D",
          latency: "02 · ~48ms NPU Lokal",
          title: "Proyeksi Tensor Semantik",
          description:
            "Gemini Nano bawaan Chrome mengekstrak entitas, kata kunci, dan intensi secara offline di perangkat Anda—nol kebocoran draf pribadi ke server luar.",
          metrics: ["Vektor Float32 1536-D", "Gemini Nano Offline", "Presisi Cosine 0.94"],
          snippetTag: "TENSOR // NPU PRIVAT",
          snippetText:
            "[0.842, -0.319, 0.674, 0.911 ... 1536 dim] · Entitas: #SparseAttention #MemoryConsolidation",
        },
        {
          id: "graph",
          index: "BIDANG 03",
          name: "Sinapsis Otonom & Recall SM-2",
          latency: "03 · Topologi Aktif",
          title: "Graf Dua Arah & Loop Memori",
          description:
            "Memetakan vektor baru ke klaster pengetahuan lewat jalur sinapsis Cubic Bézier sekaligus menjadwalkan kartu active recall SM-2 sebelum ingatan memudar.",
          metrics: ["Backlink Otonom", "Mesin Interval SM-2", "Sintesis Cloud Flash"],
          snippetTag: "SINAPSIS // +2 JEMBATAN",
          snippetText:
            "Terhubung -> [Catatan Replay Hipokampus] (0.91) · Terhubung -> [KV Cache Transformer] (0.88) · Recall: +4h",
        },
      ],
    },
    playground: {
      stageIndex: "STAGE 02 // PLAYGROUND CATATAN SPASIAL REAL-TIME",
      titleLine1: "Jatuhkan satu gagasan.",
      titleAccent: "Lihat sinapsis menyala seketika.",
      subtitle:
        "Ketik hipotesis Anda sendiri atau pilih fragmen riset contoh. Catatan akan mendarat di kanvas koordinat dan menenun garis sinapsis Cubic Bézier secara langsung.",
      inputPlaceholder: "Ketik gagasan baru (mis. Bagaimana shader WebGL memvisualkan klaster vektor 1536-dimensi?)",
      dropButtonLabel: "Jatuhkan Catatan ↵",
      resetButtonLabel: "Reset Kanvas",
      presetsLabel: "Contoh fragmen:",
      activeMatchLabel: "Sinapsis Cosine Aktif",
      vectorStatusLabel: "Pencocokan Vektor Lokal",
      presets: [
        {
          id: "preset-sleep",
          label: "Konsolidasi Memori",
          category: "NEUROSAINS",
          content: "Tidur gelombang lambat memutar ulang pola aktivasi siang hari untuk mengompresi memori hipokampus menjadi graf neokorteks.",
          vectorPreview: "[0.91, 0.44, -0.28, 0.87]",
          targetIds: ["node-neuro", "node-sm2"],
          similarity: "0.94 Kecocokan Cosine",
        },
        {
          id: "preset-nano",
          label: "NPU Lokal Privat",
          category: "AI LOKAL",
          content: "Menjalankan Gemini Nano di Chromium menjaga pemilahan catatan di RAM perangkat ~48ms tanpa pulang-pergi jaringan.",
          vectorPreview: "[0.79, -0.52, 0.88, 0.34]",
          targetIds: ["node-nano", "node-vector"],
          similarity: "0.92 Kecocokan Cosine",
        },
        {
          id: "preset-bezier",
          label: "UI Graf Spasial",
          category: "TOPOLOGI",
          content: "Kanvas koordinat spasial memangkas beban kognitif karena jarak visual langsung mewakili kedekatan semantik antar catatan.",
          vectorPreview: "[-0.31, 0.89, 0.64, 0.77]",
          targetIds: ["node-vector", "node-neuro"],
          similarity: "0.90 Kecocokan Cosine",
        },
        {
          id: "preset-flashcards",
          label: "Jeda Active Recall",
          category: "PEMBELAJARAN",
          content: "Membuat pertanyaan cloze langsung dari kutipan beranotasi menekan friksi review dan menjaga retensi 90 hari di atas 91%.",
          vectorPreview: "[0.68, 0.73, -0.19, 0.95]",
          targetIds: ["node-sm2", "node-nano"],
          similarity: "0.95 Kecocokan Cosine",
        },
      ],
      initialNodes: [
        {
          id: "node-nano",
          title: "Gemini Nano Bawaan Chrome",
          tag: "NPU LOKAL // 48MS",
          coords: "X:110 · Y:084",
          snippet: "Ekstraksi entitas dan inferensi topik di perangkat dalam IndexedDB tanpa mengirim draf mentah ke luar.",
          x: 6,
          y: 10,
          tone: "cyan",
        },
        {
          id: "node-vector",
          title: "Ruang Semantik 1536-Dim",
          tag: "EMBEDDING // COSINE",
          coords: "X:640 · Y:092",
          snippet: "Setiap paragraf berubah menjadi titik vektor padat agar catatan lama muncul kembali saat konteks cocok.",
          x: 61,
          y: 8,
          tone: "amber",
        },
        {
          id: "node-neuro",
          title: "Replay Sinapsis Hipokampus",
          tag: "RISET // KOGNISI",
          coords: "X:135 · Y:410",
          snippet: "Tautan asosiatif mengungguli folder bertingkat kaku saat riset berlangsung lintas bulan dan disiplin.",
          x: 8,
          y: 57,
          tone: "slate",
        },
        {
          id: "node-sm2",
          title: "Kurva Interval Leitner & SM-2",
          tag: "RETRIEVAL // RETENSI 92%",
          coords: "X:620 · Y:430",
          snippet: "Jadwal uji aktif mengubah bookmark pasif menjadi memori kerja jangka panjang yang tahan lupa.",
          x: 60,
          y: 56,
          tone: "emerald",
        },
      ],
    },
    horizontalGallery: {
      stageIndex: "STAGE 03 // GALERI ALUR KERJA SPASIAL HORIZONTAL",
      titleLine1: "Empat stasiun berkesinambungan.",
      titleAccent: "Nol friksi folder.",
      scrollHint: "GULIR UNTUK MENJELAJAHI ALUR HORIZONTAL →",
      stations: [
        {
          id: "station-capture",
          code: "01 // TANGKAP",
          title: "DOM Web Clipper Instan",
          accent: "& inbox tanpa hierarki.",
          description:
            "Simpan halaman web, sorot paragraf penting, atau rekam ide spontan langsung dari Chrome. Catatan mendarat di aliran spasial sebagai Markdown bersih.",
          videoSrc: "/braindrop-clipper.mp4",
          fallbackImage: "/dashboard-desktop-dark.png",
          imageAlt: "Dasbor Capture & Workspace BrainDrop AI",
          telemetry: ["Ekstensi Chrome", "Markdown Bersih", "Sinkron IndexedDB"],
          overlayTag: "TANGKAPAN MASUK // 12ms",
          overlayMetric: "0 Folder Diperlukan",
          overlayNote: "\"Kutipan ditandai otomatis dengan #NeuralIndexing dan URL asli.\"",
          href: "/capture",
          cta: "Buka Konsol Capture",
        },
        {
          id: "station-synthesize",
          code: "02 // SINTESIS",
          title: "Fusi Hybrid Gemini Nano",
          accent: "& Cloud Flash.",
          description:
            "Ringkasan instan berjalan di NPU lokal Anda. Untuk sintesis lintas puluhan makalah riset, eskalasikan ke Gemini 3.8 Flash yang berdasar penuh pada isi vault.",
          videoSrc: "/braindrop-synthesis.mp4",
          fallbackImage: "/chat-desktop-dark.png",
          imageAlt: "Tampilan Sintesis AI Hybrid BrainDrop AI",
          telemetry: ["~48ms Nano Lokal", "Gemini 3.8 Flash", "Berbasis Sitasi"],
          overlayTag: "MESIN HYBRID",
          overlayMetric: "48ms Lokal / 1M Cloud",
          overlayNote: "\"Merangkum 14 sorotan PDF terpisah menjadi 3 hipotesis riset utuh.\"",
          href: "/notes",
          cta: "Jelajahi Catatan",
        },
        {
          id: "station-connect",
          code: "03 // HUBUNGKAN",
          title: "Topologi Pengetahuan",
          accent: "vektor 1536-D otonom.",
          description:
            "Lupakan pembuatan [[wikilink]] manual. Second brain Anda terus menghitung kedekatan cosine—menemukan jembatan konsep lintas riset berminggu-minggu lalu.",
          videoSrc: "/braindrop-graph.mp4",
          fallbackImage: "/topics-desktop-dark.png",
          imageAlt: "Graf Topik Pengetahuan Otonom BrainDrop AI",
          telemetry: ["Embedding 1536-D", "Deteksi Klaster", "Nol Tag Manual"],
          overlayTag: "PENAUT TOPOLOGI",
          overlayMetric: "Jembatan Cosine 0.94",
          overlayNote: "\"Menautkan catatan neurosains Mei lalu dengan catatan Attention hari ini.\"",
          href: "/graph",
          cta: "Lihat Graf Pengetahuan",
        },
        {
          id: "station-retain",
          code: "04 // PERTAHANKAN",
          title: "Active Recall SM-2",
          accent: "& telemetri penguasaan.",
          description:
            "Insight menguap tanpa pengujian balik. Braindrop menyusun kutipan vault bernilai tinggi menjadi flashcard adaptif mengikuti kurva lupa Anda secara nyata.",
          videoSrc: "/braindrop-recall.mp4",
          fallbackImage: "/reflection-desktop-dark.png",
          imageAlt: "Flashcard Active Recall & Refleksi BrainDrop AI",
          telemetry: ["Algoritme SM-2", "Kartu Otomatis", "Retensi 90-Hari"],
          overlayTag: "LOOP RETRIEVAL",
          overlayMetric: "Tingkat Ingat 92%",
          overlayNote: "\"4 kartu dijadwalkan tepat sebelum ambang peluruhan sinapsis (t = +6h).\"",
          href: "/flashcards",
          cta: "Latih Flashcard",
        },
      ],
    },
    neuralGraph3D: {
      stageIndex: "STAGE 04 // TOPOLOGI PENGETAHUAN WEBGL 3D INTERAKTIF",
      titleLine1: "Jelajahi konstelasi",
      titleAccent: "neural 3D Anda.",
      subtitle:
        "Gerakkan kursor untuk mengorbit shader 3D secara real time. Klik klaster semantik untuk mengunci kamera ke simpul riset terkait dan membaca sintesis jembatannya.",
      allClustersLabel: "Semua Klaster (72 Simpul)",
      coherenceLabel: "Koherensi Klaster",
      linkedNodesLabel: "Simpul Padat Terkait",
      bridgeInsightLabel: "Sintesis Jembatan Lintas Klaster",
      openGraphCta: "Buka Graf 2D/3D Lengkap",
      clusters: [
        {
          id: 0,
          key: "npu",
          label: "01 · Inferensi NPU Lokal",
          nodeCount: "18 Simpul",
          coherence: "Koherensi 0.96",
          centerTopic: "Gemini Nano Privat di Perangkat",
          connectedNotes: [
            "Parsing Draf Tanpa Jeda (~48ms)",
            "Penyimpanan Lokal IndexedDB Terenkripsi",
            "Pipeline Chrome AI Prompt API",
          ],
          insight:
            "Memproses draf eksploratif langsung di silikon lokal memangkas latensi 10x dan menjaga pikiran mentah keluar dari pipeline cloud.",
        },
        {
          id: 1,
          key: "vectors",
          label: "02 · Ruang Vektor 1536-D",
          nodeCount: "21 Simpul",
          coherence: "Koherensi 0.94",
          centerTopic: "Mesin Kedekatan Semantik Padat",
          connectedNotes: [
            "Ambang Jarak Cosine (>0.82)",
            "Pengindeksan Paragraf Multi-Chunk",
            "Pencocokan Konsep Lintas Bahasa",
          ],
          insight:
            "Catatan berbahasa Indonesia dan Inggris berkumpul otomatis dalam klaster yang sama begitu vektor konseptualnya sejajar.",
        },
        {
          id: 2,
          key: "topology",
          label: "03 · Graf Sinapsis",
          nodeCount: "17 Simpul",
          coherence: "Koherensi 0.93",
          centerTopic: "Klasterisasi Topik Otonom",
          connectedNotes: [
            "Deteksi Hub Lintas Arsip Riset",
            "Pembobotan Kebaruan & Peluruhan",
            "Jalur Visual Cubic Bézier",
          ],
          insight:
            "Bookmark terpisah menjelma menjadi jembatan struktural saat kesamaan cosine menautkan literatur lama ke hipotesis aktif.",
        },
        {
          id: 3,
          key: "recall",
          label: "04 · Active Recall SM-2",
          nodeCount: "16 Simpul",
          coherence: "Koherensi 0.95",
          centerTopic: "Konsolidasi Kognitif Berjarak",
          connectedNotes: [
            "Kalibrasi Kesulitan Leitner",
            "Pertanyaan Cloze Terikat Sumber",
            "Telemetri Pembalikan Kurva Lupa",
          ],
          insight:
            "Mengubah sorotan padat menjadi 1 pertanyaan active recall menjaga akurasi konsep hingga 92% setelah 90 hari.",
        },
      ],
    },
    portalFooter: {
      stageIndex: "STAGE 05 // PORTAL WORKSPACE SPASIAL",
      manifestoQuote:
        "Folder hanya mengubur cara berpikir Anda. Kanvas spasial yang hidup membiarkan setiap fragmen menemukan konstelasi neuralnya sendiri.",
      titleLine1: "Masuk ke dalam",
      titleAccent: "second brain spasial Anda.",
      primaryCta: "Buka Workspace",
      extensionCta: "Unduh Ekstensi Chrome",
      secondaryCta: "Catat Cepat",
      graphCta: "Knowledge Graph",
      cardsCta: "Kartu Studi",
      backToTop: "Kembali ke Puncak Kanvas",
      colophon: "BRAINDROP / AI · ARSITEKTUR PENGETAHUAN SPASIAL",
      disclosure:
        "Dibangun dengan Chrome Built-in Gemini Nano, Gemini 3.8 Flash via Firebase AI Logic, WebGL/GLSL Shaders, GSAP ScrollTrigger & topologi vektor IndexedDB lokal.",
    },
  },
};
