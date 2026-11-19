# Ringkasan Lengkap & Panduan Eksekusi: Google #BuildHybridAI 2026

Dokumen ini merangkum seluruh informasi resmi, aturan kompetisi (*Official Rules*), persyaratan teknis, kriteria penilaian, dan checklist *deliverables* dari kompetisi **Google #BuildHybridAI 2026** yang diselenggarakan melalui Devpost.

---

## 1. Informasi Utama & Jadwal Kritis

| Parameter | Keterangan Resmi | Catatan Penting |
| :--- | :--- | :--- |
| **Penyelenggara** | **Google LLC** (Dikelola oleh Devpost, Inc.) | Kompetisi resmi tingkat global |
| **Total Hadiah** | **$30,000 USD** (Tunai) + Publikasi Resmi | Ada kategori khusus Web/Chrome ($3,000) |
| **Deadline Pengumpulan** | **1 Desember 2026 @ 05:00 AM GMT+7** | (Setara 30 November 2026 @ 02:00 PM PT) |
| **Sisa Waktu** | **18 Hari** (Terhitung per 13 November 2026) | - |
| **Periode Penjurian** | 10 – 16 Desember 2026 (PT) | Evaluasi 2 tahap (Viabilitas & Skor 1-5) |
| **Pengumuman Pemenang**| ~21 Desember 2026 (12:00 PM PT) | Pengumuman di situs Devpost & media sosial |
| **Format Partisipasi** | Individu atau Tim | Diperbolehkan submit lebih dari 1 proyek unik |

---

## 2. Persyaratan Teknis Wajib (What to Build)

Aplikasi yang dibangun harus berupa **Aplikasi Gen AI Hybrid** yang berjalan di *on-device* dan *cloud* menggunakan **Firebase AI Logic**:

1. **Wajib Memilih Minimal 1 Platform:**
   * **Web (Chrome):** Integrasi model **Gemini Nano 4** via Firebase AI Logic. Bentuk aplikasi bisa berupa **Web Application** atau **Chrome Extension**. *(Platform yang kita pilih)*.
   * **Android:** Gemini Nano 4 via Firebase AI Logic.
   * **iOS:** Apple Foundation Models API via Firebase AI Logic.
2. **Kewajiban Firebase App Check:**
   * Firebase AI Logic **wajib menggunakan App Check**.
   * *Debug tokens* **resmi diizinkan** untuk keperluan pengujian dan penjurian (*evaluators*).
3. **Produk Firebase Pendukung yang Dianjurkan:**
   * **Remote Config** (untuk kontrol routing dan kebijakan model).
   * **Cloud Firestore** (database dan log audit).
   * **Firebase Authentication** (manajemen identitas pengguna).
4. **Verifikasi Runtime (Bukan Sekadar Nama):**
   * Kode repository harus membuktikan penggunaan Firebase AI Logic saat aplikasi berjalan (*imported and actually called at runtime*), bukan cuma ditulis di file README.

---

## 3. Syarat Wajib Submission (Deliverables)

Setiap pengumpulan (*submission*) di Devpost **wajib melengkapi 4 komponen utama**:

### A. Tautan Repositori Publik (GitHub / GitLab)
* Repositori harus **Publik**.
* Wajib menyertakan file **Open Source License** yang terdeteksi di bagian *About* repositori (Disarankan lisensi **Apache License 2.0**).
* Berisi seluruh source code, asset, dan panduan menjalankan aplikasi secara mandiri.
* **Dilarang keras menyertakan:** API Key produksi, kredensial cloud aktif, data komersial rahasia, atau data pribadi (PII).

### B. Tautan Aplikasi Berfungsi (Working Demo / Hosted URL)
* Sangat dianjurkan menyediakan URL web aktif yang sudah di-deploy (misal: di Vercel atau Firebase Hosting) agar juri dan recruiter bisa langsung menguji tanpa install lokal.
* Jika ada autentikasi, sediakan akun demo / instruksi login gratis tanpa hambatan.

### C. Video Demonstrasi (YouTube) — Maksimal 3 Menit
* **Durasi Maksimal:** **3 Menit (180 detik)**. Juri hanya akan menilai 3 menit pertama jika durasi melebihi.
* **Platform:** Wajib diunggah ke YouTube secara publik (*Public*) atau tidak terdaftar (*Unlisted*).
* **Bahasa:** Wajib berbahasa Inggris atau menyertakan subtitel bahasa Inggris (*English subtitles*).
* **Konten:** Wajib memperlihatkan rekaman layar aplikasi yang benar-benar berfungsi di platform terkait.

### D. Deskripsi Teks Lengkap (Devpost Form)
* Rangkuman fitur, fungsi, dan *value proposition* (nilai guna) proyek.
* Penjelasan teknis detail mengenai bagaimana **Firebase AI Logic** digunakan di sisi *on-device* dan *cloud*.
* Jika memperbarui proyek lama, wajib menjelaskan secara spesifik apa saja fitur baru yang dibangun selama periode hackathon.

