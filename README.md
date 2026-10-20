# Personal Log

[![Production Deployment](https://img.shields.io/badge/Deployment-Vercel-success?style=flat-square&logo=vercel)](https://logkiril.vercel.app)
[![Svelte](https://img.shields.io/badge/Framework-Svelte-orange?style=flat-square&logo=svelte)](https://svelte.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

Personal Log adalah aplikasi web pelacakan pribadi yang dirancang secara minimalis dengan antarmuka bertema gelap. Aplikasi ini berfungsi sebagai pusat dokumentasi harian untuk memantau status media yang dikonsumsi (seperti manga, anime, atau buku), daftar game yang dimainkan, serta catatan personal.

Live Preview: [logkiril.vercel.app](https://logkiril.vercel.app)

---

## Fitur Utama

- **Game & Media Tracking:** Terintegrasi dengan basis data eksternal untuk mencatat progres game dan media hiburan secara real-time.
- **Catatan Personal:** Menyediakan ruang terstruktur untuk menyimpan catatan, ide, atau jurnal harian.
- **Clean & Dark UI:** Antarmuka modern yang ramah di mata menggunakan palet warna gelap dengan efek transisi yang halus.
- **Immersive Experience:** Dilengkapi fitur pemutaran audio latar belakang untuk menemani sesi produktivitas atau pencatatan Anda.

---

## Tech Stack

Aplikasi ini dibangun menggunakan tumpukan teknologi modern berperforma tinggi:

- **Frontend Framework:** [Svelte](https://svelte.dev) (Reaktif, cepat, dan minim overhead runtime)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org) (Untuk keamanan tipe data dan skalabilitas kode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) (Utilitas CSS yang fleksibel dan cepat)
- **Build Tool:** [Vite](https://vitejs.dev) (Proses bundling dan development server yang cepat)
- **Deployment & API:** [Vercel](https://vercel.com) (Hosting modern dengan dukungan Serverless Functions)

---

## Struktur Proyek

```text
log/
├── api/                   # Serverless functions / integrasi backend API
├── public/                # Aset statis (font, audio, gambar, favicon)
├── src/                   # Kode sumber utama aplikasi (komponen Svelte, logika, gaya)
│   ├── components/        # Komponen UI modular
│   ├── routes/            # Sistem routing aplikasi
│   └── ...
├── tailwind.config.js     # Konfigurasi Tailwind CSS
├── vercel.json            # Konfigurasi deployment & rewrite Vercel
└── vite.config.ts         # Konfigurasi build dan proxy Vite
