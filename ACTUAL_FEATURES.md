# SchemaForge — Gerçek Özellikler (ACTUAL_FEATURES)

**Author / Maintainer:** Tugay Sinan Ergün · **GitHub:** TCoderr · **Tarih:** 19 Ekim 2026 · **Sürüm:** 1.0.0 · **Güncelleme:** 1.1 fonksiyonel denetim (19.10.2026)

Bu belge SchemaForge'un **bugün gerçekten ne yaptığını** kaydeder. FormPilot AI kampanyasının (`D:\Project\FormPilot-AI\PRODUCT_ALIGNMENT_CHECKLIST.md`) vaatleri, sonradan bu belgeye göre kontrol edilebilir.

Durumlar:
- **Implemented and tested:** Kod var; otomatik testle doğrulandı. Test adı verildi.
- **Implemented but not tested:** Kod var; otomatik testi yok.
- **Planned:** Kod yok; ileride yapılabilir.
- **Unsupported:** Kapsam dışı; uygulamada yok.

Test dosyaları:
- **Birim:** `src/lib/lib.test.ts`
- **Entegrasyon:** `src/App.test.tsx` (React Testing Library)
- **Tarayıcı:** `e2e/schemaforge.spec.ts`, `e2e/functional.spec.ts` (F.., K.., Senaryo A–C, M01; Playwright + Microsoft Edge)

## 1. Özellikler

