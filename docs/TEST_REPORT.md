# SchemaForge — Test Raporu

**Oluşturma:** 2026-10-19 15:41:01 UTC · **Komut:** `node scripts/collect-results.mjs`

| Kontrol | Sonuç | Ham çıktı |
|---|---|---|
| TypeScript (`tsc -b`) | Hatasız | `docs/test-results/typecheck.txt` |
| ESLint | Hatasız | `docs/test-results/lint.txt` |
| Birim + entegrasyon (Vitest + React Testing Library) | 43 test · 43 başarılı · 0 bilinen kusur (beklenen hata) · 0 başarısız | `docs/test-results/unit-tests.txt`, `unit-junit.xml` |
| `npm run build` | Başarılı | `docs/test-results/build.txt` |
| Tarayıcı (Playwright + Microsoft Edge) | 39 test · 39 başarılı · 0 bilinen kusur (beklenen hata) · 0 başarısız | `docs/test-results/e2e-tests.txt`, `e2e-junit.xml` |
| Tarayıcı, **canlı Netlify sitesi** (https://schemaforge-tcoderr.netlify.app) | 39 test · 39 başarılı · 0 bilinen kusur (beklenen hata) · 0 başarısız | `docs/test-results/e2e-live-junit.xml`, `docs/screenshots/live/` |

## Build çıktısı

```
dist/index.html                   0.74 kB │ gzip:  0.46 kB
dist/assets/index-7_u-jkvg.css   20.45 kB │ gzip:  4.99 kB
dist/assets/index-wxSCGASN.js   252.91 kB │ gzip: 78.57 kB
✓ built in 141ms
```

## Birim ve entegrasyon testleri

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.150 |
| 2 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.013 |
| 3 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.315 |
| 4 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.122 |
| 5 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.332 |
| 6 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.244 |
| 7 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.893 |
| 8 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.381 |
| 9 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.176 |
| 10 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.196 |
| 11 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.116 |
| 12 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.426 |
| 13 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.051 |
| 14 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.004 |
| 15 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.011 |
| 16 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.047 |
| 17 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.064 |
| 18 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.078 |
| 19 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.102 |
| 20 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.332 |
| 21 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.604 |
| 22 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.043 |
| 23 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.630 |
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
| 1 | desktop › F01 first visit: empty state, nothing stored before the user acts | BAŞARILI | 0.304 |
| 2 | desktop › F02 first form from the empty state opens the editor and is stored | BAŞARILI | 0.250 |
| 3 | desktop › F03 second form, listing (newest first, counts, date) and "Düzenle" opens the right form | BAŞARILI | 0.459 |
| 4 | desktop › F04 title and description: live preview, list card and storage | BAŞARILI | 0.320 |
| 5 | desktop › F05 duplicate: "(kopya)", "(kopya 2)", fields copied and independent of the original | BAŞARILI | 0.407 |
| 6 | desktop › F06 delete form: Vazgeç, Escape and backdrop cancel; "Formu sil" deletes and survives reload | BAŞARILI | 0.559 |
| 7 | desktop › F07 every field type: defaults, preview control, unique JSON names | BAŞARILI | 0.584 |
| 8 | desktop › F08 placeholder and help text reach the preview; hidden where they do not apply | BAŞARILI | 0.396 |
| 9 | desktop › F09 required: marker in list and preview, aria-required, checkbox message | BAŞARILI | 0.392 |
| 10 | desktop › F10 rules: invalid e-mail, number range, text length, date range, select choice | BAŞARILI | 0.689 |
| 11 | desktop › F11 empty required submit, live re-validation, "Temizle" resets | BAŞARILI | 0.437 |
| 12 | desktop › F12 live preview follows label, type, options and order changes | BAŞARILI | 0.394 |
| 13 | desktop › F13 delete field: cancel keeps it; confirm removes it from list, preview and storage | BAŞARILI | 0.419 |
| 14 | desktop › F14 reorder with ↑/↓: list, preview, storage and export follow; edge buttons are disabled | BAŞARILI | 0.395 |
| 15 | desktop › F15 export: JSON content, real download, clipboard, warnings, three ways to close, focus return | BAŞARILI | 0.759 |
| 16 | desktop › F16 persistence: real reload in the editor keeps every setting; browser back/forward work | BAŞARILI | 0.522 |
| 17 | desktop › F17 broken storage: corrupt JSON, wrong shape, partly invalid data, unknown form link | BAŞARILI | 0.549 |
| 18 | desktop › F18 storage full / blocked: warning banner instead of silent data loss | BAŞARILI | 0.292 |
| 19 | desktop › F19 keyboard: create, add a field and delete via dialog without a mouse; Escape and focus order | BAŞARILI | 0.330 |
| 20 | desktop › F20 BUG-003 regression: skip link moves focus to the content and does not leave the editor | BAŞARILI | 0.293 |
| 21 | desktop › F21 BUG-001 regression: two tabs never overwrite each other&apos;s forms | BAŞARILI | 0.664 |
| 22 | desktop › F22 BUG-002 regression: "Temiz başlat" never deletes forms created after the warning | BAŞARILI | 0.384 |
| 23 | desktop › F24 BUG-004 regression: one click on "Gönder (test)" submits even when the last field turns invalid on blur | BAŞARILI | 0.410 |
| 24 | desktop › F25 JSON name: auto-sync with the label until edited by hand; invalid and duplicate names are flagged | BAŞARILI | 0.438 |
| 25 | desktop › F23 network: the app loads without login and sends no form data anywhere | BAŞARILI | 0.367 |
| 26 | desktop › F26 BUG-005 regression: unparsable number input is rejected, optional or required; "Temizle" clears it | BAŞARILI | 0.521 |
| 27 | desktop › F27 BUG-006 regression: options are trimmed, de-duplicated and identical in storage, preview, validation and export | BAŞARILI | 0.407 |
| 28 | desktop › F28 BUG-007 regression: preview errors follow schema changes (required on/off) | BAŞARILI | 0.387 |
| 29 | desktop › F29 BUG-008 regression: export file names keep Turkish letters correctly (İ ı Ş ş Ğ ğ Ü ü Ö ö Ç ç) | BAŞARILI | 0.329 |
| 30 | desktop › F30 BUG-009 regression: Tab and Shift+Tab stay inside both modals; focus returns to a sensible trigger | BAŞARILI | 0.462 |
| 31 | desktop › F31 BUG-010 regression: an empty title or label still gives every button a meaningful accessible name | BAŞARILI | 0.389 |
| 32 | scenarios › Scenario A: customer contact form — build, validate, autosave, reload, export | BAŞARILI | 0.793 |
| 33 | scenarios › Scenario B: registration form with 6 field types — invalid data, edit the schema, test again | BAŞARILI | 0.850 |
| 34 | scenarios › Scenario C: several forms — switch, delete one, keep the others, reload | BAŞARILI | 0.745 |
| 35 | desktop › full flow: create, fields, rules, validation, export, real reload, delete | BAŞARILI | 1.420 |
| 36 | desktop › 11 corrupt LocalStorage: no white page, clear message | BAŞARILI | 0.315 |
| 37 | desktop › keyboard: create a form and add a field without a mouse; focus is visible | BAŞARILI | 0.297 |
| 38 | mobile › M01 mobile: create, edit, preview, export and delete; no horizontal overflow; dialogs fit the screen | BAŞARILI | 0.864 |
| 39 | mobile › 12 mobile layout is usable and has no horizontal overflow | BAŞARILI | 0.469 |


## Canlı site testleri (`PW_BASE_URL=https://schemaforge-tcoderr.netlify.app npx playwright test`)

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | desktop › F01 first visit: empty state, nothing stored before the user acts | BAŞARILI | 0.982 |
| 2 | desktop › F02 first form from the empty state opens the editor and is stored | BAŞARILI | 1.243 |
| 3 | desktop › F03 second form, listing (newest first, counts, date) and "Düzenle" opens the right form | BAŞARILI | 1.088 |
| 4 | desktop › F04 title and description: live preview, list card and storage | BAŞARILI | 1.051 |
| 5 | desktop › F05 duplicate: "(kopya)", "(kopya 2)", fields copied and independent of the original | BAŞARILI | 1.058 |
| 6 | desktop › F06 delete form: Vazgeç, Escape and backdrop cancel; "Formu sil" deletes and survives reload | BAŞARILI | 1.307 |
| 7 | desktop › F07 every field type: defaults, preview control, unique JSON names | BAŞARILI | 1.328 |
| 8 | desktop › F08 placeholder and help text reach the preview; hidden where they do not apply | BAŞARILI | 1.140 |
| 9 | desktop › F09 required: marker in list and preview, aria-required, checkbox message | BAŞARILI | 0.849 |
| 10 | desktop › F10 rules: invalid e-mail, number range, text length, date range, select choice | BAŞARILI | 1.152 |
| 11 | desktop › F11 empty required submit, live re-validation, "Temizle" resets | BAŞARILI | 1.172 |
| 12 | desktop › F12 live preview follows label, type, options and order changes | BAŞARILI | 1.228 |
| 13 | desktop › F13 delete field: cancel keeps it; confirm removes it from list, preview and storage | BAŞARILI | 1.004 |
| 14 | desktop › F14 reorder with ↑/↓: list, preview, storage and export follow; edge buttons are disabled | BAŞARILI | 0.928 |
| 15 | desktop › F15 export: JSON content, real download, clipboard, warnings, three ways to close, focus return | BAŞARILI | 1.587 |
| 16 | desktop › F16 persistence: real reload in the editor keeps every setting; browser back/forward work | BAŞARILI | 1.093 |
| 17 | desktop › F17 broken storage: corrupt JSON, wrong shape, partly invalid data, unknown form link | BAŞARILI | 1.998 |
| 18 | desktop › F18 storage full / blocked: warning banner instead of silent data loss | BAŞARILI | 1.164 |
| 19 | desktop › F19 keyboard: create, add a field and delete via dialog without a mouse; Escape and focus order | BAŞARILI | 0.934 |
| 20 | desktop › F20 BUG-003 regression: skip link moves focus to the content and does not leave the editor | BAŞARILI | 0.871 |
| 21 | desktop › F21 BUG-001 regression: two tabs never overwrite each other&apos;s forms | BAŞARILI | 3.588 |
| 22 | desktop › F22 BUG-002 regression: "Temiz başlat" never deletes forms created after the warning | BAŞARILI | 1.127 |
| 23 | desktop › F24 BUG-004 regression: one click on "Gönder (test)" submits even when the last field turns invalid on blur | BAŞARILI | 1.090 |
| 24 | desktop › F25 JSON name: auto-sync with the label until edited by hand; invalid and duplicate names are flagged | BAŞARILI | 0.885 |
| 25 | desktop › F23 network: the app loads without login and sends no form data anywhere | BAŞARILI | 0.740 |
| 26 | desktop › F26 BUG-005 regression: unparsable number input is rejected, optional or required; "Temizle" clears it | BAŞARILI | 1.241 |
| 27 | desktop › F27 BUG-006 regression: options are trimmed, de-duplicated and identical in storage, preview, validation and export | BAŞARILI | 0.788 |
| 28 | desktop › F28 BUG-007 regression: preview errors follow schema changes (required on/off) | BAŞARILI | 0.772 |
| 29 | desktop › F29 BUG-008 regression: export file names keep Turkish letters correctly (İ ı Ş ş Ğ ğ Ü ü Ö ö Ç ç) | BAŞARILI | 0.801 |
| 30 | desktop › F30 BUG-009 regression: Tab and Shift+Tab stay inside both modals; focus returns to a sensible trigger | BAŞARILI | 0.881 |
| 31 | desktop › F31 BUG-010 regression: an empty title or label still gives every button a meaningful accessible name | BAŞARILI | 0.788 |
| 32 | scenarios › Scenario A: customer contact form — build, validate, autosave, reload, export | BAŞARILI | 1.596 |
| 33 | scenarios › Scenario B: registration form with 6 field types — invalid data, edit the schema, test again | BAŞARILI | 1.550 |
| 34 | scenarios › Scenario C: several forms — switch, delete one, keep the others, reload | BAŞARILI | 1.386 |
| 35 | desktop › full flow: create, fields, rules, validation, export, real reload, delete | BAŞARILI | 2.458 |
| 36 | desktop › 11 corrupt LocalStorage: no white page, clear message | BAŞARILI | 0.979 |
| 37 | desktop › keyboard: create a form and add a field without a mouse; focus is visible | BAŞARILI | 0.790 |
| 38 | mobile › M01 mobile: create, edit, preview, export and delete; no horizontal overflow; dialogs fit the screen | BAŞARILI | 1.500 |
| 39 | mobile › 12 mobile layout is usable and has no horizontal overflow | BAŞARILI | 1.159 |

Ekran görüntüleri tarayıcı testleri sırasında gerçek Edge penceresinden alınır: `docs/screenshots/` (yerel üretim derlemesi) ve `docs/screenshots/live/` (canlı site).
