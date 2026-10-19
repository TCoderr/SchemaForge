// Comprehensive functional audit (reports/UI_INTERACTION_AUDIT.md). Every test checks a real outcome: what the UI shows,
// what is stored in LocalStorage, what a downloaded file contains. Each test runs in a fresh, isolated browser context.
// Local: npx playwright test e2e/functional.spec.ts · Live: PW_BASE_URL=https://schemaforge-tcoderr.netlify.app npx playwright test ...
// Author: Tugay Sinan Ergün
import { test as base, expect, type Page } from '@playwright/test'
import { mkdirSync, readFileSync } from 'node:fs'

const LIVE = Boolean(process.env.PW_BASE_URL)
const SHOTS = LIVE ? 'reports/screenshots/live' : 'reports/screenshots/local'
mkdirSync(SHOTS, { recursive: true })
const KEY = 'schemaforge.forms.v1'

/** Fails a test on any first-party console error, page error or failed first-party request.
 *  Third-party resources (other origins, Netlify-injected /.netlify/ scripts) are recorded as annotations, not failures. */
const test = base.extend<{ watch: void }>({
  watch: [async ({ page, baseURL }, use, testInfo) => {
    const origin = new URL(baseURL!).origin
    const thirdParty = (url: string) => !url || !url.startsWith(origin) || url.includes('/.netlify/')
    const firstParty: string[] = []
    const external: string[] = []
    const note = (url: string, msg: string) => (thirdParty(url) ? external : firstParty).push(msg)
    page.on('console', (m) => { if (m.type() === 'error') note(m.location().url, `console: ${m.text()}`) })
    page.on('pageerror', (e) => firstParty.push(`pageerror: ${e.message}`))
    page.on('requestfailed', (r) => note(r.url(), `requestfailed: ${r.url()} ${r.failure()?.errorText}`))
    page.on('response', (r) => { if (r.status() >= 400) note(r.url(), `HTTP ${r.status()}: ${r.url()}`) })
    await use()
    for (const e of external) testInfo.annotations.push({ type: 'third-party', description: e })
    expect(firstParty, 'first-party console/page/network errors').toEqual([])
  }, { auto: true }],
})

