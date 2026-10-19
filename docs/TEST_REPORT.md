# SchemaForge — Test Raporu

**Oluşturma:** 2026-10-19 15:24:40 UTC · **Komut:** `node scripts/collect-results.mjs`

| Kontrol | Sonuç | Ham çıktı |
|---|---|---|
| TypeScript (`tsc -b`) | Hatasız | `docs/test-results/typecheck.txt` |
| ESLint | Hatasız | `docs/test-results/lint.txt` |
| Birim + entegrasyon (Vitest + React Testing Library) | 43 test · 43 başarılı · 0 bilinen kusur (beklenen hata) · 0 başarısız | `docs/test-results/unit-tests.txt`, `unit-junit.xml` |
| `npm run build` | Başarılı | `docs/test-results/build.txt` |
| Tarayıcı (Playwright + Microsoft Edge) | 39 test · 39 başarılı · 0 bilinen kusur (beklenen hata) · 0 başarısız | `docs/test-results/e2e-tests.txt`, `e2e-junit.xml` |
| Tarayıcı, **canlı Netlify sitesi** (https://schemaforge-tcoderr.netlify.app) | 39 test · 33 başarılı · 6 bilinen kusur (beklenen hata) · 0 başarısız | `docs/test-results/e2e-live-junit.xml`, `docs/screenshots/live/` |

## Build çıktısı

```
dist/index.html                   0.74 kB │ gzip:  0.46 kB
dist/assets/index-7_u-jkvg.css   20.45 kB │ gzip:  4.99 kB
dist/assets/index-wxSCGASN.js   252.91 kB │ gzip: 78.57 kB
✓ built in 137ms
```

## Birim ve entegrasyon testleri

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.140 |
| 2 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.014 |
| 3 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.296 |
| 4 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.092 |
| 5 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.248 |
| 6 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.186 |
| 7 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.732 |
| 8 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.362 |
| 9 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.218 |
| 10 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.187 |
| 11 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.113 |
| 12 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.411 |
| 13 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.049 |
| 14 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.009 |
| 15 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.004 |
| 16 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.061 |
| 17 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.051 |
| 18 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.072 |
| 19 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.140 |
| 20 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.347 |
| 21 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.578 |
| 22 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.054 |
| 23 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.523 |
| 24 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.003 |
| 25 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 26 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 27 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 28 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 29 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 30 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 31 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 32 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 33 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 34 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 35 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 36 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 37 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 38 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 39 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 40 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 41 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 42 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 43 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |

## Tarayıcı testleri (gerçek Edge, üretim derlemesi `vite preview`)

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | desktop › F01 first visit: empty state, nothing stored before the user acts | BAŞARILI | 0.301 |
| 2 | desktop › F02 first form from the empty state opens the editor and is stored | BAŞARILI | 0.271 |
| 3 | desktop › F03 second form, listing (newest first, counts, date) and "Düzenle" opens the right form | BAŞARILI | 0.544 |
| 4 | desktop › F04 title and description: live preview, list card and storage | BAŞARILI | 0.364 |
| 5 | desktop › F05 duplicate: "(kopya)", "(kopya 2)", fields copied and independent of the original | BAŞARILI | 0.434 |
| 6 | desktop › F06 delete form: Vazgeç, Escape and backdrop cancel; "Formu sil" deletes and survives reload | BAŞARILI | 0.573 |
| 7 | desktop › F07 every field type: defaults, preview control, unique JSON names | BAŞARILI | 0.597 |
| 8 | desktop › F08 placeholder and help text reach the preview; hidden where they do not apply | BAŞARILI | 0.403 |
| 9 | desktop › F09 required: marker in list and preview, aria-required, checkbox message | BAŞARILI | 0.412 |
| 10 | desktop › F10 rules: invalid e-mail, number range, text length, date range, select choice | BAŞARILI | 0.706 |
| 11 | desktop › F11 empty required submit, live re-validation, "Temizle" resets | BAŞARILI | 0.462 |
| 12 | desktop › F12 live preview follows label, type, options and order changes | BAŞARILI | 0.404 |
| 13 | desktop › F13 delete field: cancel keeps it; confirm removes it from list, preview and storage | BAŞARILI | 0.458 |
| 14 | desktop › F14 reorder with ↑/↓: list, preview, storage and export follow; edge buttons are disabled | BAŞARILI | 0.442 |
| 15 | desktop › F15 export: JSON content, real download, clipboard, warnings, three ways to close, focus return | BAŞARILI | 0.678 |
| 16 | desktop › F16 persistence: real reload in the editor keeps every setting; browser back/forward work | BAŞARILI | 0.479 |
| 17 | desktop › F17 broken storage: corrupt JSON, wrong shape, partly invalid data, unknown form link | BAŞARILI | 0.495 |
| 18 | desktop › F18 storage full / blocked: warning banner instead of silent data loss | BAŞARILI | 0.250 |
| 19 | desktop › F19 keyboard: create, add a field and delete via dialog without a mouse; Escape and focus order | BAŞARILI | 0.301 |
| 20 | desktop › F20 BUG-003 regression: skip link moves focus to the content and does not leave the editor | BAŞARILI | 0.274 |
| 21 | desktop › F21 BUG-001 regression: two tabs never overwrite each other&apos;s forms | BAŞARILI | 0.627 |
| 22 | desktop › F22 BUG-002 regression: "Temiz başlat" never deletes forms created after the warning | BAŞARILI | 0.380 |
| 23 | desktop › F24 BUG-004 regression: one click on "Gönder (test)" submits even when the last field turns invalid on blur | BAŞARILI | 0.437 |
| 24 | desktop › F25 JSON name: auto-sync with the label until edited by hand; invalid and duplicate names are flagged | BAŞARILI | 0.430 |
| 25 | desktop › F23 network: the app loads without login and sends no form data anywhere | BAŞARILI | 0.361 |
| 26 | desktop › F26 BUG-005 regression: unparsable number input is rejected, optional or required; "Temizle" clears it | BAŞARILI | 0.498 |
| 27 | desktop › F27 BUG-006 regression: options are trimmed, de-duplicated and identical in storage, preview, validation and export | BAŞARILI | 0.393 |
| 28 | desktop › F28 BUG-007 regression: preview errors follow schema changes (required on/off) | BAŞARILI | 0.387 |
| 29 | desktop › F29 BUG-008 regression: export file names keep Turkish letters correctly (İ ı Ş ş Ğ ğ Ü ü Ö ö Ç ç) | BAŞARILI | 0.333 |
| 30 | desktop › F30 BUG-009 regression: Tab and Shift+Tab stay inside both modals; focus returns to a sensible trigger | BAŞARILI | 0.439 |
| 31 | desktop › F31 BUG-010 regression: an empty title or label still gives every button a meaningful accessible name | BAŞARILI | 0.390 |
| 32 | scenarios › Scenario A: customer contact form — build, validate, autosave, reload, export | BAŞARILI | 0.837 |
| 33 | scenarios › Scenario B: registration form with 6 field types — invalid data, edit the schema, test again | BAŞARILI | 0.948 |
| 34 | scenarios › Scenario C: several forms — switch, delete one, keep the others, reload | BAŞARILI | 0.801 |
| 35 | desktop › full flow: create, fields, rules, validation, export, real reload, delete | BAŞARILI | 1.432 |
| 36 | desktop › 11 corrupt LocalStorage: no white page, clear message | BAŞARILI | 0.318 |
| 37 | desktop › keyboard: create a form and add a field without a mouse; focus is visible | BAŞARILI | 0.275 |
| 38 | mobile › M01 mobile: create, edit, preview, export and delete; no horizontal overflow; dialogs fit the screen | BAŞARILI | 0.887 |
| 39 | mobile › 12 mobile layout is usable and has no horizontal overflow | BAŞARILI | 0.554 |


## Canlı site testleri (`PW_BASE_URL=https://schemaforge-tcoderr.netlify.app npx playwright test`)

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | desktop › F01 first visit: empty state, nothing stored before the user acts | BAŞARILI | 0.964 |
| 2 | desktop › F02 first form from the empty state opens the editor and is stored | BAŞARILI | 0.991 |
| 3 | desktop › F03 second form, listing (newest first, counts, date) and "Düzenle" opens the right form | BAŞARILI | 1.157 |
| 4 | desktop › F04 title and description: live preview, list card and storage | BAŞARILI | 1.013 |
| 5 | desktop › F05 duplicate: "(kopya)", "(kopya 2)", fields copied and independent of the original | BAŞARILI | 1.126 |
| 6 | desktop › F06 delete form: Vazgeç, Escape and backdrop cancel; "Formu sil" deletes and survives reload | BAŞARILI | 1.810 |
| 7 | desktop › F07 every field type: defaults, preview control, unique JSON names | BAŞARILI | 1.273 |
| 8 | desktop › F08 placeholder and help text reach the preview; hidden where they do not apply | BAŞARILI | 1.048 |
| 9 | desktop › F09 required: marker in list and preview, aria-required, checkbox message | BAŞARILI | 1.386 |
| 10 | desktop › F10 rules: invalid e-mail, number range, text length, date range, select choice | BAŞARILI | 1.709 |
| 11 | desktop › F11 empty required submit, live re-validation, "Temizle" resets | BAŞARILI | 0.818 |
| 12 | desktop › F12 live preview follows label, type, options and order changes | BAŞARILI | 1.006 |
| 13 | desktop › F13 delete field: cancel keeps it; confirm removes it from list, preview and storage | BAŞARILI | 1.028 |
| 14 | desktop › F14 reorder with ↑/↓: list, preview, storage and export follow; edge buttons are disabled | BAŞARILI | 0.846 |
| 15 | desktop › F15 export: JSON content, real download, clipboard, warnings, three ways to close, focus return | BAŞARILI | 1.359 |
| 16 | desktop › F16 persistence: real reload in the editor keeps every setting; browser back/forward work | BAŞARILI | 1.224 |
| 17 | desktop › F17 broken storage: corrupt JSON, wrong shape, partly invalid data, unknown form link | BAŞARILI | 2.060 |
| 18 | desktop › F18 storage full / blocked: warning banner instead of silent data loss | BAŞARILI | 0.685 |
| 19 | desktop › F19 keyboard: create, add a field and delete via dialog without a mouse; Escape and focus order | BAŞARILI | 0.818 |
| 20 | desktop › F20 BUG-003 regression: skip link moves focus to the content and does not leave the editor | BAŞARILI | 1.305 |
| 21 | desktop › F21 BUG-001 regression: two tabs never overwrite each other&apos;s forms | BAŞARILI | 3.533 |
| 22 | desktop › F22 BUG-002 regression: "Temiz başlat" never deletes forms created after the warning | BAŞARILI | 1.165 |
| 23 | desktop › F24 BUG-004 regression: one click on "Gönder (test)" submits even when the last field turns invalid on blur | BAŞARILI | 0.789 |
| 24 | desktop › F25 JSON name: auto-sync with the label until edited by hand; invalid and duplicate names are flagged | BAŞARILI | 0.879 |
| 25 | desktop › F23 network: the app loads without login and sends no form data anywhere | BAŞARILI | 0.915 |
| 26 | desktop › K01 BUG-005 [MEDIUM] optional number field with unparsable input is reported as valid | BİLİNEN KUSUR (beklenen hata) | 3.077 |
| 27 | desktop › K02 BUG-006 [MEDIUM] select option with surrounding spaces can never pass validation | BİLİNEN KUSUR (beklenen hata) | 2.788 |
| 28 | desktop › K03 BUG-007 [LOW] preview keeps a stale error after the field is made optional | BİLİNEN KUSUR (beklenen hata) | 2.869 |
| 29 | desktop › K04 BUG-008 [LOW] export file name breaks the Turkish capital İ | BİLİNEN KUSUR (beklenen hata) | 3.358 |
| 30 | desktop › K05 BUG-009 [LOW] Tab can move focus out of an open modal dialog | BİLİNEN KUSUR (beklenen hata) | 0.972 |
| 31 | desktop › K06 BUG-010 [LOW] a form with an empty title gets nameless card buttons | BİLİNEN KUSUR (beklenen hata) | 2.936 |
| 32 | scenarios › Scenario A: customer contact form — build, validate, autosave, reload, export | BAŞARILI | 1.584 |
| 33 | scenarios › Scenario B: registration form with 6 field types — invalid data, edit the schema, test again | BAŞARILI | 1.403 |
| 34 | scenarios › Scenario C: several forms — switch, delete one, keep the others, reload | BAŞARILI | 1.577 |
| 35 | desktop › full flow: create, fields, rules, validation, export, real reload, delete | BAŞARILI | 2.443 |
| 36 | desktop › 11 corrupt LocalStorage: no white page, clear message | BAŞARILI | 0.939 |
| 37 | desktop › keyboard: create a form and add a field without a mouse; focus is visible | BAŞARILI | 0.776 |
| 38 | mobile › M01 mobile: create, edit, preview, export and delete; no horizontal overflow; dialogs fit the screen | BAŞARILI | 1.558 |
| 39 | mobile › 12 mobile layout is usable and has no horizontal overflow | BAŞARILI | 1.027 |

Ekran görüntüleri tarayıcı testleri sırasında gerçek Edge penceresinden alınır: `docs/screenshots/` (yerel üretim derlemesi) ve `docs/screenshots/live/` (canlı site).
