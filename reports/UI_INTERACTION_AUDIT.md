# SchemaForge — Kullanıcı Arayüzü Etkileşim Envanteri

**Author / Maintainer:** Tugay Sinan Ergün · **GitHub:** TCoderr
**Denetim tarihi:** 19 Ekim 2026 · **Denetlenen kod:** commit `1afb33d` (başlangıç) + bu denetimdeki düzeltmeler
**Yöntem:** `src/` altındaki bütün `.tsx` dosyaları satır satır okundu. Her `button`, `a`, `input`, `select`, `textarea`, modal ve klavye dinleyicisi listelendi. Her kalem gerçek tarayıcıda (Playwright + Microsoft Edge, her test için ayrı ve temiz tarayıcı bağlamı) sonucu doğrulanarak test edildi. Yalnızca tıklanabildiğini görmek "başarılı" sayılmadı.

Test kimlikleri: `F..`, `K..`, `M01`, `Senaryo A/B/C` → `e2e/functional.spec.ts` · `E..` → `e2e/schemaforge.spec.ts` (mevcut 4 test) · `U:` → `src/App.test.tsx` (Vitest).

## Özet

| Ölçü | Sayı |
|---|---|
| Envanterdeki etkileşimli kontrol / etkileşim | **62** |
| Gerçek tarayıcıda sonucu doğrulanarak test edilen | **61** |
| Yalnızca kod incelemesi (tarayıcıda tetiklenemedi) | 1 (C05 "Sayfayı yenile", hata ekranı) |
| Arayüzde görünüp tıklanınca hiçbir şey yapmayan veya yanlış davranan kontrol | **2** bulundu ve düzeltildi: C01 "İçeriğe atla" (BUG-003), C52 "Gönder (test)" ilk tıklamanın kaybolması (BUG-004) |
| Kontrolle ilgili diğer hatalar | C03 "Temiz başlat" (BUG-002, düzeltildi); otomatik kayıt çoklu sekme (BUG-001, düzeltildi); 6 MEDIUM/LOW kusur (BUG-005…010, belgelendi) |

Uygulanmamış özellikler (ör. form içe aktarma, sürükle-bırak sıralama, şablon) hata sayılmadı; arayüzde bunlar için bir kontrol de yok.

## Envanter

Sütunlar: **Görünen ad** · **Kaynak dosya** · **Beklenen davranış** · **Çalıştığı koşul** · **Test senaryosu** · **Sonuç**

### Uygulama çerçevesi ve depolama uyarısı

| # | Görünen ad | Kaynak | Beklenen davranış | Koşul | Test | Sonuç |
|---|---|---|---|---|---|---|
| C01 | "İçeriğe atla" bağlantısı | `src/App.tsx` | İlk Tab durağı. Odağı içeriğe taşır, sayfayı değiştirmez | Her sayfa; klavye odağıyla görünür | F19, F20, U:BUG-003 | ✅ **Düzeltildi.** Önce `#main` hash'i yönlendiriciye gidiyor, düzenleyici kapanıp listeye dönülüyordu (BUG-003) |
| C02 | Logo "SchemaForge" | `src/App.tsx` | Form listesine döner | Her sayfa | F03 | ✅ |
| C03 | "Temiz başlat" | `src/components/StorageBanner.tsx` | Okunamayan kaydı siler, uyarıyı kapatır | Bozuk veri uyarısı açıkken | F17, F22, U:11a, U:BUG-002 | ✅ **Düzeltildi.** Önce, uyarıdan sonra oluşturulan formları onaysız siliyordu (BUG-002). Artık yalnızca yeni form yokken görünüyor |
| C04 | "Kapat" (uyarı şeridi) | `StorageBanner.tsx` | Uyarıyı gizler, veriye dokunmaz | Bozuk/kısmi veri uyarısı | F17 | ✅ |
| C05 | "Sayfayı yenile" | `src/components/ErrorBoundary.tsx` | `location.reload()` | Yalnızca beklenmeyen bir render hatasında | — | ⚪ **Test edilmedi.** Depolama okuması bütün girdileri doğruladığı için tarayıcıda hata ekranı tetiklenemedi; kod incelemesi: tek satır `window.location.reload()` |

### Form listesi (`src/pages/DashboardPage.tsx`)

| # | Görünen ad | Beklenen davranış | Koşul | Test | Sonuç |
|---|---|---|---|---|---|
| C06 | "+ Yeni form" | Form oluşturur, kaydeder, düzenleyiciyi açar | Her zaman | F03, Senaryo A/B/C, E1 | ✅ |
| C07 | "İlk formu oluştur" | Aynı işlev, boş durum ekranında | Hiç form yokken | F02, F22, M01 | ✅ |
| C08 | Kart: "Düzenle" | İlgili formu düzenleyicide açar | Form varken | F03, Senaryo C | ✅ Doğru form açılıyor (başlık ve alan sayısı doğrulandı) |
| C09 | Kart: "Kopyala" | "(kopya)", "(kopya 2)" adıyla, bağımsız alanlarla kopya | Form varken | F05, U:8 | ✅ Kopyada yapılan değişiklik aslına yansımıyor |
| C10 | Kart: "Sil" | Onay penceresi açar | Form varken | F06, Senaryo C, M01, E1 | ✅ |

