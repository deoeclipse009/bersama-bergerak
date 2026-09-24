# Bersama Bergerak — website

A static, multi-page website for **Bersama Bergerak** (Movement & Active Living Initiative) and the **Run Safe Playground** (Bersama Bergerak × ADEM) at UGM Trail Run 2026.

No build step: open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, Vercel).

## Languages

- **Bahasa Indonesia (main):** the root folder (`index.html`, `about.html`, …).
- **English:** the same pages inside `en/` (`en/index.html`, …).

Every page has an **ID / EN** switch in the header that jumps to the same page in the other language. When editing text, update both versions. The partner brief is in Indonesian only.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home: Bersama Bergerak helps people start a healthy, active lifestyle and keep it sustainable (not only for runners); why running safely matters; booth activities |
| `about.html` | Who we are, Feel → Think → Decide, principles, ADEM partnership |
| `run-safe-playground.html` | The booth concept: zones, Runner Decision Test, CPR Battle, mini stage, Run Crew Ready, booth layouts |
| `schedule.html` | Where and when: 25–27 Sept 2026, GIK and Race Village |
| `runner-reset-guide.html` | QR landing page: interactive 1-Minute Runner Check, 5-question guide, Runner Decision Test |
| `work-with-us.html` | "Bring this to your community" + short lead form |
| `partner-brief.html` | Operational brief for the committee / ADEM / internal team (linked from the footer only, `noindex`) |

## Before the event

- **QR code:** point the booth QR at `runner-reset-guide.html` (Indonesian) once the site is hosted.
- **Lead form:** put the team's WhatsApp number in `data-whatsapp` on the `<form id="lead-form">` in both `work-with-us.html` and `en/work-with-us.html` (format `628xxxxxxxxxx`). Submissions then open WhatsApp with the visitor's answers pre-filled. Without a number, the visitor sees a summary and is asked to DM @bersamabergerak.id.
- Times marked *tentative* on `schedule.html` should be updated when the final rundown is confirmed.

Colours come from the logo (`assets/img/bersama-bergerak-logo.jpg`): navy `#13265a`, blues `#1f63c4` / `#2a7de1`. All styles are in `assets/css/style.css`.