const stored = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? '{"forms":[]}').forms, KEY)
const preview = (page: Page) => page.getByRole('form', { name: 'Form önizlemesi' })
const fieldItems = (page: Page) => page.getByRole('list', { name: 'Form alanları' }).getByRole('listitem')
const cards = (page: Page) => page.getByRole('list', { name: 'Form listesi' }).getByRole('listitem')
const submit = (page: Page) => preview(page).getByRole('button', { name: 'Gönder (test)' }).click()
const result = (page: Page) => preview(page).locator('[aria-live="polite"]')
async function newForm(page: Page, title?: string) {
  await page.getByRole('button', { name: '+ Yeni form' }).click()
  await expect(page.getByLabel('Form başlığı')).toBeVisible()
  if (title !== undefined) await page.getByLabel('Form başlığı').fill(title)
}
const add = (page: Page, type: string) => page.getByRole('button', { name: `${type} alanı ekle` }).click()
const toList = (page: Page) => page.getByRole('link', { name: '← Formlar' }).click()

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop only')

  test('F01 first visit: empty state, nothing stored before the user acts', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Formlarım' })).toBeVisible()
    await expect(page.getByText('Henüz form yok')).toBeVisible()
    await expect(page.getByRole('button', { name: 'İlk formu oluştur' })).toBeVisible()
    await expect(page.getByRole('button', { name: '+ Yeni form' })).toBeVisible()
    await expect(page.getByText(/yalnızca bu tarayıcıda \(LocalStorage\) saklanır/)).toBeVisible()
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull()
    await page.screenshot({ path: `${SHOTS}/F01-bos-durum.png`, fullPage: true })
  })

  test('F02 first form from the empty state opens the editor and is stored', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'İlk formu oluştur' }).click()
    await expect(page).toHaveURL(/#\/forms\/[\w-]+$/)
    await expect(page.getByLabel('Form başlığı')).toHaveValue('Adsız form')
    await expect(page.getByText('Alan eklediğinizde form burada görünür.')).toBeVisible()
    const forms = await stored(page)
    expect(forms).toHaveLength(1)
    expect(page.url()).toContain(forms[0].id)
  })

  test('F03 second form, listing (newest first, counts, date) and "Düzenle" opens the right form', async ({ page }) => {
    await page.goto('/')
    await newForm(page, 'Birinci form'); await add(page, 'Kısa metin'); await add(page, 'E-posta'); await toList(page)
    await newForm(page, 'İkinci form'); await toList(page)
    await expect(cards(page)).toHaveCount(2)
    await expect(cards(page).nth(0)).toContainText('İkinci form')
    await expect(cards(page).nth(0)).toContainText('0 alan')
    await expect(cards(page).nth(1)).toContainText('Birinci form')
    await expect(cards(page).nth(1)).toContainText('2 alan')
    await expect(cards(page).nth(1)).toContainText(/\d{4}/) // last update date
    await page.getByRole('button', { name: 'Birinci form formunu düzenle' }).click()
    await expect(page.getByLabel('Form başlığı')).toHaveValue('Birinci form')
    await expect(fieldItems(page)).toHaveCount(2)
    await page.getByRole('link', { name: /SchemaForge/ }).click() // logo link
    await expect(cards(page)).toHaveCount(2)
  })

  test('F04 title and description: live preview, list card and storage', async ({ page }) => {
    await page.goto('/')
    await newForm(page, 'Müşteri İletişim')
    await page.getByLabel('Form açıklaması').fill('Satış ekibine ulaşın.')
    await add(page, 'Kısa metin')
    await expect(preview(page).locator('xpath=..').getByRole('heading', { name: 'Müşteri İletişim' })).toBeVisible()
    await expect(page.getByText('Satış ekibine ulaşın.').first()).toBeVisible()
    expect((await stored(page))[0]).toMatchObject({ title: 'Müşteri İletişim', description: 'Satış ekibine ulaşın.' })
    await toList(page)
    await expect(cards(page).first()).toContainText('Müşteri İletişim')
    await expect(cards(page).first()).toContainText('Satış ekibine ulaşın.')
  })

  test('F05 duplicate: "(kopya)", "(kopya 2)", fields copied and independent of the original', async ({ page }) => {
    await page.goto('/')
    await newForm(page, 'Anket'); await add(page, 'Kısa metin'); await add(page, 'Sayı'); await toList(page)
    await page.getByRole('button', { name: 'Anket formunu kopyala' }).click()
    await page.getByRole('button', { name: 'Anket formunu kopyala' }).click()
    await expect(cards(page)).toHaveCount(3)
    const titles = (await stored(page)).map((f: { title: string }) => f.title)
    expect(titles).toEqual(['Anket', 'Anket (kopya 2)', 'Anket (kopya)'])
    await page.getByRole('button', { name: 'Anket (kopya) formunu düzenle' }).click()
    await expect(fieldItems(page)).toHaveCount(2)
    await page.getByLabel('Etiket').fill('Kopyadaki etiket') // the editor opens with the first field selected
    const forms = await stored(page)
    const original = forms.find((f: { title: string }) => f.title === 'Anket')
    const copy = forms.find((f: { title: string }) => f.title === 'Anket (kopya)')
    expect(original.fields.map((f: { label: string }) => f.label)).toEqual(['Ad Soyad', 'Yaş'])
    expect(copy.fields.map((f: { label: string }) => f.label)).toEqual(['Kopyadaki etiket', 'Yaş'])
    expect(copy.fields[0].id).not.toBe(original.fields[0].id)
  })

  test('F06 delete form: Vazgeç, Escape and backdrop cancel; "Formu sil" deletes and survives reload', async ({ page }) => {
    await page.goto('/')
    await newForm(page, 'Kalacak'); await toList(page)
    await newForm(page, 'Silinecek'); await add(page, 'Tarih'); await toList(page)
    const del = page.getByRole('button', { name: 'Silinecek formunu sil' })
    await del.click()
    const dlg = page.getByRole('alertdialog', { name: 'Form silinsin mi?' })
    await expect(dlg).toContainText('"Silinecek" formu ve 1 alanı kalıcı olarak silinecek')
    await expect(dlg.getByRole('button', { name: 'Vazgeç' })).toBeFocused() // safe default
    await dlg.getByRole('button', { name: 'Vazgeç' }).click()
    await expect(dlg).toHaveCount(0)
    await expect(del).toBeFocused() // focus returns to the opener
    await del.click(); await page.keyboard.press('Escape'); await expect(dlg).toHaveCount(0)
    await del.click(); await page.mouse.click(5, 5); await expect(dlg).toHaveCount(0)
    expect(await stored(page)).toHaveLength(2)
    await del.click(); await dlg.getByRole('button', { name: 'Formu sil' }).click()
    await expect(cards(page)).toHaveCount(1)
    await page.reload()
    await expect(cards(page)).toHaveCount(1)
    await expect(page.getByText('Silinecek')).toHaveCount(0)
    expect((await stored(page)).map((f: { title: string }) => f.title)).toEqual(['Kalacak'])
  })

  test('F07 every field type: defaults, preview control, unique JSON names', async ({ page }) => {
    await page.goto('/')
    await newForm(page, 'Tüm türler')
    const types: [string, string, string][] = [ // UI name, default label, expected preview control
      ['Kısa metin', 'Ad Soyad', 'input[type=text]'], ['Uzun metin', 'Mesajınız', 'textarea'], ['Sayı', 'Yaş', 'input[type=number]'],
      ['E-posta', 'E-posta', 'input[type=email]'], ['Seçim kutusu', 'Şehir', 'select'], ['Onay kutusu', 'Koşulları kabul ediyorum', 'input[type=checkbox]'],
      ['Tarih', 'Başlangıç tarihi', 'input[type=date]'],
    ]
    for (const [ui, label, css] of types) {
      await add(page, ui)
      await expect(page.getByLabel('Etiket')).toHaveValue(label) // the new field is selected for editing
      await expect(preview(page).getByLabel(label, { exact: true })).toHaveCount(1)
      expect(await preview(page).getByLabel(label, { exact: true }).evaluate((el, c) => el.matches(c), css)).toBe(true)
    }
    await expect(preview(page).getByLabel('Şehir').locator('option')).toHaveText(['Seçiniz…', 'Seçenek 1', 'Seçenek 2'])
    await add(page, 'Kısa metin') // a second text field gets a unique name
    const names = (await stored(page))[0].fields.map((f: { name: string }) => f.name)
    expect(names).toEqual(['ad_soyad', 'mesajiniz', 'yas', 'e_posta', 'sehir', 'kosullari_kabul_ediyorum', 'baslangic_tarihi', 'ad_soyad_2'])
    await expect(fieldItems(page)).toHaveCount(8)
  })

  test('F08 placeholder and help text reach the preview; hidden where they do not apply', async ({ page }) => {
    await page.goto('/')
    await newForm(page)
    await add(page, 'Kısa metin')
    await page.getByLabel('Yer tutucu (placeholder)').fill('Adınızı yazın')
    await page.getByLabel('Açıklama / yardım metni').fill('Resmî belgelerdeki adınız.')
    const input = preview(page).getByLabel('Ad Soyad')
    await expect(input).toHaveAttribute('placeholder', 'Adınızı yazın')
    await expect(input).toHaveAccessibleDescription('Resmî belgelerdeki adınız.')
    for (const t of ['Onay kutusu', 'Seçim kutusu', 'Tarih']) {
      await add(page, t)
      await expect(page.getByLabel('Yer tutucu (placeholder)')).toHaveCount(0)
      await expect(page.getByLabel('Açıklama / yardım metni')).toBeVisible()
    }
    expect((await stored(page))[0].fields[0]).toMatchObject({ placeholder: 'Adınızı yazın', helpText: 'Resmî belgelerdeki adınız.' })
  })

  test('F09 required: marker in list and preview, aria-required, checkbox message', async ({ page }) => {
    await page.goto('/')
    await newForm(page)
    await add(page, 'Kısa metin'); await page.getByLabel('Zorunlu alan').check()
    await add(page, 'Onay kutusu'); await page.getByLabel('Zorunlu alan').check()
    await expect(fieldItems(page).nth(0)).toContainText('*')
    await expect(preview(page).getByLabel(/Ad Soyad/)).toHaveAttribute('aria-required', 'true')
    await submit(page)
    await expect(result(page)).toHaveText('2 alanda hata var. Lütfen işaretli alanları düzeltin.')
    await expect(preview(page).getByText('Bu alan zorunludur.')).toBeVisible()
    await expect(preview(page).getByText('Bu kutunun işaretlenmesi zorunludur.')).toBeVisible()
    await expect(preview(page).getByLabel(/Ad Soyad/)).toHaveAttribute('aria-invalid', 'true')
    expect((await stored(page))[0].fields.map((f: { required: boolean }) => f.required)).toEqual([true, true])
  })

  test('F10 rules: invalid e-mail, number range, text length, date range, select choice', async ({ page }) => {
    await page.goto('/')
    await newForm(page)
    await add(page, 'E-posta')
    await add(page, 'Sayı'); await page.getByLabel('En küçük değer').fill('18'); await page.getByLabel('En büyük değer').fill('65')
    await add(page, 'Kısa metin'); await page.getByLabel('En az karakter').fill('3'); await page.getByLabel('En fazla karakter').fill('5')
    await add(page, 'Tarih'); await page.getByLabel('En erken tarih').fill('2026-01-01'); await page.getByLabel('En geç tarih').fill('2026-12-31')
    await add(page, 'Seçim kutusu'); await page.getByLabel('Zorunlu alan').check()
    const pv = preview(page)
    await pv.getByLabel('E-posta').fill('al@ornek')
    await pv.getByLabel('Yaş').fill('17')
    await pv.getByLabel('Ad Soyad').fill('Al')
    await pv.getByLabel('Başlangıç tarihi').fill('2025-12-31')
    await submit(page)
    await expect(result(page)).toContainText('5 alanda hata var')
    await expect(pv.getByText('Geçerli bir e-posta adresi girin (ör. ornek@alanadi.com).')).toBeVisible()
    await expect(pv.getByText('Değer en az 18 olmalıdır.')).toBeVisible()
    await expect(pv.getByText('En az 3 karakter girin.')).toBeVisible()
    await expect(pv.getByText('Tarih 2026-01-01 veya sonrası olmalıdır.')).toBeVisible()
    await expect(pv.getByText('Bu alan zorunludur.')).toBeVisible()
    await pv.getByLabel('Yaş').fill('66'); await submit(page)
    await expect(pv.getByText('Değer en fazla 65 olmalıdır.')).toBeVisible()
    await pv.getByLabel('Başlangıç tarihi').fill('2027-01-01'); await submit(page)
    await expect(pv.getByText('Tarih 2026-12-31 veya öncesi olmalıdır.')).toBeVisible()
    // maxLength is also enforced by the browser while typing
    await pv.getByLabel('Ad Soyad').fill(''); await pv.getByLabel('Ad Soyad').pressSequentially('Abcdefgh')
    await expect(pv.getByLabel('Ad Soyad')).toHaveValue('Abcde')
    // letters cannot be typed into the number field
    await pv.getByLabel('Yaş').fill(''); await pv.getByLabel('Yaş').pressSequentially('abc')
    await expect(pv.getByLabel('Yaş')).toHaveValue('')
    await pv.getByLabel('E-posta').fill('ali@ornek.com'); await pv.getByLabel('Yaş').fill('30')
    await pv.getByLabel('Başlangıç tarihi').fill('2026-06-15'); await pv.getByLabel(/Şehir/).selectOption('Seçenek 2')
    await submit(page)
    await expect(result(page)).toHaveText('Form geçerli. Bu bir önizlemedir; veriler hiçbir yere gönderilmedi.')
    // design-time warning for contradictory rules
    await page.getByRole('button', { name: /^2\. Yaş/ }).click()
    await page.getByLabel('En küçük değer').fill('70')
    await expect(page.getByRole('status').filter({ hasText: 'En küçük değer, en büyük değerden büyük olamaz.' })).toBeVisible()
  })

  test('F11 empty required submit, live re-validation, "Temizle" resets', async ({ page }) => {
    await page.goto('/')
    await newForm(page)
    await add(page, 'Kısa metin'); await page.getByLabel('Zorunlu alan').check()
    await add(page, 'E-posta'); await page.getByLabel('Zorunlu alan').check()
    const pv = preview(page)
    await submit(page)
    await expect(result(page)).toHaveText('2 alanda hata var. Lütfen işaretli alanları düzeltin.')
    await pv.getByLabel(/Ad Soyad/).fill('Ali')
    await expect(pv.getByText('Bu alan zorunludur.')).toHaveCount(1) // fixed field cleared while typing
    await pv.getByLabel(/E-posta/).fill('   ') // whitespace only is still empty
    await submit(page)
    await expect(result(page)).toHaveText('1 alanda hata var. Lütfen işaretli alanları düzeltin.')
    await pv.getByRole('button', { name: 'Temizle' }).click()
    await expect(pv.getByLabel(/Ad Soyad/)).toHaveValue('')
    await expect(pv.getByText('Bu alan zorunludur.')).toHaveCount(0)
    await expect(result(page)).toHaveText('')
  })

  test('F12 live preview follows label, type, options and order changes', async ({ page }) => {
    await page.goto('/')
    await newForm(page)
    await add(page, 'Kısa metin'); await add(page, 'Seçim kutusu')
    await page.getByLabel('Seçenekler').fill('Ankara\nİzmir')
    await expect(preview(page).getByLabel('Şehir').locator('option')).toHaveText(['Seçiniz…', 'Ankara', 'İzmir'])
    await page.getByLabel('Etiket').fill('Ofis')
    await expect(preview(page).getByLabel('Ofis', { exact: true })).toBeVisible()
    await page.getByLabel('Alan türü').selectOption('textarea')
    await expect(preview(page).getByLabel('Ofis', { exact: true })).toHaveJSProperty('tagName', 'TEXTAREA')
    await expect(page.getByLabel('Seçenekler')).toHaveCount(0)
    await page.getByRole('button', { name: 'Ofis alanını yukarı taşı' }).click()
    const order = await preview(page).locator('label').allInnerTexts()
    expect(order.map((t) => t.trim())).toEqual(['Ofis', 'Ad Soyad'])
  })

  test('F13 delete field: cancel keeps it; confirm removes it from list, preview and storage', async ({ page }) => {
    await page.goto('/')
    await newForm(page)
    await add(page, 'Kısa metin'); await add(page, 'E-posta'); await add(page, 'Sayı')
    await page.getByRole('button', { name: 'E-posta alanını sil' }).click()
    const dlg = page.getByRole('alertdialog', { name: 'Alan silinsin mi?' })
    await expect(dlg).toContainText('"E-posta" alanı formdan kaldırılacak.')
    await dlg.getByRole('button', { name: 'Vazgeç' }).click()
    await expect(fieldItems(page)).toHaveCount(3)
    await page.getByRole('button', { name: 'E-posta alanını sil' }).click()
    await dlg.getByRole('button', { name: 'Alanı sil' }).click()
    await expect(fieldItems(page)).toHaveCount(2)
    await expect(preview(page).getByLabel('E-posta')).toHaveCount(0)
    expect((await stored(page))[0].fields.map((f: { type: string }) => f.type)).toEqual(['text', 'number'])
    await expect(page.getByLabel('Etiket')).toHaveValue(/.+/) // another field is selected
  })

  test('F14 reorder with ↑/↓: list, preview, storage and export follow; edge buttons are disabled', async ({ page }) => {
    await page.goto('/')
    await newForm(page)
    await add(page, 'Kısa metin'); await add(page, 'E-posta'); await add(page, 'Sayı')
    await expect(page.getByRole('button', { name: 'Ad Soyad alanını yukarı taşı' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Yaş alanını aşağı taşı' })).toBeDisabled()
    await page.getByRole('button', { name: 'Yaş alanını yukarı taşı' }).click()
    await page.getByRole('button', { name: 'Yaş alanını yukarı taşı' }).click()
    await expect(page.getByRole('button', { name: 'E-posta alanını aşağı taşı' })).toBeDisabled() // E-posta is last now
    await expect(page.getByRole('button', { name: 'Yaş alanını yukarı taşı' })).toBeDisabled()
    await expect(fieldItems(page).nth(0)).toContainText('1. Yaş')
    expect((await stored(page))[0].fields.map((f: { label: string }) => f.label)).toEqual(['Yaş', 'Ad Soyad', 'E-posta'])
    await page.getByRole('button', { name: "JSON'u dışa aktar" }).click()
    const json = JSON.parse(await page.getByLabel('Dışa aktarılan JSON').innerText())
    expect(json.form.fields.map((f: { order: number; name: string }) => [f.order, f.name])).toEqual([[1, 'yas'], [2, 'ad_soyad'], [3, 'e_posta']])
  })

  test('F15 export: JSON content, real download, clipboard, warnings, three ways to close, focus return', async ({ page, context, baseURL }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(baseURL!).origin })
    await page.goto('/')
    await newForm(page, 'Destek Talebi')
    await add(page, 'Kısa metin'); await page.getByLabel('Zorunlu alan').check()
    await page.getByLabel('En az karakter').fill('5'); await page.getByLabel('En fazla karakter').fill('3') // contradictory on purpose
    await add(page, 'Seçim kutusu'); await page.getByLabel('Seçenekler').fill('Düşük\n\nYüksek')
    const open = page.getByRole('button', { name: "JSON'u dışa aktar" })
    await open.click()
    const dlg = page.getByRole('dialog', { name: 'JSON dışa aktarma' })
    await expect(dlg).toContainText('destek-talebi.schemaforge.json · 2 alan')
    await expect(dlg.getByRole('status')).toContainText('En az uzunluk, en fazla uzunluktan büyük olamaz.')
    const shown = JSON.parse(await dlg.getByLabel('Dışa aktarılan JSON').innerText())
    expect(shown).toMatchObject({ format: 'schemaforge.form', version: 1, form: { title: 'Destek Talebi' } })
    expect(shown.form.fields[1].options).toEqual(['Düşük', 'Yüksek']) // empty line dropped
    expect(JSON.stringify(shown)).not.toMatch(/"id"/) // internal ids are not exported
    const [download] = await Promise.all([page.waitForEvent('download'), dlg.getByRole('button', { name: 'JSON indir' }).click()])
    expect(download.suggestedFilename()).toBe('destek-talebi.schemaforge.json')
    const file = JSON.parse(readFileSync((await download.path())!, 'utf-8'))
    expect(file.form).toEqual(shown.form)
    await dlg.getByRole('button', { name: 'Panoya kopyala' }).click()
    await expect(dlg.getByText('Panoya kopyalandı.')).toBeVisible()
    expect(JSON.parse(await page.evaluate(() => navigator.clipboard.readText())).form).toEqual(shown.form)
    await page.screenshot({ path: `${SHOTS}/F15-json-disa-aktarma.png` })
    await dlg.getByRole('button', { name: 'Kapat' }).click(); await expect(dlg).toHaveCount(0); await expect(open).toBeFocused()
    await open.click(); await page.keyboard.press('Escape'); await expect(dlg).toHaveCount(0); await expect(open).toBeFocused()
    await open.click(); await page.mouse.click(5, 5); await expect(dlg).toHaveCount(0)
  })

  test('F16 persistence: real reload in the editor keeps every setting; browser back/forward work', async ({ page }) => {
    await page.goto('/')
    await newForm(page, 'Kalıcılık')
    await add(page, 'Sayı'); await page.getByLabel('Zorunlu alan').check(); await page.getByLabel('En büyük değer').fill('9')
    await page.getByLabel('Açıklama / yardım metni').fill('Tek basamak')
    await add(page, 'Seçim kutusu'); await page.getByLabel('Seçenekler').fill('A\nB')
    const before = await stored(page)
    await page.reload()
    await expect(page.getByLabel('Form başlığı')).toHaveValue('Kalıcılık')
    await expect(fieldItems(page)).toHaveCount(2)
    expect(await stored(page)).toEqual(before)
    await page.getByRole('button', { name: /^1\. Yaş/ }).click()
    await expect(page.getByLabel('En büyük değer')).toHaveValue('9')
    await expect(page.getByLabel('Zorunlu alan')).toBeChecked()
    await page.goBack(); await expect(page.getByRole('heading', { name: 'Formlarım' })).toBeVisible()
    await page.goForward(); await expect(page.getByLabel('Form başlığı')).toHaveValue('Kalıcılık')
  })

  test('F17 broken storage: corrupt JSON, wrong shape, partly invalid data, unknown form link', async ({ page }) => {
    await page.goto('/')
    for (const raw of ['{"forms": [bozuk', '{"forms":"metin"}', '42']) {
      await page.evaluate(([k, v]) => { localStorage.clear(); localStorage.setItem(k, v) }, [KEY, raw])
      await page.reload()
      await expect(page.getByRole('alert')).toContainText('okunamadı')
      await expect(page.getByText('Henüz form yok')).toBeVisible()
      expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe(raw) // not overwritten
      expect(await page.evaluate((k) => Object.keys(localStorage).filter((x) => x.startsWith(k + '.backup-')).length, KEY)).toBe(1)
    }
    await page.getByRole('button', { name: 'Temiz başlat' }).click()
    await expect(page.getByRole('alert')).toHaveCount(0)
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull()
    await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ forms: [{ id: 'a1', title: 'Sağlam', fields: [] }, { id: 2 }] })), KEY)
    await page.reload()
    await expect(page.getByRole('alert')).toContainText('1 form kaydı geçersiz')
    await expect(cards(page)).toHaveCount(1)
    await page.getByRole('button', { name: 'Kapat' }).click()
    await expect(page.getByRole('alert')).toHaveCount(0)
    await page.goto('/#/forms/olmayan-form')
    await expect(page.getByRole('heading', { name: 'Form bulunamadı' })).toBeVisible()
    await page.getByRole('link', { name: 'Form listesine dön' }).click()
    await expect(page.getByRole('heading', { name: 'Formlarım' })).toBeVisible()
    await page.screenshot({ path: `${SHOTS}/F17-bozuk-veri.png` })
  })

  test('F18 storage full / blocked: warning banner instead of silent data loss', async ({ page, context }) => {
    await context.addInitScript((k) => {
      const orig = Storage.prototype.setItem
      Storage.prototype.setItem = function (key: string, value: string) {
        if (key === k) throw new DOMException('quota', 'QuotaExceededError')
        return orig.call(this, key, value)
      }
    }, KEY)
    await page.goto('/')
    await newForm(page, 'Kaydedilemeyen')
    await expect(page.getByRole('alert')).toContainText('Değişiklikler tarayıcıya kaydedilemedi')
    await expect(page.getByRole('button', { name: "JSON'u dışa aktar" })).toBeEnabled() // the advised way out works
  })

  test('F19 keyboard: create, add a field and delete via dialog without a mouse; Escape and focus order', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab') // skip link is the first stop
    await expect(page.getByRole('link', { name: 'İçeriğe atla' })).toBeFocused()
    let found = false
    for (let i = 0; i < 10 && !found; i++) {
      await page.keyboard.press('Tab')
      found = await page.evaluate(() => document.activeElement?.textContent?.includes('Yeni form') ?? false)
    }
    expect(found).toBe(true)
    expect(await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle)).not.toBe('none')
    await page.keyboard.press('Enter')
    await expect(page.getByLabel('Form başlığı')).toBeVisible()
    await page.getByRole('button', { name: 'E-posta alanı ekle' }).focus()
    await page.keyboard.press('Space')
    await expect(fieldItems(page)).toHaveCount(1)
    await page.getByRole('button', { name: 'E-posta alanını sil' }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await page.keyboard.press('Tab') // Vazgeç -> Alanı sil
    await expect(page.getByRole('button', { name: 'Alanı sil' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(fieldItems(page)).toHaveCount(0)
  })

  test('F20 BUG-003 regression: skip link moves focus to the content and does not leave the editor', async ({ page }) => {
    await page.goto('/')
    await newForm(page, 'Atlama bağlantısı')
    const url = page.url()
    await page.getByRole('link', { name: 'İçeriğe atla' }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByLabel('Form başlığı')).toBeVisible()
    expect(page.url()).toBe(url)
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('main')
  })

  test('F21 BUG-001 regression: two tabs never overwrite each other\'s forms', async ({ page, context }) => {
    await page.goto('/')
    await newForm(page, 'Sekme A formu')
    const b = await context.newPage()
    await b.goto('/')
    await expect(b.getByText('Sekme A formu')).toBeVisible()
    await toList(page)
    await newForm(page, 'Sekme A ikinci form') // tab B has not reloaded since
    await expect(b.getByText('Sekme A ikinci form')).toBeVisible() // B picks up A's change
    await newForm(b, 'Sekme B formu')
    await page.reload()
    await expect(page.getByLabel('Form başlığı')).toHaveValue('Sekme A ikinci form') // A was in its editor
    await toList(page)
    await expect(cards(page)).toHaveCount(3)
    const titles = (await stored(page)).map((f: { title: string }) => f.title).sort()
    expect(titles).toEqual(['Sekme A formu', 'Sekme A ikinci form', 'Sekme B formu'])
    await b.close()
  })

  test('F22 BUG-002 regression: "Temiz başlat" never deletes forms created after the warning', async ({ page }) => {
    await page.goto('/')
    await page.evaluate((k) => localStorage.setItem(k, '{bozuk'), KEY)
    await page.reload()
    await expect(page.getByRole('button', { name: 'Temiz başlat' })).toBeVisible()
    await page.getByRole('button', { name: 'İlk formu oluştur' }).click()
    await page.getByLabel('Form başlığı').fill('Uyarıdan sonra yeni form')
    await toList(page)
    await expect(page.getByRole('button', { name: 'Temiz başlat' })).toHaveCount(0) // nothing left to clean: the new data replaced the corrupt value
    await expect(page.getByRole('alert')).toContainText('yedeklendi') // the raw backup is still mentioned
    await page.reload()
    await expect(cards(page)).toHaveCount(1)
    await expect(page.getByRole('alert')).toHaveCount(0)
  })

  test('F24 BUG-004 regression: one click on "Gönder (test)" submits even when the last field turns invalid on blur', async ({ page }) => {
    await page.goto('/')
    await newForm(page)
    await add(page, 'Kısa metin'); await page.getByLabel('Zorunlu alan').check()
    await add(page, 'Tarih'); await page.getByLabel('En erken tarih').fill('2026-01-01')
    await preview(page).getByLabel('Başlangıç tarihi').fill('2025-06-01') // focus stays in the date field
    await preview(page).getByRole('button', { name: 'Gönder (test)' }).click() // a single real mouse click
    await expect(result(page)).toHaveText('2 alanda hata var. Lütfen işaretli alanları düzeltin.')
    await preview(page).getByLabel(/Ad Soyad/).fill('Ali')
    await preview(page).getByRole('button', { name: 'Temizle' }).click()
    await expect(preview(page).getByLabel(/Ad Soyad/)).toHaveValue('')
  })

  test('F25 JSON name: auto-sync with the label until edited by hand; invalid and duplicate names are flagged', async ({ page }) => {
    await page.goto('/')
    await newForm(page)
    await add(page, 'Kısa metin'); await add(page, 'E-posta')
    const name = page.getByLabel('Alan adı (JSON anahtarı)')
    await page.getByLabel('Etiket').fill('İş e-postası')
    await expect(name).toHaveValue('is_e_postasi') // follows the label
    await name.fill('email')
    await page.getByLabel('Etiket').fill('Kurumsal e-posta')
    await expect(name).toHaveValue('email') // a hand-edited name is kept
    await name.fill('2email')
    await expect(page.getByRole('status')).toContainText('Alan adı küçük harfle başlamalı')
    await name.fill('ad_soyad')
    await expect(page.getByRole('status')).toContainText('Bu alan adı formda zaten kullanılıyor.')
    await page.getByRole('button', { name: "JSON'u dışa aktar" }).click()
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('Kurumsal e-posta: Bu alan adı formda zaten kullanılıyor.')
    await page.keyboard.press('Escape')
    await name.fill('kurumsal_eposta')
    await expect(page.getByRole('status')).toHaveCount(0)
    expect((await stored(page))[0].fields.map((f: { name: string }) => f.name)).toEqual(['ad_soyad', 'kurumsal_eposta'])
  })

  test('F23 network: the app loads without login and sends no form data anywhere', async ({ page, baseURL }, testInfo) => {
    const origin = new URL(baseURL!).origin
    const res = await page.goto('/')
    expect(res?.status()).toBe(200)
    const sent: string[] = []
    page.on('request', (r) => {
      const u = new URL(r.url())
      const dataBearing = r.method() !== 'GET' || Boolean(r.postData()) || u.search !== '' || u.origin !== origin
      if (!dataBearing) return
      if (u.pathname.startsWith('/.netlify/')) testInfo.annotations.push({ type: 'third-party', description: `${r.method()} ${r.url()}` })
      else sent.push(`${r.method()} ${r.url()}`)
    })
    await newForm(page, 'Ağ testi'); await add(page, 'E-posta')
    await preview(page).getByLabel('E-posta').fill('gizli@ornek.com'); await submit(page)
    await page.getByRole('button', { name: "JSON'u dışa aktar" }).click()
    expect(sent).toEqual([])
  })

  // ---- Former known defects BUG-005…010 (K01–K06 until 1.0.1, marked test.fail). Fixed in 1.0.2; now normal regression tests.
  test('F26 BUG-005 regression: unparsable number input is rejected, optional or required; "Temizle" clears it', async ({ page }) => {
    await page.goto('/'); await newForm(page); await add(page, 'Sayı')
    const pv = preview(page); const age = pv.getByLabel(/Yaş/)
    await age.pressSequentially('1-2')
    await submit(page)
    await expect(result(page)).toHaveText('1 alanda hata var. Lütfen işaretli alanları düzeltin.')
    await expect(pv.getByText('Lütfen bir sayı girin.')).toBeVisible()
    await page.getByLabel('Zorunlu alan').check() // required: still "not a number", not "required"
    await expect(pv.getByText('Lütfen bir sayı girin.')).toBeVisible()
    await expect(pv.getByText('Bu alan zorunludur.')).toHaveCount(0)
    await age.fill(''); await age.pressSequentially('-') // bad input from an empty field
    await submit(page)
    await expect(pv.getByText('Lütfen bir sayı girin.')).toBeVisible()
    await age.fill('42'); await submit(page)
    await expect(result(page)).toHaveText('Form geçerli. Bu bir önizlemedir; veriler hiçbir yere gönderilmedi.')
    await age.fill(''); await age.pressSequentially('4-')
    await pv.getByRole('button', { name: 'Temizle' }).click()
    expect(await age.evaluate((el: HTMLInputElement) => el.validity.badInput)).toBe(false)
    await page.getByLabel('Zorunlu alan').uncheck(); await submit(page)
    await expect(result(page)).toContainText('Form geçerli')
  })

  test('F27 BUG-006 regression: options are trimmed, de-duplicated and identical in storage, preview, validation and export', async ({ page }) => {
    await page.goto('/'); await newForm(page); await add(page, 'Seçim kutusu')
    await page.getByLabel('Seçenekler').fill('  İstanbul \nAnkara\n\nAnkara')
    await page.getByLabel('Zorunlu alan').check() // leaving the textarea normalises the stored list
    const options = preview(page).getByLabel(/Şehir/).locator('option')
    await expect(options).toHaveText(['Seçiniz…', 'İstanbul', 'Ankara'])
    await expect(page.getByLabel('Seçenekler')).toHaveValue('İstanbul\nAnkara')
    expect((await stored(page))[0].fields[0].options).toEqual(['İstanbul', 'Ankara'])
    await preview(page).getByLabel(/Şehir/).selectOption('İstanbul')
    await submit(page)
    await expect(result(page)).toContainText('Form geçerli')
    await page.getByRole('button', { name: "JSON'u dışa aktar" }).click()
    expect(JSON.parse(await page.getByLabel('Dışa aktarılan JSON').innerText()).form.fields[0].options).toEqual(['İstanbul', 'Ankara'])
  })

  test('F28 BUG-007 regression: preview errors follow schema changes (required on/off)', async ({ page }) => {
    await page.goto('/'); await newForm(page); await add(page, 'Kısa metin'); await page.getByLabel('Zorunlu alan').check()
    await submit(page)
    await expect(preview(page).getByText('Bu alan zorunludur.')).toBeVisible()
    await page.getByLabel('Zorunlu alan').uncheck()
    await expect(preview(page).getByText('Bu alan zorunludur.')).toHaveCount(0)
    await expect(result(page)).toHaveText('') // no stale "1 alanda hata var"
    await page.getByLabel('Zorunlu alan').check()
    await expect(preview(page).getByText('Bu alan zorunludur.')).toBeVisible() // and come back when the rule returns
  })

  test('F29 BUG-008 regression: export file names keep Turkish letters correctly (İ ı Ş ş Ğ ğ Ü ü Ö ö Ç ç)', async ({ page }) => {
    await page.goto('/'); await newForm(page, 'İŞĞÜÖÇ ışğüöç Iİ')
    await page.getByRole('button', { name: "JSON'u dışa aktar" }).click()
    await expect(page.getByRole('dialog')).toContainText('işğüöç-ışğüöç-ıi.schemaforge.json')
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'JSON indir' }).click()])
    expect(download.suggestedFilename()).toBe('işğüöç-ışğüöç-ıi.schemaforge.json')
  })

  test('F30 BUG-009 regression: Tab and Shift+Tab stay inside both modals; focus returns to a sensible trigger', async ({ page }) => {
    const inside = (role: string) => page.evaluate((r) => Boolean(document.activeElement?.closest(`[role=${r}]`)), role)
    await page.goto('/'); await newForm(page, 'Odak testi')
    const open = page.getByRole('button', { name: "JSON'u dışa aktar" })
    await open.click()
    for (let i = 0; i < 8; i++) { await page.keyboard.press('Tab'); expect(await inside('dialog')).toBe(true) }
    await page.getByRole('dialog').getByRole('button', { name: 'Kapat' }).focus()
    await page.keyboard.press('Shift+Tab') // from the first element to the last
    await expect(page.getByRole('button', { name: 'JSON indir' })).toBeFocused()
    await page.keyboard.press('Tab') // and from the last back to the first
    await expect(page.getByRole('dialog').getByRole('button', { name: 'Kapat' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(open).toBeFocused()
    await toList(page)
    await page.getByRole('button', { name: 'Odak testi formunu sil' }).click()
    for (const key of ['Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) { await page.keyboard.press(key); expect(await inside('alertdialog')).toBe(true) }
    await page.getByRole('button', { name: 'Formu sil' }).click() // the trigger disappears with the form
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('main') // focus is not lost to <body>
  })

  test('F31 BUG-010 regression: an empty title or label still gives every button a meaningful accessible name', async ({ page }) => {
    await page.goto('/'); await newForm(page, '')
    await add(page, 'Kısa metin'); await page.getByLabel('Etiket').fill('')
    await expect(page.getByRole('button', { name: '(etiketsiz) alanını sil' })).toBeVisible()
    await expect(page.getByRole('button', { name: '(etiketsiz) alanını yukarı taşı' })).toBeDisabled()
    await toList(page)
    for (const action of ['düzenle', 'kopyala', 'sil']) await expect(page.getByRole('button', { name: `Adsız form formunu ${action}` })).toBeVisible()
    await page.getByRole('button', { name: 'Adsız form formunu sil' }).click()
    await expect(page.getByRole('alertdialog')).toContainText('"Adsız form" formu ve 1 alanı kalıcı olarak silinecek')
  })
})

test.describe('scenarios', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop only')

  test('Scenario A: customer contact form — build, validate, autosave, reload, export', async ({ page }) => {
    await page.goto('/')
    await newForm(page, 'Müşteri İletişim Formu')
    await page.getByLabel('Form açıklaması').fill('Sorularınızı iletin, 1 iş günü içinde dönüş yapalım.')
    await add(page, 'Kısa metin'); await page.getByLabel('Etiket').fill('Adınız'); await page.getByLabel('Zorunlu alan').check()
    await page.getByLabel('En az karakter').fill('2')
    await add(page, 'E-posta'); await page.getByLabel('Zorunlu alan').check()
    await add(page, 'Seçim kutusu'); await page.getByLabel('Etiket').fill('Konu'); await page.getByLabel('Seçenekler').fill('Satış\nDestek\nFatura')
    await add(page, 'Uzun metin'); await page.getByLabel('Etiket').fill('Mesaj'); await page.getByLabel('Zorunlu alan').check()
    await page.getByLabel('En fazla karakter').fill('500'); await page.getByLabel('Yer tutucu (placeholder)').fill('Mesajınızı yazın')
    const pv = preview(page)
    await submit(page)
    await expect(result(page)).toContainText('3 alanda hata var')
    await pv.getByLabel(/Adınız/).fill('Ayşe'); await pv.getByLabel(/E-posta/).fill('ayse@ornek.com')
    await pv.getByLabel('Konu').selectOption('Destek'); await pv.getByLabel(/Mesaj/).fill('Siparişim hakkında bilgi almak istiyorum.')
    await submit(page)
    await expect(result(page)).toContainText('Form geçerli')
    await page.screenshot({ path: `${SHOTS}/A-musteri-iletisim.png`, fullPage: true })
    const saved = await stored(page) // autosave: no save button exists
    await expect(page.getByRole('button', { name: /kaydet/i })).toHaveCount(0)
    await page.reload()
    expect(await stored(page)).toEqual(saved)
    await expect(fieldItems(page)).toHaveCount(4)
    await page.getByRole('button', { name: "JSON'u dışa aktar" }).click()
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'JSON indir' }).click()])
    const json = JSON.parse(readFileSync((await download.path())!, 'utf-8'))
    expect(json.form.fields).toEqual([
      { order: 1, name: 'adiniz', type: 'text', label: 'Adınız', required: true, rules: { minLength: 2 } },
      { order: 2, name: 'e_posta', type: 'email', label: 'E-posta', required: true, rules: {} },
      { order: 3, name: 'konu', type: 'select', label: 'Konu', required: false, rules: {}, options: ['Satış', 'Destek', 'Fatura'] },
      { order: 4, name: 'mesaj', type: 'textarea', label: 'Mesaj', placeholder: 'Mesajınızı yazın', required: true, rules: { maxLength: 500 } },
    ])
  })

  test('Scenario B: registration form with 6 field types — invalid data, edit the schema, test again', async ({ page }) => {
    await page.goto('/')
    await newForm(page, 'Etkinlik Kayıt')
    await add(page, 'Kısa metin'); await page.getByLabel('Zorunlu alan').check()
    await add(page, 'E-posta'); await page.getByLabel('Zorunlu alan').check()
    await add(page, 'Sayı'); await page.getByLabel('En küçük değer').fill('18')
    await add(page, 'Tarih'); await page.getByLabel('Etiket').fill('Katılım tarihi'); await page.getByLabel('En erken tarih').fill('2026-11-01')
    await add(page, 'Seçim kutusu'); await page.getByLabel('Etiket').fill('Bilet'); await page.getByLabel('Seçenekler').fill('Öğrenci\nStandart')
    await page.getByLabel('Zorunlu alan').check()
    await add(page, 'Onay kutusu'); await page.getByLabel('Zorunlu alan').check()
    const pv = preview(page)
    await pv.getByLabel(/E-posta/).fill('yanlis-adres')
    await pv.getByLabel('Yaş').fill('16')
    await pv.getByLabel('Katılım tarihi').fill('2026-10-01')
    await submit(page)
    await expect(result(page)).toContainText('6 alanda hata var')
    await page.screenshot({ path: `${SHOTS}/B-kayit-hatalar.png`, fullPage: true })
    // edit the schema: age limit lowered, ticket no longer required, consent removed
    await page.getByRole('button', { name: /^3\. Yaş/ }).click(); await page.getByLabel('En küçük değer').fill('16')
    await page.getByRole('button', { name: /^5\. Bilet/ }).click(); await page.getByLabel('Zorunlu alan').uncheck()
    await page.getByRole('button', { name: 'Koşulları kabul ediyorum alanını sil' }).click()
    await page.getByRole('button', { name: 'Alanı sil' }).click()
    await pv.getByLabel(/Ad Soyad/).fill('Deniz Yılmaz'); await pv.getByLabel(/E-posta/).fill('deniz@ornek.com')
    await pv.getByLabel('Katılım tarihi').fill('2026-11-15')
    await submit(page)
    await expect(result(page)).toContainText('Form geçerli')
    expect((await stored(page))[0].fields.map((f: { type: string }) => f.type)).toEqual(['text', 'email', 'number', 'date', 'select'])
  })

  test('Scenario C: several forms — switch, delete one, keep the others, reload', async ({ page }) => {
    await page.goto('/')
    await newForm(page, 'Form 1'); await add(page, 'Kısa metin'); await toList(page)
    await newForm(page, 'Form 2'); await add(page, 'E-posta'); await add(page, 'Sayı'); await toList(page)
    await newForm(page, 'Form 3'); await add(page, 'Tarih'); await toList(page)
    await page.getByRole('button', { name: 'Form 1 formunu düzenle' }).click()
    await expect(fieldItems(page)).toHaveCount(1); await page.getByLabel('Form başlığı').fill('Form 1 (güncel)'); await toList(page)
    await page.getByRole('button', { name: 'Form 2 formunu düzenle' }).click()
    await expect(fieldItems(page)).toHaveCount(2); await toList(page)
    await page.getByRole('button', { name: 'Form 3 formunu sil' }).click(); await page.getByRole('button', { name: 'Formu sil' }).click()
    await page.reload()
    await expect(cards(page)).toHaveCount(2)
    const forms = await stored(page)
    expect(forms.map((f: { title: string; fields: unknown[] }) => [f.title, f.fields.length])).toEqual([['Form 2', 2], ['Form 1 (güncel)', 1]])
    await page.screenshot({ path: `${SHOTS}/C-coklu-form.png`, fullPage: true })
  })
})

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only')

  test('M01 mobile: create, edit, preview, export and delete; no horizontal overflow; dialogs fit the screen', async ({ page }) => {
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    await page.goto('/')
    expect(await overflow()).toBeLessThanOrEqual(0)
    await page.getByRole('button', { name: 'İlk formu oluştur' }).tap()
    await page.getByLabel('Form başlığı').fill('Mobil Kayıt')
    await add(page, 'Kısa metin'); await page.getByLabel('Zorunlu alan').check(); await add(page, 'E-posta')
    expect(await overflow()).toBeLessThanOrEqual(0)
    await preview(page).getByRole('button', { name: 'Gönder (test)' }).tap()
    await expect(result(page)).toContainText('1 alanda hata var')
    await page.screenshot({ path: `${SHOTS}/M01-mobil-editor.png`, fullPage: true })
    await page.getByRole('button', { name: "JSON'u dışa aktar" }).tap()
    const box = await page.getByRole('dialog').boundingBox()
    expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(390)
    await page.screenshot({ path: `${SHOTS}/M01-mobil-json.png` })
    await page.getByRole('button', { name: 'Kapat' }).tap()
    await toList(page)
    await page.getByRole('button', { name: 'Mobil Kayıt formunu sil' }).tap()
    const dbox = await page.getByRole('alertdialog').boundingBox()
    expect(dbox!.x + dbox!.width).toBeLessThanOrEqual(390)
    await page.getByRole('button', { name: 'Formu sil' }).tap()
    await expect(page.getByText('Henüz form yok')).toBeVisible()
    expect(await overflow()).toBeLessThanOrEqual(0)
  })
})
