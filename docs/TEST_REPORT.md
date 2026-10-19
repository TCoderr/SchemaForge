# SchemaForge — Test Raporu

**Oluşturma:** 2026-10-19 00:27:37 UTC · **Komut:** `node scripts/collect-results.mjs`

| Kontrol | Sonuç | Ham çıktı |
|---|---|---|
| TypeScript (`tsc -b`) | Hatasız | `docs/test-results/typecheck.txt` |
| ESLint | Hatasız | `docs/test-results/lint.txt` |
| Birim + entegrasyon (Vitest + React Testing Library) | 33 test · 33 başarılı · 0 başarısız | `docs/test-results/unit-tests.txt`, `unit-junit.xml` |
| `npm run build` | Başarılı | `docs/test-results/build.txt` |
| Tarayıcı (Playwright + Microsoft Edge) | 4 test · 4 başarılı · 0 başarısız | `docs/test-results/e2e-tests.txt`, `e2e-junit.xml` |
| Tarayıcı, **canlı Netlify sitesi** (https://schemaforge-tcoderr.netlify.app) | 4 test · 4 başarılı · 0 başarısız | `docs/test-results/e2e-live-junit.xml`, `docs/screenshots/live/` |

## Build çıktısı

```
dist/index.html                   0.74 kB │ gzip:  0.46 kB
dist/assets/index-8qfJwTeP.css   19.15 kB │ gzip:  4.77 kB
dist/assets/index-BK8-AFQT.js   251.34 kB │ gzip: 78.09 kB
✓ built in 131ms
```

## Birim ve entegrasyon testleri

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.147 |
| 2 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.013 |
| 3 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.455 |
| 4 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.117 |
| 5 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.311 |
| 6 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.248 |
| 7 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.772 |
| 8 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.269 |
| 9 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.105 |
| 10 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.105 |
| 11 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.088 |
| 12 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.327 |
| 13 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.046 |
| 14 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.011 |
| 15 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.004 |
| 16 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.597 |
| 17 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.003 |
| 18 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 19 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 20 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 21 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 22 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 23 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 24 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 25 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 26 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 27 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 28 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 29 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 30 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 31 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 32 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 33 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |

## Tarayıcı testleri (gerçek Edge, üretim derlemesi `vite preview`)

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | desktop › full flow: create, fields, rules, validation, export, real reload, delete | BAŞARILI | 1.490 |
| 2 | desktop › 11 corrupt LocalStorage: no white page, clear message | BAŞARILI | 0.250 |
| 3 | desktop › keyboard: create a form and add a field without a mouse; focus is visible | BAŞARILI | 0.263 |
| 4 | mobile › 12 mobile layout is usable and has no horizontal overflow | BAŞARILI | 0.654 |


## Canlı site testleri (`PW_BASE_URL=https://schemaforge-tcoderr.netlify.app npx playwright test`)

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | desktop › full flow: create, fields, rules, validation, export, real reload, delete | BAŞARILI | 2.735 |
| 2 | desktop › 11 corrupt LocalStorage: no white page, clear message | BAŞARILI | 1.378 |
| 3 | desktop › keyboard: create a form and add a field without a mouse; focus is visible | BAŞARILI | 2.099 |
| 4 | mobile › 12 mobile layout is usable and has no horizontal overflow | BAŞARILI | 1.301 |

Ekran görüntüleri tarayıcı testleri sırasında gerçek Edge penceresinden alınır: `docs/screenshots/` (yerel üretim derlemesi) ve `docs/screenshots/live/` (canlı site).