### Onay penceresi (`src/components/ConfirmDialog.tsx`, form ve alan silmede ortak)

| # | Görünen ad | Beklenen davranış | Test | Sonuç |
|---|---|---|---|---|
| C11 | "Vazgeç" | Kapatır, hiçbir şey silinmez; açılışta odak burada | F06, F13, F19 | ✅ Odak açan düğmeye geri dönüyor |
| C12 | "Formu sil" | Formu ve alanlarını siler; yenilemeden sonra da yok | F06, Senaryo C | ✅ |
| C13 | "Alanı sil" | Alanı listeden, önizlemeden ve depodan kaldırır | F13, F19, Senaryo B | ✅ |
| C14 | Arka plana tıklama | Vazgeç ile aynı | F06 | ✅ |
| C15 | Escape tuşu | Vazgeç ile aynı | F06 | ✅ |

### Düzenleyici (`src/pages/EditorPage.tsx`)

| # | Görünen ad | Beklenen davranış | Test | Sonuç |
|---|---|---|---|---|
| C16 | "← Formlar" | Listeye döner | F03, F06, Senaryo C | ✅ |
| C17 | "Form başlığı" | Önizleme başlığı, kart ve depo anında güncellenir | F04, Senaryo C | ✅ |
| C18 | "Form açıklaması" | Önizleme, kart ve depo güncellenir | F04 | ✅ |
| C19 | "JSON'u dışa aktar" | Dışa aktarma penceresini açar | F15, F25, Senaryo A | ✅ |
| C20 | "Form listesine dön" | Bilinmeyen form bağlantısında listeye döner | F17, U:11c | ✅ |

### Alanlar paneli (`src/components/FieldsPanel.tsx`)

| # | Görünen ad | Beklenen davranış | Test | Sonuç |
|---|---|---|---|---|
| C21–C27 | "Kısa metin / Uzun metin / Sayı / E-posta / Seçim kutusu / Onay kutusu / Tarih alanı ekle" (7 düğme) | Doğru türde, varsayılan etiketli, benzersiz JSON adlı alan ekler ve seçer | F07 (7 türün hepsi + ikinci aynı tür `ad_soyad_2`) | ✅ 7/7; önizlemedeki denetim türü doğrulandı |
| C28 | Alan satırı (seçme) | Alanı Özellikler panelinde açar | F10, F16, Senaryo B | ✅ |
| C29 | "↑" yukarı taşı | Sıra liste, önizleme, depo ve JSON'da değişir; ilk satırda devre dışı | F12, F14, U:8 | ✅ |
| C30 | "↓" aşağı taşı | Aynı; son satırda devre dışı | F14 | ✅ |
| C31 | "✕" alanı sil | Onay penceresi açar | F13, Senaryo B | ✅ |

### Özellikler paneli (`src/components/PropertiesPanel.tsx`)

| # | Görünen ad | Beklenen davranış | Koşul | Test | Sonuç |
|---|---|---|---|---|---|
| C32 | "Alan türü" | Türü değiştirir; uygun olmayan kurallar/seçenekler düşer | Alan seçiliyken | F12, E1, U:5 | ✅ |
| C33 | "Etiket" | Önizleme etiketi + otomatik JSON adı | Alan seçiliyken | F12, F25, U:4b | ✅ |
| C34 | "Alan adı (JSON anahtarı)" | Elle düzenlenince etiketi izlemeyi bırakır; geçersiz ve yinelenen ad uyarılır | Alan seçiliyken | F25 | ✅ |
| C35 | "Yer tutucu (placeholder)" | Önizlemede `placeholder` | Metin, uzun metin, sayı, e-posta | F08, Senaryo A | ✅ Onay, seçim ve tarihte gizli (doğrulandı) |
| C36 | "Açıklama / yardım metni" | Önizlemede yardım metni, `aria-describedby` | Her tür | F08 | ✅ |
| C37 | "Zorunlu alan" | Listede ve önizlemede `*`, `aria-required`, gönderimde hata | Her tür | F09, F11, Senaryo A/B | ✅ |
| C38 | "Seçenekler" | Her satır bir seçenek; boş satır dışa aktarılmaz | Seçim kutusu | F12, F15 | ✅ Boşluklu seçenek kusuru: BUG-006 (MEDIUM, belgelendi) |
| C39–C40 | "En az / En fazla karakter" | Uzunluk kuralı; tarayıcı fazlasını yazdırmıyor | Metin, uzun metin (e-posta: yalnızca en fazla) | F10, Senaryo A | ✅ |
| C41–C42 | "En küçük / En büyük değer" | Aralık kuralı; çelişkili kural uyarısı | Sayı | F10, Senaryo B | ✅ |
| C43–C44 | "En erken / En geç tarih" | Tarih aralığı kuralı | Tarih | F10, F24, Senaryo B | ✅ |

