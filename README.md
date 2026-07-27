# Tuition Manager (Latest)

Canonical app folder. Deploy the **contents** of this folder to GitHub Pages (or any static host).

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main app (login + batches + payments + student portal) |
| `manifest.json` | PWA install manifest |
| `sw.js` | Service worker (enables Install app) |
| `icons/` | App icons (192 / 512) from your Tuition App artwork |
| `student-intake.gs` | Google Apps Script for student self-registration |
| `MasterTuitionSheet - boyjonauth2024@gmail.com.xlsx` | Latest sheet export |
| `index-tuition-manager.html` | Older backup copy |

## Deploy notes

1. Upload **this folder’s contents** so `index.html` is the site entry (or host under a subpath).
2. In Google Cloud OAuth client, add your Pages origin under **Authorized JavaScript origins**.
3. `STUDENT_INTAKE_ENDPOINT` in `index.html` must point to your deployed Apps Script `/exec` URL.
4. Open the live HTTPS URL on phone/desktop → browser should offer **Install app** / Add to Home Screen (icon = Tuition App).

## Login behaviour

- Waits for Google Identity Services before enabling Sign in.
- Restores session from `localStorage`, validates token, silently refreshes if expired.
- On Sheets API 401/403, refreshes token once and retries.

Do **not** confuse this with the root `index.html` of the parent repo (pseudocode IDE).
