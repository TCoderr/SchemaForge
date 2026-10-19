# SchemaForge — Hata Düzeltme Raporu

**Author / Maintainer:** Tugay Sinan Ergün · **GitHub:** TCoderr · **Tarih:** 19 Ekim 2026
**Başlangıç commit'i:** `1afb33d` (GitHub `main` ve canlı Netlify sürümüyle aynı; canlı JS/CSS dosyaları bu commit'in build çıktısıyla bayt bayt aynı)

## Özet

| Önem | Bulunan | Düzeltilen | Açık |
|---|---|---|---|
| CRITICAL | 1 | 1 | 0 |
| HIGH | 3 | 3 | 0 |
| MEDIUM | 2 | 2 (1.0.2) | 0 |
| LOW | 4 | 4 (1.0.2) | 0 |
| **Toplam** | **10** | **10** | **0** |

**1.0.2 güncellemesi (19.10.2026):** 1.0.1'de açık kalan 6 MEDIUM/LOW hata da düzeltildi (aşağıda "1.0.2 düzeltmeleri"). Bilinen kusur testleri (K01–K06, `test.fail`) silinmedi veya atlanmadı; normal regresyon testlerine (F26–F31) dönüştürülüp genişletildi.

Görev tanımına göre CRITICAL ve HIGH hatalar düzeltildi. MEDIUM ve LOW hatalar düzeltilmedi; her biri `test.fail()` ile işaretli bir testle belgelendi (`e2e/functional.spec.ts` K01–K06). Bu testler hata sürdükçe "beklenen hata" olarak geçer. Biri düzelirse Playwright bunu ayrıca bildirir. Bu 6 test hiçbir raporda "başarılı" olarak sayılmadı.

**Hataların kanıtı:**
- **Düzeltmeden önce, yerel:** 6 test başarısız oldu (`reports/test-results/before-fix/e2e-local-before-fix.txt`).
  - 5'i uygulama hatasıydı: F10, F20, F21, F22, Senaryo B.
  - 1'i (F05) benim test beklentimdeki hataydı. Düzenleyici ilk alanı seçili açıyor, test ikinci alanı bekliyordu; uygulama doğruydu ve test düzeltildi.
- **Değişmemiş canlı site (`1afb33d`):** 6 test başarısız oldu ve 6'sı da uygulama hatası: F10, F20, F21, F22, F24, Senaryo B (`reports/test-results/live-before-deploy/`).
- **Birim regresyon testleri:** Düzeltme kodu geçici olarak geri alındığında 4/4 başarısız oldu, düzeltmeyle 4/4 geçti.
- **Test yazımında düzeltilen diğer hatalar** (uygulama hatası sayılmadı):
  - F14: Devre dışı düğmeye tıklama; ilk çalıştırmadan önce fark edildi.
  - F21: Sekme yenilendikten sonra hâlâ düzenleyicide olduğu için form listesi sayılamıyordu.

## Düzeltilen hatalar

### BUG-001 — CRITICAL — İki sekmede çalışırken formlar kayboluyor (veri kaybı)
- **Yeniden üretme:**
  1. A ve B sekmelerinde uygulamayı aç.
  2. A'da yeni bir form oluştur.
  3. B'de (yenilemeden) bir form oluştur.
  4. Sonuç: A'nın formu depodan silinir. Keşif kaydında `["Sekme B formu","Sekme A formu"]` görüldü; "Sekme A ikinci form" yoktu.
- **Neden:** `useForms` her değişiklikte bellekteki **bütün** listeyi LocalStorage'a yazıyor. B'nin listesi A'nın son değişikliğinden önceki hâldi.
- **Düzeltme:** `src/hooks/useForms.ts` başka sekmeden gelen `storage` olayını dinliyor. Geçerli yeni listeyi alıyor ve kendi eski kopyasını yazmıyor. Bozuk veya silinmiş değer yok sayılıyor. 13 satır.
- **Regresyon testleri:**
  - **F21 (tarayıcı, aynı profilde iki gerçek sekme):** B, A'nın değişikliğini yenilemeden görüyor; 3 form da korunuyor.
  - **U:BUG-001 (Vitest):** Tek sekmede `storage` olayı taklit ediliyor.
- **Kalan risk:** İki sekmede **aynı alana aynı anda** yazılırsa son yazan kazanır. Bu, liste düzeyinde veri kaybı değildir.

### BUG-002 — HIGH — "Temiz başlat" yeni oluşturulan formları onaysız siliyor
- **Yeniden üretme:**
  1. Bozuk bir depo değeriyle uygulamayı aç; uyarı şeridi görünür.
  2. "İlk formu oluştur" ile form oluştur.
  3. Uyarıda hâlâ duran "Temiz başlat" düğmesine bas.
  4. Sonuç: Form onay sorulmadan silinir.