### Canlı önizleme (`src/components/PreviewPanel.tsx`)

| # | Görünen ad | Beklenen davranış | Test | Sonuç |
|---|---|---|---|---|
| C45 | Kısa metin girişi | Zorunlu ve uzunluk doğrulaması | F10, F11 | ✅ |
| C46 | Uzun metin girişi | Aynı | Senaryo A | ✅ |
| C47 | Sayı girişi | Aralık doğrulaması; harf yazılamıyor | F10, Senaryo B | ✅ / ⚠️ BUG-005 (MEDIUM): `1-2` gibi ayrıştırılamayan girdi isteğe bağlı alanda geçerli sayılıyor |
| C48 | E-posta girişi | Biçim doğrulaması | F10, Senaryo B | ✅ |
| C49 | Seçim kutusu | "Listeden bir seçenek seçin" / zorunlu | F10, Senaryo A | ✅ / ⚠️ BUG-006 |
| C50 | Onay kutusu | Zorunluysa işaretlenmeli | F09, E1 | ✅ |
| C51 | Tarih girişi | Aralık doğrulaması | F10, F24 | ✅ |
| C52 | "Gönder (test)" | Bütün alanları doğrular, "N alanda hata var" veya "Form geçerli" | F09–F11, F24, Senaryo A/B | ✅ **Düzeltildi.** Son düzenlenen alan bulanıklaşınca (blur) altına hata eklenip düğme imlecin altından kayıyor, **ilk tıklama kayboluyordu** (BUG-004) |
| C53 | "Temizle" | Değerleri, hataları ve sonucu sıfırlar | F11, F24 | ✅ (BUG-004 düzeltmesi bu düğmeye de uygulandı) |

### JSON dışa aktarma penceresi (`src/components/ExportDialog.tsx`)

| # | Görünen ad | Beklenen davranış | Test | Sonuç |
|---|---|---|---|---|
| C54 | "✕" (Kapat) | Kapatır, odak açan düğmeye döner | F15 | ✅ |
| C55 | "Panoya kopyala" | JSON panoya, "Panoya kopyalandı." | F15 (pano gerçekten okundu) | ✅ |
| C56 | "JSON indir" | `<başlık>.schemaforge.json` indirilir | F15, Senaryo A, E1 (dosya içeriği okundu) | ✅ / ⚠️ BUG-008 (LOW): "İletişim" → `i-letişim…` |
| C57 | JSON metni (odaklanabilir) | Dışa aktarılacak içeriğin aynısı | F14, F15 | ✅ İç kimlikler (`id`) dışa aktarılmıyor |
| C58 | Arka plana tıklama | Kapatır | F15 | ✅ |
| C59 | Escape | Kapatır, odak geri döner | F15, U:10 | ✅ / ⚠️ BUG-009 (LOW): Tab ile pencere dışına çıkılabiliyor (odak tuzağı yok) |

### Klavye, gezinme ve kalıcılık

| # | Etkileşim | Beklenen davranış | Test | Sonuç |
|---|---|---|---|---|
| C60 | Tab sırası ve görünür odak | Bütün kontroller klavyeyle; odak çerçevesi görünür | F19, E3 | ✅ Fare kullanmadan form oluşturma, alan ekleme ve onaylı silme |
| C61 | Tarayıcı geri / ileri | Hash yönlendirme geçmişi | F16 | ✅ |
| C62 | Otomatik kayıt (kaydet düğmesi yok) ve doğrudan bağlantı `#/forms/<id>` | Her değişiklik LocalStorage'a; yenilemede aynı ekran | F16, F21, Senaryo A/C, U:9 | ✅ **Düzeltildi.** İki sekmede çalışırken bir sekme diğerinin formlarını siliyordu (BUG-001, CRITICAL) |

## Etkileşimli olmayan durum ekranları (kontrol sayısına dahil değil)

| Durum | Kaynak | Test | Sonuç |
|---|---|---|---|
| Boş durum "Henüz form yok" | `DashboardPage.tsx` | F01 | ✅ Kullanıcı bir şey yapmadan depoya hiçbir şey yazılmıyor |
| "Form bulunamadı" | `EditorPage.tsx` | F17, U:11c | ✅ |
| Bozuk / kısmi veri uyarısı | `StorageBanner.tsx` | F17, E2, U:11a–b | ✅ Ham veri yedekleniyor, üzerine yazılmıyor |
| Kaydedilemedi uyarısı (depo dolu / engelli) | `StorageBanner.tsx` | F18 | ✅ |
| Tasarım uyarıları (çelişkili kural, geçersiz ad) | `PropertiesPanel.tsx`, `ExportDialog.tsx` | F10, F15, F25 | ✅ |
