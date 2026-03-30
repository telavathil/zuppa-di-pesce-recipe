# Plan: Progressive Web App (PWA) Conversion

**Status:** In progress
**Adapted from:** drone-lessons project
**Created:** 2026-03-30

---

## Requirements

- Make the app installable on mobile and desktop (Chrome, Safari/iOS)
- Full offline support after first visit — all recipe content is client-side/in-memory so no API caching needed
- Railway provides HTTPS automatically — no server changes needed
- Install prompt UI for "Add to Home Screen"
- Graceful offline indicator when network is lost

## Key Notes vs Original Plan

- No `client/` prefix — flat Vite project, paths are root-relative
- Package manager: `npm` (not `pnpm`)
- JavaScript/JSX (not TypeScript)
- No Express backend — Railway serves `dist/` directly as static files
- No API routes to cache — all recipe data is embedded in JS bundles
- Equipment images are served from external CDNs (Google, Shopify, Amazon) — cache with `CacheFirst`
- Theme color: `#9b4006` (The Flame)

---

## Phase 1: Icons & Manifest (~20 min) — Low Risk

1. Create `public/icon.svg` — "Z" on terracotta background, used for all manifest icon references
2. Add `<link rel="apple-touch-icon">` and theme-color meta to `index.html`

## Phase 2: Vite PWA Plugin (~30 min) — Medium Risk

3. `npm install -D vite-plugin-pwa`
4. Configure `VitePWA` in `vite.config.js`:
   - `registerType: 'prompt'`
   - Manifest: name "Zuppa di Pesce", short_name "Zuppa", theme_color `#9b4006`, background_color `#fef9f2`, display `standalone`, start_url `/`
   - Workbox runtime caching:
     - `https://fonts.googleapis.com/*` → `StaleWhileRevalidate`
     - `https://fonts.gstatic.com/*` → `CacheFirst` (365-day expiry)
     - `https://lh3.googleusercontent.com/*` → `CacheFirst` (equipment images, 30-day expiry)
     - `https://*.googleusercontent.com/*` → `CacheFirst`
     - External image CDNs (Shopify, Amazon) → `CacheFirst` (30-day expiry)

## Phase 3: Service Worker Registration (~20 min) — Medium Risk

5. Create `src/lib/pwa.js`:
   - Exports `registerSW` call
   - Exports `useOnlineStatus()` hook
   - Exports `useInstallPrompt()` hook
6. Call `registerSW` in `src/main.jsx`

## Phase 4: UI Components (~30 min) — Low Risk

7. Create `src/components/OfflineIndicator.jsx` — subtle banner when offline
8. Create `src/components/InstallBanner.jsx` — dismissible "Add to Home Screen" prompt (dismiss persisted to localStorage)
9. Mount both in `src/App.jsx`

## Phase 5: Verify Railway Deploy (~5 min) — Low Risk

10. Railway serves `dist/` statically — `sw.js` and `manifest.webmanifest` will be at root automatically. No config changes needed.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Stale cache after new deployment | `registerType: 'prompt'` + Vite content-hashed filenames trigger update prompt |
| Equipment images not cached offline | `CacheFirst` runtime caching for all image CDN origins |
| SVG icon not supported on older iOS | Acceptable tradeoff; PNG icons can be added later for full iOS coverage |
| Google Fonts cross-origin caching | Workbox runtime caching handles cross-origin by default |

---

## Files

### New
- `public/icon.svg` — app icon
- `src/lib/pwa.js` — SW registration, online status hook, install prompt hook
- `src/components/OfflineIndicator.jsx`
- `src/components/InstallBanner.jsx`

### Modified
- `vite.config.js` — add `vite-plugin-pwa`
- `package.json` — add `vite-plugin-pwa` devDependency
- `index.html` — add apple-touch-icon, theme-color, manifest link
- `src/main.jsx` — register service worker
- `src/App.jsx` — mount OfflineIndicator, InstallBanner

### No changes needed
- Railway config — static serving already correct

---

## Success Criteria

- [ ] Lighthouse PWA audit score ≥ 90
- [ ] App is installable on Chrome (desktop + Android) and Safari (iOS)
- [ ] All recipe content works fully offline after first visit
- [ ] Equipment images load offline after first visit
- [ ] Offline indicator appears when network is lost
- [ ] Install banner appears for eligible users and can be dismissed
- [ ] New deployments trigger an update prompt (not stale cache)
- [ ] No regression in existing functionality