---

## 4. Kriteria Penilaian Juri (Bobot Setara 1 – 5 per Kriteria)

Penjurian dilakukan dalam 2 tahap:
* **Stage One (Pass/Fail):** Verifikasi kelengkapan berkas, pemenuhan syarat dasar, dan fungsi aplikasi.
* **Stage Two (Skor Rata-rata 1–5):**
  1. **Technological Implementation:** Seberapa baik proyek dibangun, dan seberapa efektif penggunaan *Firebase AI Logic hybrid inference* sebagai bagian dari solusi?
  2. **Design:** Apakah proyek memberikan pengalaman produk (*UX/UI*) yang utuh dan koheren, bukan sekadar *proof of concept* mentah?
  3. **Potential Impact:** Apakah proyek memberikan solusi nyata dan terbukti kredibel bagi target audiens tertentu berdasarkan demo yang disajikan?
  4. **Quality of the Idea:** Apakah ide ini kreatif, tidak klise/non-obvious dalam memanfaatkan Firebase AI Logic, dan memperlihatkan pemahaman mendalam tentang domain masalahnya?

---

## 5. Rincian Hadiah Resmi ($30,000 Total)

| Kategori Juara | Nominal Uang | Pengakuan Tambahan | Jumlah Pemenang |
| :--- | :---: | :--- | :---: |
| **Grand Prize Winner** | **$10,000** | Wawancara Resmi + Featured Blog Post + Social Media Mention | 1 Pemenang |
| **1st Runner Up** | **$7,000** | Featured Blog Post + Social Media Mention | 1 Pemenang |
| **2nd Runner Up** | **$4,000** | Social Media Mention | 1 Pemenang |
| **Best Web / Chrome App** | **$3,000** | Social Media Mention | 1 Pemenang |
| **Best Android App** | **$3,000** | Social Media Mention | 1 Pemenang |
| **Best iOS App** | **$3,000** | Social Media Mention | 1 Pemenang |

*Catatan: Satu submission berkesempatan memenangkan Grand Prize sekaligus salah satu kategori "Best of".*

---

## 6. Hak Kekayaan Intelektual (IP) & Legalitas

* **Kepemilikan Penuh Milik Peserta:** Seluruh kode dan hak cipta karya intelektual tetap 100% milik Anda (*entrant retains ownership*).
* **Lisensi untuk Google & Devpost:** Peserta hanya memberikan lisensi terbatas kepada Google untuk mengevaluasi, membuat cuplikan promosi (screenshot/klip video), dan menampilkan proyek di situs web/blog resmi.
* **Kewarganegaraan / Kelayakan:** Terbuka untuk seluruh dunia kecuali wilayah yang terkena sanksi/embargo AS (Indonesia sah dan memenuhi syarat 100%).

---

## 7. Fasilitas Tambahan: Google Account Quota (Opsional)

Google menyediakan akun kuota sementara (aktif selama 4 hari) jika aplikasi memerlukan akses model tingkat lanjut berbayar (seperti image generation via Firebase AI Logic).
* **Jadwal Sprint Permintaan Kuota:**
  * Sprint 2: Permintaan maksimal Rabu, 18 Nov (10:00 AM PT) -> Akun dikirim Kamis, 19 Nov.
  * Sprint 3 (Final): Permintaan maksimal Rabu, 25 Nov (10:00 AM PT) -> Akun dikirim Jumat, 27 Nov.
* *(Catatan: Inferensi teks standar dengan Gemini Nano dan Firebase AI Logic sudah gratis di free tier, sehingga pengajuan kuota ini opsional).*

---

## 8. Checklist Eksekusi Portofolio (Agar Nilai Sempurna)

Gunakan checklist ini untuk memastikan submission Anda tidak hanya lolos seleksi juri, tetapi juga menjadi portofolio kelas dunia di GitHub:

- [ ] **Repositori Publik:** Ada file `LICENSE` (Apache-2.0) di root repositori.
- [ ] **Runtime Call:** Ada pemanggilan nyata `import { getAI, getGenerativeModel } from "firebase/ai"` di kode sumber.
- [ ] **App Check Terpasang:** ReCAPTCHA Enterprise terpasang untuk live, dan debug token aktif untuk pengujian juri.
- [ ] **Dual Deployment:** Aplikasi web ter-deploy di Vercel/Firebase Hosting, dan folder ekstensi siap di-load di Chrome.
- [ ] **Video Demo YouTube <= 3 Menit:** Format 16:9, audio jelas, teks/subtitle bahasa Inggris, menunjukkan alur on-device vs cloud live.
- [ ] **Dokumentasi Lengkap:** README menyertakan diagram arsitektur, panduan testing flags Chrome, dan badge CI Actions.
- [ ] **Bebas Secret Bocor:** File `.env.local` dan API key privat tidak pernah ter-commit ke Git.

