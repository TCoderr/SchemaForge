# SchemaForge — GitHub ve Netlify Dağıtım Talimatları

**Durum (19.10.2026, proje sahibinin onayıyla yapıldı ve doğrulandı):**
- **GitHub:** https://github.com/TCoderr/SchemaForge (public, `main` dalı). `gh repo create` ile oluşturuldu. Oturumsuz istekle HTTP 200 dönüyor; uzaktaki son commit yereldekiyle aynı.
- **Netlify:** https://schemaforge-tcoderr.netlify.app
  - Ücretsiz plan, `tcoderr` ekibi, site adı `schemaforge-tcoderr`.
  - `netlify deploy --prod --dir dist` ile yayımlandı.
  - Ekibin varsayılan "ziyaretçi erişimi: Netlify girişi" koruması yalnızca bu site için kapatıldı (`sso_login=false`). Ekibin varsayılanı değiştirilmedi.
  - Canlı sitede Playwright testleri 4/4 geçti (`docs/test-results/e2e-live-junit.xml`).
  - `/forms/abc` gibi doğrudan bağlantılar HTTP 200 döndürüyor (yönlendirme kuralı çalışıyor).
- **Güncelleme (19.10.2026, sürüm 1.0.2):** Commit `60edc6b` onayla push edildi ve deploy `6ad63974c2e180e29a2627ba` ile yayımlandı; canlıda 39/39 test geçti.
- **Güncelleme (19.10.2026, sürüm 1.0.1):** Commit `952fa87` onayla push edildi ve deploy `6ad6325a192f2a42c5a80c9f` ile yayımlandı (`reports/LIVE_SITE_VERIFICATION.md`).
- **Açık konu:** Site GitHub deposuna bağlı değil. Yeni bir push otomatik yayın tetiklemez. İstenirse aşağıdaki 2-A adımıyla sürekli dağıtım bağlanabilir veya `npm run build` sonrasında şu komut tekrarlanır:
  `npx netlify-cli deploy --prod --no-build --dir dist --site 9c4cb07e-dc29-4f49-b5a6-94679ca601fe --message "<sürüm> (commit <kısa-hash>)"`
  *(Düzeltme: Bu satırda önce `--site schemaforge-tcoderr` yazıyordu. 19.10.2026'da CLI site adını tanımadı ("Not Found"); site kimliği gerekiyor. `--no-build` olmadan CLI kendi build'ini de çalıştırıyor.)*

## 1. GitHub (hesap: TCoderr)

Yönerge, projenin GitHub'da **public** bir depoya yüklenmesini istiyor.

```powershell
cd D:\Project\SchemaForge
gh auth status                                  # TCoderr hesabıyla oturum açık olmalı
gh repo create TCoderr/SchemaForge --public --source . --remote origin --push \
  --description "SchemaForge - dinamik form tasarım platformu (React, TypeScript, Vite, Tailwind CSS)"
```

GitHub CLI yerine web arayüzü de kullanılabilir:
1. github.com → **New repository** → `SchemaForge` adını gir → **Public** seç → README eklemeden oluştur.
2. Şu komutları çalıştır:
   ```powershell
   git remote add origin https://github.com/TCoderr/SchemaForge.git
   git push -u origin main
   ```

Depo adresi gerçekten oluştuktan sonra README'deki "Bağlantılar" bölümüne yazılmalıdır.

## 2. Netlify (Free)

### A) GitHub'dan otomatik dağıtım (önerilen)
1. https://app.netlify.com → **Add new site → Import an existing project → GitHub** → `TCoderr/SchemaForge`.
2. Ayarlar `netlify.toml` dosyasından okunur. Kontrol için değerler:

   | Ayar | Değer |
   |---|---|
   | Build command | `npm run build` |
   | Publish directory | `dist` |
   | Node | 24 |

3. **Deploy** → site adresi `https://<site-adı>.netlify.app` biçiminde oluşur. Site adı **Site configuration → Change site name** ile değiştirilebilir (ör. `schemaforge-tcoderr`, müsaitse).
4. Özel alan adı gerekmez. Ücretli özellik kullanılmaz.

### B) Elle sürükle-bırak (GitHub olmadan)
1. `npm run build` komutunu çalıştır. Teslim paketinde `dist/` klasörü hazır olarak da bulunur.
2. https://app.netlify.com/drop sayfasına `dist` klasörünü sürükle.

### Yönlendirme
- Uygulama hash tabanlı yönlendirme kullanır (`#/forms/<id>`). Bu yüzden sayfa yenilendiğinde 404 oluşmaz.
- Doğrudan bağlantılar için güvenlik ağı olarak `netlify.toml` içinde `/* → /index.html 200` kuralı ve `public/_redirects` dosyası bulunur.

### Yayın sonrası kontrol
1. Site adresini aç.
2. Bir form oluştur.
3. Sayfayı yenile ve formun durduğunu doğrula.
4. JSON indir.
5. Mobil görünümü kontrol et.
6. Tarayıcı konsolunda hata olmadığına bak.
7. Gerçek Netlify adresini README'ye ve teslim formuna yaz.
