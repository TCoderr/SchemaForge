# SchemaForge — Test Raporu

**Oluşturma:** 2026-10-19 00:05:10 UTC · **Komut:** `node scripts/collect-results.mjs`

| Kontrol | Sonuç | Ham çıktı |
|---|---|---|
| TypeScript (`tsc -b`) | Hatasız | `docs/test-results/typecheck.txt` |
| ESLint | Hatasız | `docs/test-results/lint.txt` |
| Birim + entegrasyon (Vitest + React Testing Library) | 33 test · 33 başarılı · 0 başarısız | `docs/test-results/unit-tests.txt`, `unit-junit.xml` |
| `npm run build` | Başarılı | `docs/test-results/build.txt` |
| Tarayıcı (Playwright + Microsoft Edge) | 4 test · 4 başarılı · 0 başarısız | `docs/test-results/e2e-tests.txt`, `e2e-junit.xml` |

## Build çıktısı

```
dist/index.html                   0.74 kB │ gzip:  0.46 kB
dist/assets/index-DlspW7K1.css   18.65 kB │ gzip:  4.70 kB
dist/assets/index-DOlT0oG3.js   251.34 kB │ gzip: 78.09 kB
✓ built in 125ms
```

## Birim ve entegrasyon testleri

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.137 |
| 2 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.013 |
| 3 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.557 |
| 4 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.114 |
| 5 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.336 |
| 6 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.222 |
| 7 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.980 |
| 8 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.409 |
| 9 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.235 |
| 10 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.181 |
| 11 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.111 |
| 12 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.404 |
| 13 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.053 |
| 14 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.008 |
| 15 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.014 |
| 16 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.639 |
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
| 1 | desktop › full flow: create, fields, rules, validation, export, real reload, delete | BAŞARILI | 1.463 |
| 2 | desktop › 11 corrupt LocalStorage: no white page, clear message | BAŞARILI | 0.254 |
| 3 | desktop › keyboard: create a form and add a field without a mouse; focus is visible | BAŞARILI | 0.248 |
| 4 | mobile › 12 mobile layout is usable and has no horizontal overflow | BAŞARILI | 0.625 |

Ekran görüntüleri tarayıcı testleri sırasında gerçek Edge penceresinden alınır: `docs/screenshots/`.
