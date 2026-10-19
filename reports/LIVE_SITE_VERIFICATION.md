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

## 2. Yeni dağıtım

*Bu bölüm, proje sahibinin GitHub push ve Netlify dağıtım onayından sonra doldurulacak.*