- **Neden:** Düğme, kullanıcı yeni veri ürettikten sonra da görünüyordu ve deponun tamamını siliyordu.
- **Düzeltme:** `StorageBanner` / `App.tsx`: Düğme yalnızca hiç form yokken gösteriliyor. Kullanıcı form oluşturunca okunamayan değerin üzerine zaten yazılmış oluyor ve temizlenecek bir şey kalmıyor. Ham bozuk veri, ayrı yedek anahtarında korunmaya devam ediyor.
- **Regresyon testleri:**
  - **F22:** Tarayıcıda form oluşturulduktan sonra düğme yok; yenilemede form duruyor, uyarı kalkıyor.
  - **U:BUG-002**

### BUG-003 — HIGH — Düzenleyicide "İçeriğe atla" kullanıcıyı listeye atıyor
- **Yeniden üretme:** Düzenleyicide Tab ile "İçeriğe atla"ya gel ve Enter'a bas. Adres `#main` olur; düzenleyici kapanır, liste açılır.
- **Neden:** `href="#main"` hash yönlendiricisine ulaşıyor. Yönlendirici `#main`'i bilmediği için listeyi gösteriyor.
- **Düzeltme:** `App.tsx`: Varsayılan gezinme engellendi; odak doğrudan `#main`'e (`tabIndex=-1`) taşınıyor.
- **Regresyon testleri:**
  - **F20:** Adres değişmiyor, düzenleyici açık kalıyor, odak `main` üzerinde.
  - **U:BUG-003**

### BUG-004 — HIGH — "Gönder (test)" ilk tıklamada çalışmıyor
- **Yeniden üretme:**
  1. Önizlemede tarih alanına aralık dışı bir tarih yaz.
  2. Doğrudan "Gönder (test)" düğmesine tıkla.
  3. Sonuç: Hiçbir şey olmuyor (sonuç mesajı yok). İkinci tıklama çalışıyor.
- **Neden:**
  - Fare düğmeye basıldığında alan odağı kaybediyor.
  - Odak kaybıyla çalışan doğrulama alanın altına hata satırı ekliyor.
  - Düğme imlecin altından aşağı kayıyor ve tıklama başka bir öğede bitiyor.
  - Gerçek kullanıcıda, düğmenin üst kısmına yapılan tıklamalar kayboluyor.
- **Bulunuş:** Yeni F10 ve Senaryo B testleri bu yüzden başarısız oldu. Sayfa görüntüsünde alan hataları vardı ama gönderim sonucu yoktu.
- **Düzeltme:** `PreviewPanel.tsx`: "Gönder (test)" ve "Temizle" düğmelerinde `mousedown` varsayılanı engellendi. Odak alanda kalıyor, düzen kaymıyor ve tıklama hedefine ulaşıyor. Gönderim zaten bütün alanları doğruladığı için hata mesajları yine gösteriliyor. Klavye ve dokunmatik kullanım değişmedi.
- **Regresyon testleri:**
  - **F24:** Tek tıklamayla "2 alanda hata var" çıkıyor.
  - **F10, Senaryo B:** Artık geçiyor.
  - **U:BUG-004:** `mousedown` varsayılanının engellendiği doğrulanıyor.

## 1.0.2 düzeltmeleri

**Kanıt:**
- **Tarayıcı:** Dönüştürülen F26–F31 testleri, düzeltmeden önce çalıştırıldı ve 6/6 başarısız oldu (`reports/test-results/v1.0.2-before-fix/`).
- **Birim:** 6 yeni birim testi var.
  - Doğrulama ve dışa aktarma düzeltmeleri geçici olarak geri alındığında `lib` testleri 3/3 başarısız oldu.
  - Bileşen düzeltmeleri geri alındığında `App` testleri 3/3 başarısız oldu.
  - Düzeltmelerle 6/6 geçti.

