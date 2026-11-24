import type { Locale } from "./landing-i18n";

export interface ChaptersCopy {
  introCaption: string;
  hud: string[];
  clipper: {
    title: string;
    hint: string;
    sentences: string[];
    autoIndex: number;
    vaultEmpty: string;
    vaultSaved: string;
    source: string;
    tags: string[];
    download: string;
  };
  index: {
    title: string;
    hint: string;
    items: { name: string; line: string; href: string }[];
  };
  closing: {
    cta: string;
    ctaHref: string;
    links: { label: string; href: string; download?: boolean }[];
    legal: string;
    author: string;
    backToTop: string;
  };
}

export const V2_CHAPTERS: Record<Locale, ChaptersCopy> = {
  en: {
    introCaption: "Local-first second brain",
    hud: ["Story", "Workspace", "Privacy", "Clipper", "Index", "Close"],
    clipper: {
      title: "Highlight anywhere. Catch it in one click.",
      hint: "Select a sentence, or tap one, to clip it.",
      sentences: [
        "Research falls apart when a good highlight is copied into a blank page and forgets where it came from.",
        "A quiet tool keeps the source, the title, and the moment attached to every sentence you save.",
        "Select any sentence. It falls into your vault, and the page remembers it for you.",
      ],
      autoIndex: 1,
      vaultEmpty: "Your vault is empty. Clip a sentence above.",
      vaultSaved: "Saved to vault",
      source: "research.google",
      tags: ["research", "on-device", "privacy"],
      download: "Get the Chrome extension (.zip)",
    },
    index: {
      title: "Five places to think.",
      hint: "Hover a title",
      items: [
        { name: "Capture", line: "Web passages, links, and voice notes.", href: "/capture" },
        { name: "Notes", line: "A calm editor with local summaries.", href: "/notes" },
        { name: "Knowledge Graph", line: "Notes that find each other.", href: "/graph" },
        { name: "Flashcards", line: "Review right before you forget.", href: "/flashcards" },
        { name: "Dashboard", line: "What ran on your device, and how fast.", href: "/dashboard" },
      ],
    },
    closing: {
      cta: "Open BrainDrop →",
      ctaHref: "/notes",
      links: [
        { label: "Capture", href: "/capture" },
        { label: "Notes", href: "/notes" },
        { label: "Graph", href: "/graph" },
        { label: "Flashcards", href: "/flashcards" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Chrome extension (.zip)", href: "/braindrop-extension.zip", download: true },
        { label: "Spatial view", href: "/" },
      ],
      legal: "Open source under Apache 2.0",
      author: "By Tino Nurcahya",
      backToTop: "Back to the beginning",
    },
  },
  id: {
    introCaption: "Otak kedua di perangkatmu",
    hud: ["Cerita", "Workspace", "Privasi", "Clipper", "Index", "Penutup"],
    clipper: {
      title: "Sorot di mana saja. Tangkap sekali klik.",
      hint: "Blok atau ketuk satu kalimat untuk menyimpannya.",
      sentences: [
        "Riset berantakan ketika sorotan yang bagus disalin ke halaman kosong dan lupa dari mana asalnya.",
        "Alat yang tenang menjaga sumber, judul, dan momen tetap menempel pada setiap kalimat yang kamu simpan.",
        "Pilih kalimat mana pun. Ia jatuh ke vault, dan halaman ini mengingatnya untukmu.",
      ],
      autoIndex: 1,
      vaultEmpty: "Vault masih kosong. Simpan satu kalimat di atas.",
      vaultSaved: "Tersimpan di vault",
      source: "research.google",
      tags: ["riset", "lokal", "privasi"],
      download: "Unduh ekstensi Chrome (.zip)",
    },
    index: {
      title: "Lima tempat untuk berpikir.",
      hint: "Arahkan ke judul",
      items: [
        { name: "Capture", line: "Kutipan web, tautan, dan catatan suara.", href: "/capture" },
        { name: "Notes", line: "Editor tenang dengan ringkasan lokal.", href: "/notes" },
        { name: "Knowledge Graph", line: "Catatan yang saling menemukan.", href: "/graph" },
        { name: "Flashcards", line: "Ulas tepat sebelum terlupa.", href: "/flashcards" },
        { name: "Dashboard", line: "Apa yang berjalan di perangkatmu, dan secepat apa.", href: "/dashboard" },
      ],
    },
    closing: {
      cta: "Buka BrainDrop →",
      ctaHref: "/notes",
      links: [
        { label: "Capture", href: "/capture" },
        { label: "Notes", href: "/notes" },
        { label: "Graph", href: "/graph" },
        { label: "Flashcards", href: "/flashcards" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Ekstensi Chrome (.zip)", href: "/braindrop-extension.zip", download: true },
        { label: "Tampilan spatial", href: "/" },
      ],
      legal: "Kode terbuka berlisensi Apache 2.0",
      author: "Oleh Tino Nurcahya",
      backToTop: "Kembali ke awal",
    },
  },
};
