# SchemaForge — Fonksiyonel ve Uçtan Uca Test Raporu

**Author / Maintainer:** Tugay Sinan Ergün · **GitHub:** TCoderr · **Tarih:** 19 Ekim 2026
**Kontrol edilen commit:** başlangıç `1afb33d`; düzeltmeler `952fa87` (GitHub ve Netlify'da yayında)
**Ortam:** Windows 11, Node.js, Playwright 1.64 + yüklü Microsoft Edge (`channel: msedge`, yeni tarayıcı indirilmedi). Her test ayrı ve temiz bir tarayıcı bağlamında çalıştı. Yerel testler `npm run build && npm run preview` üretim derlemesine karşı çalıştı.

## Sürüm 1.0.2 (kalan 6 hatanın düzeltilmesi)

| Kontrol | Çıkış kodu | Sonuç |
|---|---|---|
| TypeScript | **0** | Hatasız |
| ESLint | **0** | Hatasız |
| Vitest | **0** | **43/43** (1.0.1: 37; +6 regresyon testi) |
| Production build | **0** | Başarılı |
| Playwright, yerel | **0** | **39 test: 39 başarılı · 0 bilinen kusur · 0 başarısız** |

- **Bilinen kusur testleri:** K01–K06 (`test.fail`) F26–F31 normal testlerine dönüştürüldü. Artık `test.fail` kullanan test yok.
- **Test sayısı:** Toplam 39 olarak aynı kaldı; hiçbir test silinmedi veya atlanmadı.
- **Düzeltmeden önce:** F26–F31 6/6 başarısızdı.
- **Canlı sonuç:** `LIVE_SITE_VERIFICATION.md` §4.

## Sürüm 1.0.1 sonuçları (yerel, ilk düzeltmelerden sonra)

| Kontrol | Komut | Çıkış kodu | Sonuç | Ham çıktı |
|---|---|---|---|---|
| TypeScript | `npx tsc -b --pretty false` | **0** | Hatasız | `reports/test-results/typecheck.txt` |
| ESLint | `npx eslint .` | **0** | Hatasız | `lint.txt` |
| Birim + entegrasyon (Vitest + RTL) | `npx vitest run` | **0** | **37/37** (önceki 33 + 4 regresyon testi) | `unit-tests.txt`, `unit-junit.xml` |
| Production build | `npm run build` | **0** | Başarılı | `build.txt` |
| Tarayıcı (Playwright) | `npx playwright test` | **0** | **39 test çalıştı: 33 başarılı · 6 bilinen kusur (beklenen hata) · 0 başarısız** | `e2e-tests.txt`, `e2e-junit.xml`, `e2e-local.json` |

- **"Atlanan 39" ne demek:** Her test yalnızca kendi projesinde (masaüstü veya mobil) çalışır, diğerinde atlanır. Raporda gizlenen bir test yok.
- **6 bilinen kusur testi:** `test.fail()` ile işaretli K01–K06. Bunlar düzeltilmemiş MEDIUM/LOW hataları belgeler ve **başarılı sayılmaz** (`BUG_FIX_REPORT.md`).
- **Tekrar çalıştırma:** Komutların tamamı `node scripts/collect-results.mjs` ile yeniden çalıştırılır. Script her komutun gerçek çıkış kodunu dosyanın başına `# exit: N` olarak yazar.

## Test kapsamı (istenen akışlar → testler)

| İstenen akış | Test | Doğrulanan gerçek sonuç |
|---|---|---|
| İlk giriş, boş durum | F01 | Boş durum metinleri; kullanıcı bir şey yapmadan depoya yazılmıyor |
| İlk form | F02 | Adres `#/forms/<id>`, başlık "Adsız form", depoda 1 form |
| İkinci form, listeleme | F03 | En yeni üstte; alan sayısı ve tarih; "Düzenle" doğru formu açıyor |
| Başlık değiştirme | F04, Senaryo C | Önizleme, kart ve depo |
| Kopyalama | F05 | "(kopya)", "(kopya 2)"; kopya aslından bağımsız |
| Silme ve iptal | F06, F13 | Vazgeç/Escape/arka plan iptal ediyor; silme yenilemeden sonra da kalıcı |
| Yeni alan, 7 alan türü | F07 | 7 tür; önizleme denetimi; benzersiz JSON adları |
| Açıklama ve placeholder | F08 | `placeholder`, `aria-describedby`; uygun olmayan türlerde gizli |
| Zorunlu alan | F09 | `*`, `aria-required`, mesajlar |
| Geçersiz e-posta ve sayı | F10, F26 | Hata mesajları; harf yazılamıyor; ayrıştırılamayan sayı reddediliyor (BUG-005, 1.0.2) |
| Boş zorunlu alanla gönderme | F11 | "N alanda hata var", `aria-invalid`, "Temizle" |
| Canlı önizleme | F12 | Etiket, tür, seçenek ve sıra anında yansıyor |
| Alan silme, alan sıralama | F13, F14 | Liste, önizleme, depo ve JSON sırası |
| JSON dışa aktarma | F15, Senaryo A | Pencere içeriği, **indirilen dosya okundu**, **pano okundu**, tasarım uyarıları, 3 kapatma yolu, odağın geri dönmesi |
| Yenileme sonrası kalıcılık | F16, Senaryo A/C | Gerçek `page.reload()`; depo yenilemeden önceki hâliyle birebir aynı |
| Bozuk LocalStorage | F17, E2 | Bozuk JSON, yanlış biçim, sayı, kısmi veri; yedek anahtarı; "Form bulunamadı" |
| Depo dolu / engelli | F18 | Kaydedilemedi uyarısı |
| Klavye ve erişilebilirlik | F19, F20, E3, F30, F31 | Fare olmadan oluşturma, ekleme ve onaylı silme; görünür odak; "İçeriğe atla" |
| Çoklu sekme | F21 | İki gerçek sekme; veri kaybı yok |
| Ağ | F23 | Oturumsuz HTTP 200; veri taşıyan istek yok |
| JSON adı | F25 | Otomatik/elle; geçersiz ve yinelenen ad uyarısı |
| Mobil | M01, E4 | 390×844 dokunmatik: oluşturma, doğrulama, dışa aktarma, silme; yatay taşma yok; pencereler ekrana sığıyor |
| Konsol hataları | **Her test** | Otomatik fixture: birinci taraf konsol hatası, sayfa hatası, başarısız istek veya HTTP ≥ 400 varsa test başarısız olur. Üçüncü taraf kaynaklar ayrı not edilir |

## Bütünleşik senaryolar

| Senaryo | Adımlar | Sonuç |
|---|---|---|
| **A. Müşteri iletişim formu** | 4 alan, kurallar, placeholder → boş gönderim (3 hata) → doğru veri → "Form geçerli" → kaydet düğmesi olmadığı doğrulandı (otomatik kayıt) → gerçek yenileme → depo birebir aynı → JSON indirildi ve **beklenen JSON'la alan alan eşleşti** | ✅ |
| **B. Kayıt formu (6 tür)** | Hatalı verilerle 6 hata → şema düzenlendi (yaş sınırı, zorunluluk kaldırıldı, alan silindi) → yeniden test → "Form geçerli" | ✅ (düzeltmeden önce BUG-004 yüzünden başarısızdı) |
| **C. Çoklu form** | 3 form → formlar arasında geçiş ve başlık değişikliği → biri silindi → yenileme → kalan 2 form, başlıklar ve alan sayıları doğru | ✅ |

## Düzeltmelerden önceki ve sonraki durum

| Çalıştırma | Sonuç | Kayıt |
|---|---|---|
| Yerel, düzeltmeden önce | 6 başarısız (5 uygulama hatası + 1 test yazım hatası) | `reports/test-results/before-fix/` |
| Canlı site `1afb33d`, dağıtımdan önce | 38 test: 26 başarılı · 6 bilinen kusur · **6 başarısız** (6'sı da uygulama hatası: BUG-001–004) | `reports/test-results/live-before-deploy/` |
| Yerel, düzeltmeden sonra | 39 test: 33 başarılı · 6 bilinen kusur · **0 başarısız** | `reports/test-results/` |
| Canlı site, yeni dağıtımdan sonra (`952fa87`, deploy `6ad6325a192f2a42c5a80c9f`) | 39 test: 33 başarılı · 6 bilinen kusur · **0 başarısız** | `reports/test-results/live-after-deploy/` |

## Kanıtlar

- **Playwright kayıtları:** `reports/test-results/e2e-tests.txt` (liste çıktısı), `e2e-junit.xml`, `e2e-local.json`. Başarısız testlerin sayfa görüntüleri Playwright'ın `test-results/` klasöründe tutulur; git'e girmez.
- **Ekran görüntüleri:** `reports/screenshots/local/` ve `reports/screenshots/live/`. Boş durum, A/B/C senaryoları, JSON dışa aktarma, bozuk veri ve mobil ekran görüntüleri test sırasında gerçek Edge penceresinden alındı.

## Kalan riskler

- 6 açık MEDIUM/LOW hata (BUG-005…010).
- "Sayfayı yenile" hata ekranı tarayıcıda tetiklenemedi; yalnızca kod incelemesiyle kontrol edildi.
- Testler yalnızca Chromium tabanlı Edge'de çalıştı. Firefox ve Safari test edilmedi; yeni tarayıcı indirmemek için bilerek yapılmadı.
- Ekran okuyucuyla elle test yapılmadı; erişilebilirlik kontrolü rol, ad ve odak düzeyinde.
- Çoklu sekmede aynı alana aynı anda yazılırsa son yazan kazanır.
