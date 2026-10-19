import { expect, test, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'

const SHOTS = process.env.PW_BASE_URL ? 'docs/screenshots/live' : 'docs/screenshots'
const STORAGE_KEY = 'schemaforge.forms.v1'

/** Fail the test on any console error or uncaught page error. */
function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

async function addField(page: Page, typeLabel: string) {
  await page.getByRole('button', { name: `${typeLabel} alanı ekle` }).click()
}

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop only')

  test('full flow: create, fields, rules, validation, export, real reload, delete', async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto('/')
    await expect(page.getByText('Henüz form yok')).toBeVisible()

    // 1 create + 3 rename
    await page.getByRole('button', { name: '+ Yeni form' }).click()
    await page.getByLabel('Form başlığı').fill('Etkinlik Kayıt Formu')
    await page.getByLabel('Form açıklaması').fill('Teknoloji buluşmasına katılım için kayıt formu.')

    // 4 add every field type, configure rules
    await addField(page, 'Kısa metin')
    await page.getByLabel('Zorunlu alan').check()
    await page.getByLabel('En az karakter').fill('3')
    await addField(page, 'E-posta')
    await page.getByLabel('Zorunlu alan').check()
    await addField(page, 'Sayı')
    await page.getByLabel('Etiket').fill('Deneyim yılı')
    await page.getByLabel('En küçük değer').fill('0')
    await page.getByLabel('En büyük değer').fill('40')
    await addField(page, 'Seçim kutusu')
    await page.getByLabel('Etiket').fill('Katılım şekli')
    await page.getByLabel('Seçenekler').fill('Yüz yüze\nÇevrim içi')
    await addField(page, 'Tarih')
    await page.getByLabel('Etiket').fill('Katılım tarihi')
    await addField(page, 'Uzun metin')
    await page.getByLabel('Etiket').fill('Beklentileriniz')
    await page.getByLabel('Yer tutucu (placeholder)').fill('Kısaca yazın')
    await addField(page, 'Onay kutusu')
    await page.getByLabel('Zorunlu alan').check()
    await expect(page.getByRole('list', { name: 'Form alanları' }).getByRole('listitem')).toHaveCount(7)

    // 5 change type of the date field to text and back
    await page.getByRole('button', { name: /Katılım tarihi/ }).first().click()
    await page.getByLabel('Alan türü').selectOption('text')
    const preview = page.getByRole('form', { name: 'Form önizlemesi' })
    await expect(preview.getByLabel('Katılım tarihi')).toHaveAttribute('type', 'text')
    await page.getByLabel('Alan türü').selectOption('date')
    await expect(preview.getByLabel('Katılım tarihi')).toHaveAttribute('type', 'date')

    // 6 validation in the live preview
    await preview.getByRole('button', { name: 'Gönder (test)' }).click()
    await expect(preview.getByText('3 alanda hata var')).toBeVisible()
    await preview.getByLabel(/Ad Soyad/).fill('Al')
    await preview.getByLabel(/E-posta/).fill('al@ornek')
    await preview.getByLabel('Deneyim yılı').fill('55')
    await preview.getByRole('button', { name: 'Gönder (test)' }).click()
    await expect(preview.getByText('En az 3 karakter girin.')).toBeVisible()
    await expect(preview.getByText(/Geçerli bir e-posta/)).toBeVisible()
    await expect(preview.getByText('Değer en fazla 40 olmalıdır.')).toBeVisible()
    await page.screenshot({ path: `${SHOTS}/02-editor-dogrulama-hatalari.png`, fullPage: true })
    await preview.getByLabel(/Ad Soyad/).fill('Ali Veli')
    await preview.getByLabel(/E-posta/).fill('ali@ornek.com')
    await preview.getByLabel('Deneyim yılı').fill('5')
    await preview.getByLabel('Katılım şekli').selectOption('Çevrim içi')
    await preview.getByLabel(/Koşulları kabul/).check()
    await preview.getByRole('button', { name: 'Gönder (test)' }).click()
    await expect(preview.getByText(/Form geçerli/)).toBeVisible()
    await page.screenshot({ path: `${SHOTS}/03-editor-gecerli-form.png`, fullPage: true })

    // 10 export: dialog + real file download
    await page.getByRole('button', { name: "JSON'u dışa aktar" }).click()
    const dialog = page.getByRole('dialog', { name: 'JSON dışa aktarma' })
    await expect(dialog).toBeVisible()
    await page.screenshot({ path: `${SHOTS}/04-json-disa-aktarma.png` })
    const [download] = await Promise.all([page.waitForEvent('download'), dialog.getByRole('button', { name: 'JSON indir' }).click()])
    const file = await download.path()
    const json = JSON.parse(readFileSync(file, 'utf-8'))
    expect(download.suggestedFilename()).toMatch(/\.schemaforge\.json$/)
    expect(json.form.title).toBe('Etkinlik Kayıt Formu')
    expect(json.form.fields.map((f: { order: number; type: string }) => [f.order, f.type])).toEqual(
      [[1, 'text'], [2, 'email'], [3, 'number'], [4, 'select'], [5, 'date'], [6, 'textarea'], [7, 'checkbox']])
    expect(json.form.fields[0]).toMatchObject({ label: 'Ad Soyad', required: true, rules: { minLength: 3 } })
    expect(json.form.fields[3].options).toEqual(['Yüz yüze', 'Çevrim içi'])
    await page.keyboard.press('Escape')

    // 9 real browser reload keeps everything
    await page.reload()
    await expect(page.getByLabel('Form başlığı')).toHaveValue('Etkinlik Kayıt Formu')
    await expect(page.getByRole('list', { name: 'Form alanları' }).getByRole('listitem')).toHaveCount(7)

    // 2 list (+ a second form) and 8 delete with confirmation
    await page.getByRole('link', { name: '← Formlar' }).click()
    await page.getByRole('button', { name: '+ Yeni form' }).click()
    await page.getByLabel('Form başlığı').fill('Silinecek Taslak')
    await page.getByRole('link', { name: '← Formlar' }).click()
    await expect(page.getByRole('list', { name: 'Form listesi' }).getByRole('listitem')).toHaveCount(2)
    await page.screenshot({ path: `${SHOTS}/01-form-listesi.png`, fullPage: true })
    await page.getByRole('button', { name: 'Silinecek Taslak formunu sil' }).click()
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await page.screenshot({ path: `${SHOTS}/05-silme-onayi.png` })
    await page.getByRole('button', { name: 'Formu sil' }).click()
    await expect(page.getByRole('list', { name: 'Form listesi' }).getByRole('listitem')).toHaveCount(1)
    await page.reload()
    await expect(page.getByText('Silinecek Taslak')).toHaveCount(0)
    expect(errors).toEqual([])
  })

  test('11 corrupt LocalStorage: no white page, clear message', async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto('/')
    await page.evaluate((k) => localStorage.setItem(k, '{"forms": [bozuk'), STORAGE_KEY)
    await page.reload()
    await expect(page.getByRole('alert')).toContainText('okunamadı')
    await expect(page.getByText('Henüz form yok')).toBeVisible()
    await page.screenshot({ path: `${SHOTS}/06-bozuk-veri-uyarisi.png` })
    expect(await page.evaluate((k) => Object.keys(localStorage).filter((x) => x.startsWith(k + '.backup-')).length, STORAGE_KEY)).toBe(1)
    expect(errors).toEqual([])
  })

  test('keyboard: create a form and add a field without a mouse; focus is visible', async ({ page }) => {
    await page.goto('/')
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab')
      if (await page.evaluate(() => document.activeElement?.textContent?.includes('Yeni form'))) break
    }
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle)
    expect(outline).not.toBe('none')
    await page.keyboard.press('Enter')
    await expect(page.getByLabel('Form başlığı')).toBeVisible()
    await page.getByRole('button', { name: 'Kısa metin alanı ekle' }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('list', { name: 'Form alanları' }).getByRole('listitem')).toHaveCount(1)
  })
})

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only')

  test('12 mobile layout is usable and has no horizontal overflow', async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto('/')
    await page.getByRole('button', { name: '+ Yeni form' }).click()
    await page.getByLabel('Form başlığı').fill('Mobil Anket')
    await addField(page, 'Kısa metin')
    await addField(page, 'E-posta')
    await expect(page.getByRole('form', { name: 'Form önizlemesi' })).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
    await page.screenshot({ path: `${SHOTS}/07-mobil-editor.png`, fullPage: true })
    await page.getByRole('link', { name: '← Formlar' }).click()
    await expect(page.getByText('Mobil Anket')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0)
    await page.screenshot({ path: `${SHOTS}/08-mobil-liste.png`, fullPage: true })
    expect(errors).toEqual([])
  })
})