| # | Önem | Sorun | Düzeltme | Regresyon testi | Dosyalar |
|---|---|---|---|---|---|
| BUG-005 | MEDIUM | Ayrıştırılamayan sayı girdisi (`1-2`, `-`) kabul ediliyordu | Sayı girişinin `validity.badInput` durumu her tuşta `onInput` ile izleniyor (`onChange`, değer "" kaldığında tetiklenmiyor). `validateValue(field, value, badInput)` isteğe bağlı ve zorunlu alanda "Lütfen bir sayı girin." döndürüyor. "Temizle", tarayıcının reddettiği metni de silmek için girişleri yeniden oluşturuyor | F26; lib BUG-005 | `validation.ts`, `PreviewPanel.tsx` |
| BUG-006 | MEDIUM | Boşluklu seçenekler doğrulanamıyordu; kayıt, önizleme ve dışa aktarma farklıydı | Tek kaynak: `cleanOptions()` (kırp, boş satırı ve yineleneni at, sırayı koru). Önizleme, doğrulama, tasarım uyarısı ve dışa aktarma bunu kullanıyor. Kayıtlı liste, metin alanından çıkılınca normalleştiriliyor (yazarken kırpılmıyor; aksi hâlde kelime arasındaki boşluk yazılamazdı) | F27; lib BUG-006 | `fields.ts`, `validation.ts`, `exportSchema.ts`, `PropertiesPanel.tsx`, `PreviewPanel.tsx` |
| BUG-007 | LOW | Zorunluluk kaldırılınca eski hata ekranda kalıyordu | Önizleme artık "hangi alanın hatası gösteriliyor" bilgisini tutuyor; mesajın kendisi her render'da güncel şemadan hesaplanıyor. Kural kalkınca mesaj ve "N alanda hata var" kayboluyor, kural geri gelince mesaj geri geliyor. "Form geçerli" de yalnızca form hâlâ geçerliyse gösteriliyor | F28; App BUG-007 | `PreviewPanel.tsx` |
| BUG-008 | LOW | Dosya adında "İ" bozuluyordu (`i-letişim…`) | `toLocaleLowerCase('tr-TR')`: İ→i, I→ı, Ş→ş, Ğ→ğ, Ü→ü, Ö→ö, Ç→ç; Türkçe harfler korunuyor. Not: Türkçe kurala göre büyük "I" da "ı" olur (ör. "IŞIK" → "ışık") | F29 (indirilen dosya adı); lib BUG-008 | `exportSchema.ts` |
| BUG-009 | LOW | Modal pencerelerde Tab ile pencere dışına çıkılabiliyordu | Yeni `components/focus.ts`: `trapTab` iki pencerede de Tab ve Shift+Tab'ı içeride döndürüyor. `restoreFocus`, kapanınca odağı tetikleyiciye veriyor; tetikleyici silinmişse (ör. silinen formun "Sil" düğmesi) odak `<body>`'ye düşmüyor, ana içeriğe gidiyor | F30; App BUG-009 | `focus.ts` (yeni), `ConfirmDialog.tsx`, `ExportDialog.tsx` |
| BUG-010 | LOW | Başlıksız formun düğmelerinin erişilebilir adı " formunu sil" oluyordu | Kartta, düğme adlarında ve silme mesajında "Adsız form" kullanılıyor. Aynı sorun etiketsiz alanların ↑/↓/✕ düğmelerinde de vardı; orada da ekrandaki "(etiketsiz)" metni kullanılıyor | F31; App BUG-010 | `DashboardPage.tsx`, `FieldsPanel.tsx`, `EditorPage.tsx` |

## 1.0.1'de açık kalan hatalar (tarihçe; 1.0.2'de hepsi düzeltildi)

| # | Önem | Sorun | Kanıt (test) | Önerilen küçük düzeltme |
|---|---|---|---|---|
| BUG-005 | MEDIUM | İsteğe bağlı sayı alanına ayrıştırılamayan girdi (`1-2`) yazılırsa form "geçerli" sayılıyor. Zorunlu alanda yanlış mesaj çıkıyor: "Bu alan zorunludur" | K01 | `validity.badInput` değerini doğrulamaya aktarmak |
| BUG-006 | MEDIUM | Başında veya sonunda boşluk olan seçenek ("İstanbul ") seçilse bile doğrulanamıyor | K02 | Seçenekleri karşılaştırmadan önce kırpmak |
| BUG-007 | LOW | Alan zorunluluktan çıkarılınca önizlemedeki eski hata, bir sonraki gönderime kadar kalıyor | K03 | Şema değişince önizleme hatalarını yeniden hesaplamak |
| BUG-008 | LOW | Dosya adında Türkçe büyük "İ" bozuluyor: `i-letişim.schemaforge.json` | K04 | `toLocaleLowerCase('tr')` |
| BUG-009 | LOW | Açık modal pencerede Tab ile arka plandaki öğelere geçilebiliyor (odak tuzağı yok) | K05 | Pencere içinde odak döngüsü |
| BUG-010 | LOW | Başlığı boş bırakılan formun kart düğmelerinin erişilebilir adı " formunu sil" oluyor | K06 | `aria-label`'da `title \|\| 'Adsız form'` kullanmak |

## Değişen dosyalar

| Dosya | Değişiklik |
|---|---|
| `src/hooks/useForms.ts` | BUG-001 |
| `src/components/StorageBanner.tsx`, `src/App.tsx` | BUG-002, BUG-003 |
| `src/components/PreviewPanel.tsx` | BUG-004 |
| `src/App.test.tsx` | 4 regresyon testi |
| `e2e/functional.spec.ts` (yeni) | 35 tarayıcı testi: 25 işlev testi (F01–F25), 3 senaryo, 1 mobil, 6 bilinen kusur testi (bkz. `FUNCTIONAL_TEST_REPORT.md`) |
| `playwright.config.ts` | JSON raporlayıcı eklendi (`reports/test-results/`) |
| `scripts/collect-results.mjs` | Gerçek çıkış kodunu yazıyor; `test.fail` testlerini "bilinen kusur" olarak ayrı sayıyor |
| `scripts/verify_delivery.py` | Bilinen kusur testlerini başarılı saymıyor |

Yeni bağımlılık eklenmedi. Arayüz tasarımı değişmedi.
