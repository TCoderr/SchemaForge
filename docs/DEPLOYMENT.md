# SchemaForge — GitHub ve Netlify Dağıtım Talimatları

**Durum (19.10.2026):**
- Proje yerelde bir git deposu olarak hazırlandı.
- **GitHub'a gönderilmedi.**
- **Netlify'da yayımlanmadı.**

Bu işlemler proje sahibinin hesabında yapılır ve onay gerektirir. Bu belgede uydurulmuş bir bağlantı yoktur.

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
