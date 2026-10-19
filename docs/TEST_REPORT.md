# SchemaForge — Test Raporu

**Oluşturma:** 2026-10-19 15:03:59 UTC · **Komut:** `node scripts/collect-results.mjs`

| Kontrol | Sonuç | Ham çıktı |
|---|---|---|
| TypeScript (`tsc -b`) | Hatasız | `docs/test-results/typecheck.txt` |
| ESLint | Hatasız | `docs/test-results/lint.txt` |
| Birim + entegrasyon (Vitest + React Testing Library) | 37 test · 37 başarılı · 0 bilinen kusur (beklenen hata) · 0 başarısız | `docs/test-results/unit-tests.txt`, `unit-junit.xml` |
| `npm run build` | Başarılı | `docs/test-results/build.txt` |
| Tarayıcı (Playwright + Microsoft Edge) | 39 test · 33 başarılı · 6 bilinen kusur (beklenen hata) · 0 başarısız | `docs/test-results/e2e-tests.txt`, `e2e-junit.xml` |
| Tarayıcı, **canlı Netlify sitesi** (https://schemaforge-tcoderr.netlify.app) | 38 test · 26 başarılı · 6 bilinen kusur (beklenen hata) · 6 başarısız | `docs/test-results/e2e-live-junit.xml`, `docs/screenshots/live/` |

## Build çıktısı

```
dist/index.html                   0.74 kB │ gzip:  0.46 kB
dist/assets/index-7_u-jkvg.css   20.45 kB │ gzip:  4.99 kB
dist/assets/index-DtpLGSyl.js   251.80 kB │ gzip: 78.19 kB
✓ built in 140ms
```

## Birim ve entegrasyon testleri

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.149 |
| 2 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.013 |
| 3 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.465 |
| 4 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.102 |
| 5 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.326 |
| 6 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.231 |
| 7 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.870 |
| 8 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.352 |
| 9 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.201 |
| 10 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.175 |
| 11 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.099 |
| 12 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.420 |
| 13 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.032 |
| 14 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.005 |
| 15 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.003 |
| 16 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.059 |
| 17 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.052 |
| 18 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.080 |
| 19 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.073 |
| 20 | App.test.tsx › src/App.test.tsx | BAŞARILI | 0.641 |
| 21 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.003 |
| 22 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 23 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 24 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 25 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 26 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 27 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 28 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 29 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 30 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 31 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 32 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 33 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 34 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 35 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |
| 36 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.001 |
| 37 | lib/lib.test.ts › src/lib/lib.test.ts | BAŞARILI | 0.000 |

## Tarayıcı testleri (gerçek Edge, üretim derlemesi `vite preview`)

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | desktop › F01 first visit: empty state, nothing stored before the user acts | BAŞARILI | 0.308 |
| 2 | desktop › F02 first form from the empty state opens the editor and is stored | BAŞARILI | 0.246 |
| 3 | desktop › F03 second form, listing (newest first, counts, date) and "Düzenle" opens the right form | BAŞARILI | 0.442 |
| 4 | desktop › F04 title and description: live preview, list card and storage | BAŞARILI | 0.319 |
| 5 | desktop › F05 duplicate: "(kopya)", "(kopya 2)", fields copied and independent of the original | BAŞARILI | 0.415 |
| 6 | desktop › F06 delete form: Vazgeç, Escape and backdrop cancel; "Formu sil" deletes and survives reload | BAŞARILI | 0.532 |
| 7 | desktop › F07 every field type: defaults, preview control, unique JSON names | BAŞARILI | 0.580 |
| 8 | desktop › F08 placeholder and help text reach the preview; hidden where they do not apply | BAŞARILI | 0.419 |
| 9 | desktop › F09 required: marker in list and preview, aria-required, checkbox message | BAŞARILI | 0.448 |
| 10 | desktop › F10 rules: invalid e-mail, number range, text length, date range, select choice | BAŞARILI | 0.720 |
| 11 | desktop › F11 empty required submit, live re-validation, "Temizle" resets | BAŞARILI | 0.458 |
| 12 | desktop › F12 live preview follows label, type, options and order changes | BAŞARILI | 0.380 |
| 13 | desktop › F13 delete field: cancel keeps it; confirm removes it from list, preview and storage | BAŞARILI | 0.410 |
| 14 | desktop › F14 reorder with ↑/↓: list, preview, storage and export follow; edge buttons are disabled | BAŞARILI | 0.406 |
| 15 | desktop › F15 export: JSON content, real download, clipboard, warnings, three ways to close, focus return | BAŞARILI | 0.734 |
| 16 | desktop › F16 persistence: real reload in the editor keeps every setting; browser back/forward work | BAŞARILI | 0.474 |
| 17 | desktop › F17 broken storage: corrupt JSON, wrong shape, partly invalid data, unknown form link | BAŞARILI | 0.502 |
| 18 | desktop › F18 storage full / blocked: warning banner instead of silent data loss | BAŞARILI | 0.266 |
| 19 | desktop › F19 keyboard: create, add a field and delete via dialog without a mouse; Escape and focus order | BAŞARILI | 0.292 |
| 20 | desktop › F20 BUG-003 regression: skip link moves focus to the content and does not leave the editor | BAŞARILI | 0.280 |
| 21 | desktop › F21 BUG-001 regression: two tabs never overwrite each other&apos;s forms | BAŞARILI | 0.640 |
| 22 | desktop › F22 BUG-002 regression: "Temiz başlat" never deletes forms created after the warning | BAŞARILI | 0.382 |
| 23 | desktop › F24 BUG-004 regression: one click on "Gönder (test)" submits even when the last field turns invalid on blur | BAŞARILI | 0.370 |
| 24 | desktop › F25 JSON name: auto-sync with the label until edited by hand; invalid and duplicate names are flagged | BAŞARILI | 0.384 |
| 25 | desktop › F23 network: the app loads without login and sends no form data anywhere | BAŞARILI | 0.361 |
| 26 | desktop › K01 BUG-005 [MEDIUM] optional number field with unparsable input is reported as valid | BİLİNEN KUSUR (beklenen hata) | 2.332 |
| 27 | desktop › K02 BUG-006 [MEDIUM] select option with surrounding spaces can never pass validation | BİLİNEN KUSUR (beklenen hata) | 2.336 |
| 28 | desktop › K03 BUG-007 [LOW] preview keeps a stale error after the field is made optional | BİLİNEN KUSUR (beklenen hata) | 2.416 |
| 29 | desktop › K04 BUG-008 [LOW] export file name breaks the Turkish capital İ | BİLİNEN KUSUR (beklenen hata) | 2.321 |
| 30 | desktop › K05 BUG-009 [LOW] Tab can move focus out of an open modal dialog | BİLİNEN KUSUR (beklenen hata) | 0.309 |
| 31 | desktop › K06 BUG-010 [LOW] a form with an empty title gets nameless card buttons | BİLİNEN KUSUR (beklenen hata) | 2.356 |
| 32 | scenarios › Scenario A: customer contact form — build, validate, autosave, reload, export | BAŞARILI | 0.881 |
| 33 | scenarios › Scenario B: registration form with 6 field types — invalid data, edit the schema, test again | BAŞARILI | 0.810 |
| 34 | scenarios › Scenario C: several forms — switch, delete one, keep the others, reload | BAŞARILI | 0.778 |
| 35 | desktop › full flow: create, fields, rules, validation, export, real reload, delete | BAŞARILI | 1.394 |
| 36 | desktop › 11 corrupt LocalStorage: no white page, clear message | BAŞARILI | 0.328 |
| 37 | desktop › keyboard: create a form and add a field without a mouse; focus is visible | BAŞARILI | 0.281 |
| 38 | mobile › M01 mobile: create, edit, preview, export and delete; no horizontal overflow; dialogs fit the screen | BAŞARILI | 0.896 |
| 39 | mobile › 12 mobile layout is usable and has no horizontal overflow | BAŞARILI | 0.515 |


## Canlı site testleri (`PW_BASE_URL=https://schemaforge-tcoderr.netlify.app npx playwright test`)

| # | Test | Sonuç | Süre (sn) |
|---|---|---|---|
| 1 | desktop › F01 first visit: empty state, nothing stored before the user acts | BAŞARILI | 1.565 |
| 2 | desktop › F02 first form from the empty state opens the editor and is stored | BAŞARILI | 0.859 |
| 3 | desktop › F03 second form, listing (newest first, counts, date) and "Düzenle" opens the right form | BAŞARILI | 1.279 |
| 4 | desktop › F04 title and description: live preview, list card and storage | BAŞARILI | 1.123 |
| 5 | desktop › F05 duplicate: "(kopya)", "(kopya 2)", fields copied and independent of the original | BAŞARILI | 1.025 |
| 6 | desktop › F06 delete form: Vazgeç, Escape and backdrop cancel; "Formu sil" deletes and survives reload | BAŞARILI | 1.304 |
| 7 | desktop › F07 every field type: defaults, preview control, unique JSON names | BAŞARILI | 1.221 |
| 8 | desktop › F08 placeholder and help text reach the preview; hidden where they do not apply | BAŞARILI | 1.313 |
| 9 | desktop › F09 required: marker in list and preview, aria-required, checkbox message | BAŞARILI | 1.281 |
| 10 | desktop › F10 rules: invalid e-mail, number range, text length, date range, select choice | BAŞARISIZ | 5.917 |
| 11 | desktop › F11 empty required submit, live re-validation, "Temizle" resets | BAŞARILI | 0.948 |
| 12 | desktop › F12 live preview follows label, type, options and order changes | BAŞARILI | 0.789 |
| 13 | desktop › F13 delete field: cancel keeps it; confirm removes it from list, preview and storage | BAŞARILI | 1.074 |
| 14 | desktop › F14 reorder with ↑/↓: list, preview, storage and export follow; edge buttons are disabled | BAŞARILI | 0.840 |
| 15 | desktop › F15 export: JSON content, real download, clipboard, warnings, three ways to close, focus return | BAŞARILI | 1.451 |
| 16 | desktop › F16 persistence: real reload in the editor keeps every setting; browser back/forward work | BAŞARILI | 1.289 |
| 17 | desktop › F17 broken storage: corrupt JSON, wrong shape, partly invalid data, unknown form link | BAŞARILI | 1.416 |
| 18 | desktop › F18 storage full / blocked: warning banner instead of silent data loss | BAŞARILI | 0.795 |
| 19 | desktop › F19 keyboard: create, add a field and delete via dialog without a mouse; Escape and focus order | BAŞARILI | 0.709 |
| 20 | desktop › F20 BUG-003 regression: skip link moves focus to the content and does not leave the editor | BAŞARISIZ | 5.864 |
| 21 | desktop › F21 BUG-001 regression: two tabs never overwrite each other&apos;s forms | BAŞARISIZ | 7.433 |
| 22 | desktop › F22 BUG-002 regression: "Temiz başlat" never deletes forms created after the warning | BAŞARISIZ | 6.148 |
| 23 | desktop › F24 BUG-004 regression: one click on "Gönder (test)" submits even when the last field turns invalid on blur | BAŞARISIZ | 5.878 |
| 24 | desktop › F23 network: the app loads without login and sends no form data anywhere | BAŞARILI | 1.089 |
| 25 | desktop › K01 BUG-005 [MEDIUM] optional number field with unparsable input is reported as valid | BİLİNEN KUSUR (beklenen hata) | 3.389 |
| 26 | desktop › K02 BUG-006 [MEDIUM] select option with surrounding spaces can never pass validation | BİLİNEN KUSUR (beklenen hata) | 2.890 |
| 27 | desktop › K03 BUG-007 [LOW] preview keeps a stale error after the field is made optional | BİLİNEN KUSUR (beklenen hata) | 2.894 |
| 28 | desktop › K04 BUG-008 [LOW] export file name breaks the Turkish capital İ | BİLİNEN KUSUR (beklenen hata) | 2.705 |
| 29 | desktop › K05 BUG-009 [LOW] Tab can move focus out of an open modal dialog | BİLİNEN KUSUR (beklenen hata) | 0.852 |
| 30 | desktop › K06 BUG-010 [LOW] a form with an empty title gets nameless card buttons | BİLİNEN KUSUR (beklenen hata) | 2.796 |
| 31 | scenarios › Scenario A: customer contact form — build, validate, autosave, reload, export | BAŞARILI | 2.433 |
| 32 | scenarios › Scenario B: registration form with 6 field types — invalid data, edit the schema, test again | BAŞARISIZ | 6.084 |
| 33 | scenarios › Scenario C: several forms — switch, delete one, keep the others, reload | BAŞARILI | 1.760 |
| 34 | desktop › full flow: create, fields, rules, validation, export, real reload, delete | BAŞARILI | 2.848 |
| 35 | desktop › 11 corrupt LocalStorage: no white page, clear message | BAŞARILI | 1.080 |
| 36 | desktop › keyboard: create a form and add a field without a mouse; focus is visible | BAŞARILI | 0.755 |
| 37 | mobile › M01 mobile: create, edit, preview, export and delete; no horizontal overflow; dialogs fit the screen | BAŞARILI | 1.557 |
| 38 | mobile › 12 mobile layout is usable and has no horizontal overflow | BAŞARILI | 1.171 |

Ekran görüntüleri tarayıcı testleri sırasında gerçek Edge penceresinden alınır: `docs/screenshots/` (yerel üretim derlemesi) ve `docs/screenshots/live/` (canlı site).
