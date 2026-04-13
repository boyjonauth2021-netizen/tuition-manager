# Tuition Manager (Web App)

A mobile-friendly web app to manage tuition batches, student details, and payment status using Google Sheets as the backend.

## Features

- Google sign-in (OAuth)
- First-time batch setup:
  - number of batches
  - batch name, day, and time
- Auto-creates tabs in `MasterTuitionSheet`
- Add, edit, and delete students per batch
- Required fields:
  - Student Name
  - Student WhatsApp
- Optional fields:
  - Parent Name
  - Parent WhatsApp
- Toggle fee status: `Paid` / `Not Paid`

## Files

- `index.html` - Full single-file application (HTML/CSS/JS)

## Configuration

In `index.html`, set:

```js
var CLIENT_ID = "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com";
var SHEET_ID = "YOUR_GOOGLE_SHEET_ID";
```

Current values are already configured for your project.

## Google Cloud Setup

1. Open Google Cloud Console.
2. Select/create a project.
3. Enable **Google Sheets API**.
4. Configure **OAuth consent screen**.
5. Create **OAuth Client ID** (type: Web application).
6. Add Authorized JavaScript origin:
   - `https://boyjonauth2021-netizen.github.io`
7. Copy the client ID into `CLIENT_ID`.

## Google Sheet Setup

1. Create a blank Google Sheet named `MasterTuitionSheet`.
2. Copy the sheet ID from URL and set it as `SHEET_ID`.
3. Ensure the signing-in Google account has edit access.

The app will create and manage these tabs automatically:
- `Batches`
- one tab per batch name

## Deploy on GitHub Pages

1. Upload `index.html` and `README.md` to your repo root.
2. Go to repository **Settings -> Pages**.
3. Source: **Deploy from branch**.
4. Branch: `main`, folder: `/ (root)`.
5. Save.

App URL:

`https://boyjonauth2021-netizen.github.io/tuition-manager/`

## Usage Flow

1. Sign in with Google.
2. Enter number of batches.
3. Enter each batch name, day, and time.
4. Save setup.
5. Open a batch.
6. Add students and update `Paid / Not Paid`.

