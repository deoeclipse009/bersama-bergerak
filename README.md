# Bersama Bergerak — website

A static, multi-page website for **Bersama Bergerak** (Movement & Active Living Initiative) and the **Run Safe Playground** (Bersama Bergerak × ADEM) at UGM Trail Run 2026.

No build step: open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, Vercel).

## Languages

- **Bahasa Indonesia (main):** the root folder (`index.html`, `about.html`, …).
- **English:** the same pages inside `en/` (`en/index.html`, …).


## Pages

| File | Purpose |
|---|---|
| `index.html` | Home: Bersama Bergerak helps people start a healthy, active lifestyle and keep it sustainable (not only for runners); why running safely matters; booth activities |
| `about.html` | Who we are, Feel → Think → Decide, principles, ADEM partnership |
| `run-safe-playground.html` | The booth concept: zones, Runner Decision Test, CPR Battle, mini stage, Run Crew Ready, booth layouts |
| `schedule.html` | Where and when: 25–27 Sept 2026, GIK and Race Village |
| `runner-reset-guide.html` | QR landing page: the Runner Reset booklet (sections 01–10, with tick-able checklists and a printable signal log), plus the 1-Minute Runner Check and Runner Decision Test |
| `work-with-us.html` | "Bring this to your community" + short lead form |

## Before the event

- **QR code:** point the booth QR at `runner-reset-guide.html` (Indonesian) once the site is hosted.
- **Lead form:** sends to WhatsApp 0896-2760-9295 (`data-whatsapp="6289627609295"` in `work-with-us.html` and `en/work-with-us.html`). It opens WhatsApp with the visitor's answers pre-filled; nothing is stored on the site.

## Design

- **Logo:** `assets/img/logo.png` (full logo, transparent) and `assets/img/logo-mark.png` (icon, used in the header, footer and browser tab). The original is `assets/img/bersama-bergerak-logo.jpg`.
- **Colours** come from the logo: navy `#13265a`, blues `#1f63c4` / `#2f7fe6`, with coral and green for data highlights.
- **Style:** calm, minimal layout: soft light-blue hero, floating pill navigation, rounded cards with soft shadows, dark icon badges and pill buttons.
- **Fonts** are self-hosted in `assets/fonts/` (Inter Tight for headings, Inter for text, Instrument Serif for italic accents), so the site doesn't depend on Google Fonts at the venue.
- All styles are in `assets/css/style.css`.

## Checking the site

`node tests/check-site.js` opens every page in both languages (desktop and phone width) and checks links, the menu, the language switch, every quiz option, the Runner Reset checks, the signal log (save, print, clear) and the WhatsApp form. It needs Playwright with Chromium.
