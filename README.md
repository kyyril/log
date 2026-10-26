# Chronicles けっさく

[![Production Deployment](https://img.shields.io/badge/Deployment-Vercel-success?style=flat-square&logo=vercel)](https://chronicles.vexr.dev)
[![Svelte](https://img.shields.io/badge/Framework-Svelte-orange?style=flat-square&logo=svelte)](https://svelte.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

Chronicles is a minimalist personal tracking web application featuring a dark-themed user interface. It serves as a centralized daily documentation hub to monitor media consumption status (such as manga, anime, or books), played games, and personal notes.

Live Preview: [chronicles.vexr.dev](https://chronicles.vexr.dev)

---

## Core Features

- **Game & Media Tracking:** Integrated with external databases to record game progress and entertainment media in real-time.
- **Personal Notes:** Provides a structured space to store notes, ideas, or daily journals.
- **Clean & Dark UI:** A modern, eye-friendly interface utilizing a dark color palette with smooth transition effects.
- **Immersive Experience:** Includes background audio playback features to accompany your productivity or logging sessions.

---

## Tech Stack

This application is built using a high-performance modern technology stack:

- **Frontend Framework:** [Svelte](https://svelte.dev) (Reactive, fast, and minimal runtime overhead)
- **Language:** [TypeScript](https://www.typescriptlang.org) (For type safety and code scalability)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) (Flexible and fast utility-first CSS)
- **Build Tool:** [Vite](https://vitejs.dev) (Fast bundling and development server setup)
- **Deployment & API:** [Vercel](https://vercel.com) (Modern hosting platform with Serverless Functions support)

---

## Project Structure

```text
log/
├── api/                   # Serverless functions / backend API integrations
├── public/                # Static assets (fonts, audio, images, favicon)
├── src/                   # Main source code (Svelte components, logic, styles)
│   ├── components/        # Modular UI components
│   ├── routes/            # Application routing system
│   └── ...
├── tailwind.config.js     # Tailwind CSS configuration
├── vercel.json            # Vercel deployment and rewrite configuration
└── vite.config.ts         # Vite build and proxy configuration
