# Lessons & Invariants

## Architecture & Layout
- **Root Layout Ownership**: `src/app/layout.tsx` owns `<Navbar />` and `<Footer />`. Never import or render `<Navbar />` or `<Footer />` inside individual page components.
- **Client Components in Next.js**: Any interactive component or hook-using component must have `"use client";` at the top.
- **Styling Convention**: All components strictly follow the church design system:
  - Sharp corners (`rounded-none`).
  - Colors: Royal church blue (`#003399` for `--color-church-blue`), vibrant church orange (`#EA580C` for `--color-church-gold`, `#C2410C` for `--color-church-gold-warm`).
  - Strict flat design with **zero shadows across the UI** (all `--shadow-*` tokens set to `none`, and global `*, ::before, ::after { box-shadow: none !important; }`).
  - Serif headings (`Playfair Display`) and clean uppercase tracking labels.

## Firestore & Security
- **Security Rules Coverage**: Whenever a new collection is introduced (e.g., `businesses`), `firestore.rules` must explicitly specify read and write rules. Otherwise Cloud Firestore's default deny rule blocks public and admin queries with `FirebaseError: Missing or insufficient permissions`.
- **Sanitized Inputs & Status**: User submissions should default to `status: "pending"` with server validation before publication.

## Directory Card UX & Resilience
- **No Crowded Multi-Color Button Rows**: Avoid squeezing multiple high-contrast solid color buttons (`grid-cols-3` with WhatsApp green, royal blue, dark stone) into narrow card footers. This causes label truncation (e.g. "WHA..."), visual clutter, and sensory overload. Instead, provide a clear, dignified primary link ("View Profile →") alongside an uncluttered quick-action cluster of clean icon buttons (WhatsApp, Phone, Web) with tooltips and accessible labels.
- **Image Fallback Resilience**: Any public user-submitted or remote image must have an `onError` handler that falls back to a branded monogram rather than displaying the browser's raw broken-image `alt` text.
