# SchemaForge — Canlı Site Doğrulaması

**Author / Maintainer:** Tugay Sinan Ergün · **GitHub:** TCoderr · **Tarih:** 19 Ekim 2026
**Canlı site:** https://schemaforge-tcoderr.netlify.app · **Depo:** https://github.com/TCoderr/SchemaForge

## 1. Yeni dağıtımdan önceki durum

| Bilgi | Değer |
|---|---|
| Yerel ve GitHub `main` | `1afb33dffcc6b676630f678d840d03ba606bcbce` (aynı) |
| Netlify yayını | Deploy `6ad56246c3186e266891981f`, 2026-10-19 00:20 UTC. Manuel CLI dağıtımı olduğu için Netlify'da `commit_ref` kaydı **yok** |
| Canlı sürüm hangi commit'ten? | `1afb33d`'nin yerel `npm run build` çıktısıyla karşılaştırıldı: `assets/index-BK8-AFQT.js`, `assets/index-8qfJwTeP.css` ve `favicon.svg` **bayt bayt aynı** (SHA-256) |
| `index.html` farkı | Yalnızca Netlify'ın eklediği HTML yorumu ve `<script src="/.netlify/scripts/hud?variant=public">` (Netlify'ın kendi betiği; üçüncü taraf) |

### Canlı sitede test (eski sürüm `1afb33d`, yeni ve izole tarayıcı bağlamı)

Komut: `PW_BASE_URL=https://schemaforge-tcoderr.netlify.app npx playwright test`

| Sonuç | Sayı |
|---|---|
| Çalışan test | 38 (F25 henüz yoktu) |
| Başarılı | 26 |
| Bilinen kusur testi (beklenen hata) | 6 |
| **Başarısız** | **6:** F10, F20, F21, F22, F24, Senaryo B. 6'sı da BUG-001–004 kaynaklı ve yerelde düzeltme öncesi sonuçla aynı |

Kayıtlar: `reports/test-results/live-before-deploy/` (liste çıktısı, JUnit, JSON).

**Canlı kontrol listesi (eski sürüm):**

| Kontrol | Sonuç |
|---|---|
| Oturum açmadan erişim | ✅ HTTP 200 (F23) |
| Form oluşturma, alan düzenleme, canlı önizleme | ✅ F02–F09, F12 |
| LocalStorage kalıcılığı | ✅ F16. ❌ İki sekmede veri kaybı (BUG-001) |
| JSON dışa aktarma | ✅ F15 (indirme ve pano) |
| Silme | ✅ F06, F13 |
| Mobil görünüm | ✅ M01, E4 |
| Konsol ve ağ hataları | ✅ Birinci taraf konsol hatası, başarısız istek veya HTTP ≥ 400 yok. Üçüncü taraf (`/.netlify/`) kaynaklı hata da kaydedilmedi. Veri taşıyan istek yok (F23) |

**Yerel ile canlı farkı (dağıtımdan önce):** Kod aynı (`1afb33d`). Tek fark Netlify'ın `index.html`'e eklediği betik; test sonuçları yereldeki düzeltme öncesi sonuçla birebir aynı.

## 2. Yeni dağıtım (proje sahibinin onayıyla)

| Adım | Sonuç |
|---|---|
| GitHub push (onaylandı) | `1afb33d..952fa87  main -> main`. Yerel = `origin/main` = `git ls-remote` = `952fa8781deed64ffd2a612f4d11fbbad00216ff` |
| Production build | Temiz çalışma ağacında, HEAD `952fa87` iken `rm -rf dist && npm run build` |
| Netlify dağıtımı (onaylandı) | Deploy **`6ad6325a192f2a42c5a80c9f`**, mesaj: "SchemaForge 1.0.1 (commit 952fa87)". Komut: `npx netlify-cli deploy --prod --no-build --dir dist --site 9c4cb07e-dc29-4f49-b5a6-94679ca601fe --message "<sürüm> (commit <kısa-hash>)"`. `--no-build`: hash'i alınmış `dist` olduğu gibi yüklendi |
| Başarısız deneme (açıkça not) | İlk deneme `--site schemaforge-tcoderr` ile yapıldı. CLI site adını tanımadı ("Not Found") ve kendi build'ini başlatmıştı; hiçbir şey yayımlanmadı. Oluşan yayımlanmamış kayıt: `6ad6324aefe585d27a5f5f34`. Yayımlanmış sürüm ikinci denemeye kadar `6ad56246…` olarak kaldı (API ile doğrulandı) |
| Yayımlanan build hangi commit'ten? | **`952fa87`**. Canlı `assets/index-DtpLGSyl.js` (`3a1c943a…`), `assets/index-7_u-jkvg.css` (`961b57af…`) ve `favicon.svg` (`e30fb729…`), bu commit'in yerel build'iyle SHA-256 olarak aynı. `index.html` yalnızca Netlify'ın eklediği yorum ve `/.netlify/scripts/hud` betiği kadar farklı |
| Doğrudan bağlantı | `/forms/x` → HTTP 200 (yönlendirme kuralı) |

Not: Netlify manuel dağıtımlarda `commit_ref` alanını doldurmuyor. Commit kimliği deploy mesajına yazıldı ve yukarıdaki hash karşılaştırmasıyla doğrulandı.

### Canlı sitede regresyon testi (yeni sürüm, yeni ve izole tarayıcı bağlamları)

| Sonuç | Sayı |
|---|---|
| Çalışan test | 39 (masaüstü 37, mobil 2) |
| Başarılı | **33** |
| Bilinen kusur testi (beklenen hata; başarılı sayılmaz) | 6 (BUG-005…010) |
| **Başarısız** | **0** |
| Üçüncü taraf kaynak hatası | Kaydedilmedi |

Kayıtlar: `reports/test-results/live-after-deploy/` (liste çıktısı, JUnit, JSON); ekran görüntüleri `reports/screenshots/live/`.

**Canlı kontrol listesi (yeni sürüm):**
- Oturumsuz erişim
- Form oluşturma
- Alan düzenleme
- Canlı önizleme
- LocalStorage kalıcılığı (iki sekme dahil)
- JSON dışa aktarma (indirme ve pano)
- Silme
- Mobil görünüm
- Konsol ve ağ hataları

Hepsi ✅. Dağıtımdan önce başarısız olan F10, F20, F21, F22, F24 ve Senaryo B artık geçiyor.

## 3. Yerel, GitHub, Netlify ve ZIP tutarlılığı

| Kaynak | Sürüm |
|---|---|
| Uygulama kodu (yerel = GitHub) | `952fa87` (sonraki rapor commit'i `src/`, `public/`, `index.html` ve yapılandırma dosyalarını değiştirmedi) |
| Netlify | `952fa87` build'i (deploy `6ad6325a192f2a42c5a80c9f`) |
| Teslim ZIP'i | `release/SchemaForge_Teslim.zip`; kaynak ve `dist` aynı build. Ayrıntılı karşılaştırma: `FINAL_REPORT.md` §0 |

**Yerel ile canlı farkı:** Test sonuçları aynı (yerel 33 + 6, canlı 33 + 6, ikisinde de 0 başarısız). Tek fark Netlify'ın `index.html`'e eklediği betik.