| # | Özellik | Durum | Kanıt (test) |
|---|---|---|---|
| F1 | Yeni form oluşturma | Implemented and tested | App.test `1.`; e2e full flow |
| F2 | Formları listeleme (başlık, açıklama, alan sayısı, son güncelleme) | Implemented and tested | App.test `2.`; e2e full flow |
| F3 | Form başlığı ve açıklamasını düzenleme | Implemented and tested | App.test `3.`; e2e full flow |
| F4 | Form silme, **onay penceresiyle** (Vazgeç/Escape iptal eder) | Implemented and tested | App.test `8.`; e2e full flow |
| F5 | Form kopyalama | Implemented and tested | App.test `8b.`; lib.test duplicateForm |
| F6 | Alan türleri: kısa metin, uzun metin, sayı, e-posta, seçim kutusu, onay kutusu, tarih | Implemented and tested | e2e full flow (7 tür, dışa aktarmada sırayla) |
| F7 | Alan ekleme | Implemented and tested | App.test `4.` |
| F8 | Alan türünü değiştirme (uygun olmayan kurallar ve seçenekler temizlenir) | Implemented and tested | App.test `5.`; lib.test changeFieldType; e2e |
| F9 | Etiket, yer tutucu, yardım metni ve zorunluluk düzenleme | Implemented and tested | App.test `4b.`, `6.`; e2e (placeholder) |
| F10 | JSON alan adı: etiketten otomatik üretim (Türkçe karakter dönüşümü), benzersizlik ve biçim uyarısı | Implemented and tested | App.test `4b.`; lib.test toFieldName/uniqueName/formProblems |
| F11 | Alan sırasını değiştirme (yukarı/aşağı) | Implemented and tested | App.test `8b.`; lib.test moveItem |
| F12 | Alan silme, onay penceresiyle | Implemented and tested | App.test `7.` |
| F13 | Doğrulama kuralları: zorunlu, en az/en fazla karakter, e-posta biçimi, sayı aralığı, tarih aralığı, seçim listesi, zorunlu onay kutusu | Implemented and tested | lib.test validateValue (6 test); App.test `6.`; e2e |
| F14 | Çelişkili kural uyarıları (ör. en az > en fazla, boş seçenek listesi) | Implemented and tested | lib.test "design problems" |
| F15 | Canlı önizleme: tasarımdaki değişiklik aynı anda önizlemede görünür | Implemented and tested | App.test `4.`, `4b.`, `5.`; e2e |
| F16 | Önizlemede gerçek alan türleri ve çalışan doğrulama (alandan çıkınca ve gönderince); hatalar `aria-invalid` ve `aria-describedby` ile bağlı | Implemented and tested | App.test `6.`; e2e full flow |
| F17 | Önizleme gönderimi veriyi hiçbir yere göndermez; yalnızca doğrular | Implemented and tested | App.test `6.` (başarı mesajı); uygulamada ağ isteği yok |
| F18 | LocalStorage kalıcılığı: sayfa yenilenince veriler korunur | Implemented and tested | App.test `9.`; e2e full flow (**gerçek yenileme**); lib.test storage |
| F19 | Bozuk LocalStorage verisi: çökmez, uyarı gösterir, ham veriyi yedekler, "Temiz başlat" sunar | Implemented and tested | App.test `11a.`; lib.test corrupt/wrong shape; e2e corrupt |
| F20 | Kısmen geçersiz kayıtlar: geçerli formlar kurtarılır, kaç kaydın atlandığı bildirilir | Implemented and tested | App.test `11b.`; lib.test partial |
| F21 | Depolama erişilemezse veya dolarsa uygulama çökmez | Implemented and tested | lib.test "storage that throws" |
| F22 | Kayıt başarısız olursa kullanıcıya uyarı bandı | Implemented and tested | functional F18 (depo dolu taklidi) |
| F23 | JSON dışa aktarma: geçerli JSON (biçim `schemaforge.form` v1); alan sırası, tür, etiket, ad, zorunluluk, kurallar ve seçenekler | Implemented and tested | lib.test JSON export; App.test `10.`; e2e (**indirilen dosya** okundu) |
| F24 | JSON dosyası indirme | Implemented and tested | e2e full flow (download olayı) |
| F25 | JSON'u panoya kopyalama | Implemented and tested | functional F15 (izin verildi, pano içeriği okundu) |
| F26 | Dışa aktarmadan önce tasarım sorunları uyarısı | Implemented and tested | functional F15, F25 |
| F27 | Bilinmeyen form bağlantısında "Form bulunamadı" sayfası | Implemented and tested | App.test `11c.` |
| F28 | Hata sınırı (ErrorBoundary): beklenmeyen hatada beyaz sayfa yerine kurtarma ekranı | Implemented but not tested | — |
| F29 | Kullanıcı metni HTML olarak işlenmez (`dangerouslySetInnerHTML` kullanılmaz) | Implemented and tested | App.test "security" |
| F30 | Duyarlı (responsive) arayüz; mobilde yatay taşma yok | Implemented and tested | e2e mobile (390 px) |
| F31 | Klavye ile kullanım ve görünür odak göstergesi | Implemented and tested | e2e keyboard |
| F32 | Onay penceresinde odak yönetimi (Vazgeç'e odaklanır, Escape kapatır) | Implemented and tested | App.test `8.` (Escape) |
| F33 | "İçeriğe atla" bağlantısı | Implemented and tested | functional F19, F20; App.test BUG-003 (1.1'de düzeltildi: düzenleyiciyi kapatıyordu) |
| F34 | Verinin yalnızca bu tarayıcıda saklandığı açıklaması | Implemented and tested | Başlık ve alt bilgide sabit metin; ekran görüntüleri |
| F35 | Hash tabanlı yönlendirme ve Netlify yönlendirme kuralı (`netlify.toml`, `public/_redirects`) | Implemented and tested | Canlı sitede (https://schemaforge-tcoderr.netlify.app) Playwright 4/4; `/forms/abc` → HTTP 200 |
| F36 | Çoklu sekme: başka sekmede kaydedilen değişiklik bu sekmeye alınır, üzerine yazılmaz | Implemented and tested | functional F21 (iki gerçek sekme); App.test BUG-001 (1.1'de eklendi) |
| P1 | JSON içe aktarma (şema doğrulamalı) | Planned | Kod yok |
| P2 | Alanları sürükle-bırak ile sıralama | Planned | Şu an yukarı/aşağı butonları var |
| P3 | Koşullu alanlar (bir cevaba göre alan gösterme) | Planned | Kod yok |
| P4 | Ayrı şablon kütüphanesi | Planned | Kod yok. Formlar kaydedilip kopyalanabiliyor ama ayrı bir "şablon" kavramı yok |
| U1 | Yapay zekâ ile form üretme veya öneri | Unsupported | — |
| U2 | Belge / PDF işleme, dosya biçimi dönüştürme | Unsupported | — |
| U3 | Harici servis entegrasyonları | Unsupported | — |
| U4 | Sunucu tarafı saklama, kullanıcı hesabı, cihazlar arası senkronizasyon | Unsupported | — |
| U5 | Form yanıtlarını toplama ve analiz | Unsupported | Önizleme yalnızca doğrular, veri göndermez |

## 2. FormPilot AI kampanya vaatleriyle eşleşme

Kampanya vaatleri `FormPilot-AI/PRODUCT_ALIGNMENT_CHECKLIST.md` dosyasındaki kodlarla (A1–A17, C1–C5) listelenmiştir. **Bu görevde FormPilot-AI klasörü değiştirilmedi.** O listedeki kutular, aşağıdaki bilgiler kullanılarak yazar tarafından işaretlenmelidir.

| Kampanya vaadi | SchemaForge durumu |
|---|---|
| A1 Dinamik form oluşturma | Karşılanıyor: F1, F6, F15 |
| A2 Alan ekleme | Karşılanıyor: F7 |
| A3 Alan düzenleme | Karşılanıyor: F8, F9, F12 |
| A4 Alan seçme (hazır alan türleri) | Karşılanıyor: F6 |
| A5 Zorunlu alan | Karşılanıyor: F13 |
| A6 E-posta biçimi | Karşılanıyor: F13 |
| A7 En az / en fazla uzunluk | Karşılanıyor: F13 |
| A8 Canlı önizleme | Karşılanıyor: F15, F16 |
| A9 "Anında" önizleme | Değişiklik aynı render içinde önizlemeye yansıyor (F15). *(19.10.2026: canlı sitede ölçüldü, en fazla 0,8 ms; FormPilot-AI denetimi)* |
| A10 Tarayıcıda saklama, sunucuya istek yok | Karşılanıyor: F18. *(1.1: ağ testi eklendi, functional F23: veri taşıyan istek yok)* |
| A11 "Şablonunu kaydet" | **Kısmen.** Form kaydedilip kopyalanabiliyor (F5, F18) ama ayrı bir "şablon" kavramı yok (P4). Kampanya metni "tasarımını kaydet" olarak düzeltilmeli. *(19.10.2026: FormPilot v1.3'te video "Tasarımın otomatik kaydedilir" olarak düzeltildi; karşılanıyor)* |
| A12 JSON dışa aktarma | Karşılanıyor: F23, F24 |
| A13 Kod yazmadan form tasarlama | Karşılanıyor: arayüz kod gerektirmiyor |
| A14 Kurulum gerektirmeyen, tarayıcıda çalışan | Karşılanıyor: https://schemaforge-tcoderr.netlify.app (canlı sitede testler geçti) |
| A15 Hesap veya sunucu gerektirmeyen | Karşılanıyor (U4: hesap yok) |
| A16 Tek ekranda alan + kural + önizleme | Karşılanıyor: masaüstünde üç panel; mobilde alt alta |
| A17 Demo formu | Kısmen: Herkese açık sitede (https://schemaforge-tcoderr.netlify.app) form oluşturulabiliyor. Hazır bir "demo formu" şablonu yok. *(19.10.2026: FormPilot v1.3'te CTA "İlk formunu oluştur" olarak düzeltildi; boş ekrandaki "İlk formu oluştur" düğmesiyle karşılanıyor)* |
| C1–C5 (yapay zekâ, PDF, entegrasyon, sunucu, yanıt toplama) | Uygulamada yok (U1–U5); kampanyanın "vaat etmiyoruz" ifadeleriyle uyumlu |
