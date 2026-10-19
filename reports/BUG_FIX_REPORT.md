# SchemaForge — Hata Düzeltme Raporu

**Author / Maintainer:** Tugay Sinan Ergün · **GitHub:** TCoderr · **Tarih:** 19 Ekim 2026
**Başlangıç commit'i:** `1afb33d` (GitHub `main` ve canlı Netlify sürümüyle aynı; canlı JS/CSS dosyaları bu commit'in build çıktısıyla bayt bayt aynı)

## Özet

| Önem | Bulunan | Düzeltilen | Açık |
|---|---|---|---|
| CRITICAL | 1 | 1 | 0 |
| HIGH | 3 | 3 | 0 |
| MEDIUM | 2 | 0 | 2 |
| LOW | 4 | 0 | 4 |
| **Toplam** | **10** | **4** | **6** |

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

## Açık kalan hatalar (düzeltilmedi, belgelendi)

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
