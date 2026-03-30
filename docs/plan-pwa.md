# Plan: Progressive Web App (PWA) Conversion

**Status:** Approved, not started
**Created:** 2026-03-29

---

## Requirements

- Make the app installable on mobile and desktop (Chrome, Safari/iOS)
- Offline lesson content after first visit
- Railway provides HTTPS automatically — no server changes needed for that
- Install prompt UI for "Add to Home Screen"
- Graceful offline degradation (lessons work, quiz shows clear message)

## Key Finding

`client/public/` directory does not exist yet. The `drone.svg` referenced in `index.html` is also missing — icons need to be created from scratch.

---

## Phase 1: Icons & Manifest (~30 min) — Low Risk

1. Create `client/public/icons/` with PNG icons: 192×192, 512×512, maskable variants
2. Add `<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png">` to `client/index.html` for iOS

## Phase 2: Vite PWA Plugin (~45 min) — Medium Risk

3. `pnpm add -D vite-plugin-pwa`
4. Configure `VitePWA` in `client/vite.config.ts`:
   - `registerType: 'prompt'` (controls update prompting)
   - Manifest: name, short_name, description, theme_color `#1B4F72`, background_color, display standalone, start_url `/`, icons array
   - Workbox runtime caching:
     - `/api/lessons/*` → `StaleWhileRevalidate` with `lessons-cache` (max 50 entries, 7-day expiry) — lessons work offline after first visit
     - `https://fonts.googleapis.com/*` → `StaleWhileRevalidate`
     - `https://fonts.gstatic.com/*` → `CacheFirst` (365-day expiry)

## Phase 3: Service Worker Registration (~30 min) — Medium Risk

5. Create `client/src/lib/pwa.ts`:
   - Imports `registerSW` from `virtual:pwa-register`
   - Exports `useOnlineStatus()` hook (listens to `online`/`offline` window events)
   - Exports `useInstallPrompt()` hook (captures `beforeinstallprompt` event)
6. Call `registerSW` in `client/src/main.tsx` after React mounts

## Phase 4: UI Components (~45 min) — Low Risk

7. Create `client/src/components/ui/OfflineIndicator.tsx` — banner when `navigator.onLine` is false
8. Create `client/src/components/ui/InstallBanner.tsx` — dismissible "Install for offline access" prompt (dismiss state persisted to localStorage)
9. Mount both in `client/src/components/layout/AppShell.tsx`

## Phase 5: Offline Fallback UX (~30 min) — Low Risk

10. `client/src/screens/LessonScreen.tsx` — if fetch fails and offline, show "Visit this lesson online first to cache it"
11. `client/src/screens/LessonScreen.tsx` — quiz phase: skip `fetchQuestions` call if offline, show clear message (quiz generation requires Claude API server-side)

## Phase 6: Verify Static Serving (~15 min) — Low Risk

12. Confirm Express `static()` serves `sw.js` and `manifest.webmanifest` from `client/dist/` — no code changes expected. `express.static` runs before the catch-all `app.get('*')` so generated files will be served correctly.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Stale cache after new deployment | `registerType: 'prompt'` + Vite content-hashed filenames trigger update prompt |
| `sw.js` not served at root | `express.static` runs before catch-all — static files take priority |
| HTTPS requirement | Railway handles HTTPS automatically on `*.up.railway.app` — confirmed, no action needed |
| Precache bundle too large | Only precache app shell; lazy chunks are runtime-cached on navigation |
| Google Fonts cross-origin caching | Workbox runtime caching handles cross-origin by default |

---

## Files

### New
- `client/public/icons/` — PNG icons (192, 512, maskable, 180 apple-touch)
- `client/src/lib/pwa.ts` — SW registration, online status hook, install prompt hook
- `client/src/components/ui/OfflineIndicator.tsx`
- `client/src/components/ui/InstallBanner.tsx`

### Modified
- `client/vite.config.ts` — add `vite-plugin-pwa`
- `client/package.json` — add `vite-plugin-pwa` devDependency
- `client/index.html` — add apple-touch-icon link
- `client/src/main.tsx` — register service worker
- `client/src/components/layout/AppShell.tsx` — mount OfflineIndicator, InstallBanner
- `client/src/screens/LessonScreen.tsx` — offline fallback for lesson fetch and quiz phase

### No changes needed
- `server/src/index.ts` — already serves static files correctly

---

## Success Criteria

- [ ] Lighthouse PWA audit score ≥ 90
- [ ] App is installable on Chrome (desktop + Android) and Safari (iOS)
- [ ] Previously visited lessons load fully offline
- [ ] Quiz phase shows a clear offline message instead of a network error
- [ ] Offline indicator appears when network is lost
- [ ] Install banner appears for eligible users and can be dismissed
- [ ] New deployments trigger an update prompt (not stale cache)
- [ ] No regression in existing functionality
