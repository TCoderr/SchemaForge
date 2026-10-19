/** User scenarios from the task (1-11) on the whole app with React Testing Library. Scenario 12 (mobile) runs in Playwright. */
import { act, fireEvent, render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { createField, createForm } from './lib/fields'
import { STORAGE_KEY } from './lib/storage'
import type { FormSchema } from './interfaces/form'

const stored = (): FormSchema[] => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{"forms":[]}').forms
const seed = (forms: FormSchema[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, forms }))

async function newFormInEditor() {
  const user = userEvent.setup()
  const view = render(<App />)
  await user.click(screen.getByRole('button', { name: '+ Yeni form' }))
  await screen.findByLabelText('Form başlığı')
  return Object.assign(user, { unmount: view.unmount })
}

describe('SchemaForge user scenarios', () => {
  it('1. creates a new form and opens the editor', async () => {
    await newFormInEditor()
    expect(screen.getByLabelText('Form başlığı')).toHaveValue('Adsız form')
    expect(stored()).toHaveLength(1)
  })

  it('2. lists stored forms on the dashboard', () => {
    seed([{ ...createForm('İletişim'), fields: [createField('email')] }, createForm('Başvuru')])
    render(<App />)
    const list = screen.getByRole('list', { name: 'Form listesi' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(within(list).getByText('İletişim')).toBeInTheDocument()
    expect(within(list).getByText('1 alan')).toBeInTheDocument()
  })

  it('3. edits the form title (saved and visible in the list)', async () => {
    const user = await newFormInEditor()
    const title = screen.getByLabelText('Form başlığı')
    await user.clear(title); await user.type(title, 'Müşteri Geri Bildirimi')
    expect(stored()[0].title).toBe('Müşteri Geri Bildirimi')
    await user.click(screen.getByRole('link', { name: '← Formlar' }))
    expect(await screen.findByText('Müşteri Geri Bildirimi')).toBeInTheDocument()
  })

  it('4. adds a field; it appears in the field list and the live preview', async () => {
    const user = await newFormInEditor()
    await user.click(screen.getByRole('button', { name: 'Kısa metin alanı ekle' }))
    const fieldList = screen.getByRole('list', { name: 'Form alanları' })
    expect(within(fieldList).getByText(/1\. Ad Soyad/)).toBeInTheDocument()
    const preview = screen.getByRole('form', { name: 'Form önizlemesi' })
    expect(within(preview).getByLabelText('Ad Soyad')).toHaveAttribute('type', 'text')
    expect(stored()[0].fields[0]).toMatchObject({ type: 'text', label: 'Ad Soyad', name: 'ad_soyad' })
  })

  it('4b. label edits update the preview live and keep the JSON name in sync', async () => {
    const user = await newFormInEditor()
    await user.click(screen.getByRole('button', { name: 'Kısa metin alanı ekle' }))
    const label = screen.getByLabelText('Etiket')
    await user.clear(label); await user.type(label, 'Firma Adı')
    expect(within(screen.getByRole('form', { name: 'Form önizlemesi' })).getByLabelText('Firma Adı')).toBeInTheDocument()
    expect(screen.getByLabelText('Alan adı (JSON anahtarı)')).toHaveValue('firma_adi')
  })

  it('5. changes the field type (text -> email, then -> select with options)', async () => {
    const user = await newFormInEditor()
    await user.click(screen.getByRole('button', { name: 'Kısa metin alanı ekle' }))
    await user.selectOptions(screen.getByLabelText('Alan türü'), 'email')
    const preview = screen.getByRole('form', { name: 'Form önizlemesi' })
    expect(within(preview).getByLabelText('Ad Soyad')).toHaveAttribute('type', 'email')
    await user.selectOptions(screen.getByLabelText('Alan türü'), 'select')
    expect(within(preview).getByRole('combobox', { name: 'Ad Soyad' })).toBeInTheDocument()
    expect(stored()[0].fields[0].type).toBe('select')
  })

  it('6. required and rule validation works in the preview', async () => {
    const user = await newFormInEditor()
    await user.click(screen.getByRole('button', { name: 'E-posta alanı ekle' }))
    await user.click(screen.getByLabelText('Zorunlu alan'))
    const preview = screen.getByRole('form', { name: 'Form önizlemesi' })
    await user.click(within(preview).getByRole('button', { name: 'Gönder (test)' }))
    const input = within(preview).getByLabelText(/E-posta/)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(within(preview).getByText('Bu alan zorunludur.')).toBeInTheDocument()
    expect(within(preview).getByText(/1 alanda hata var/)).toBeInTheDocument()
    await user.type(input, 'yanlis@adres')
    await user.click(within(preview).getByRole('button', { name: 'Gönder (test)' }))
    expect(within(preview).getByText(/Geçerli bir e-posta/)).toBeInTheDocument()
    await user.clear(input); await user.type(input, 'ornek@alanadi.com')
    await user.click(within(preview).getByRole('button', { name: 'Gönder (test)' }))
    expect(within(preview).getByText(/Form geçerli/)).toBeInTheDocument()
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('7. deletes a field after confirmation (cancel keeps it)', async () => {
    const user = await newFormInEditor()
    await user.click(screen.getByRole('button', { name: 'Kısa metin alanı ekle' }))
    await user.click(screen.getByRole('button', { name: 'Sayı alanı ekle' }))
    await user.click(screen.getByRole('button', { name: 'Ad Soyad alanını sil' }))
    await user.click(screen.getByRole('button', { name: 'Vazgeç' }))
    expect(stored()[0].fields).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Ad Soyad alanını sil' }))
    expect(screen.getByRole('alertdialog')).toHaveTextContent('Alan silinsin mi?')
    await user.click(screen.getByRole('button', { name: 'Alanı sil' }))
    expect(stored()[0].fields.map((f) => f.label)).toEqual(['Yaş'])
  })

  it('8. deletes a form only after confirmation', async () => {
    seed([createForm('Silinecek'), createForm('Kalacak')])
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Silinecek formunu sil' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByText('Silinecek')).toBeInTheDocument()
    expect(stored()).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Silinecek formunu sil' }))
    await user.click(screen.getByRole('button', { name: 'Formu sil' }))
    expect(screen.queryByText('Silinecek')).not.toBeInTheDocument()
    expect(stored().map((f) => f.title)).toEqual(['Kalacak'])
  })

  it('8b. duplicates and reorders', async () => {
    seed([{ ...createForm('Anket'), fields: [createField('text'), createField('number')] }])
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Anket formunu kopyala' }))
    expect(stored().map((f) => f.title)).toEqual(['Anket', 'Anket (kopya)'])
    await user.click(screen.getAllByRole('button', { name: /formunu düzenle/ })[0])
    await user.click(await screen.findByRole('button', { name: 'Yaş alanını yukarı taşı' }))
    expect(stored()[0].fields.map((f) => f.label)).toEqual(['Yaş', 'Ad Soyad'])
  })

  it('9. data survives a reload (unmount + fresh mount reading LocalStorage)', async () => {
    const user = await newFormInEditor()
    await user.click(screen.getByRole('button', { name: 'Tarih alanı ekle' }))
    user.unmount()            // the whole React tree and its in-memory state are gone
    window.location.hash = ''
    render(<App />)
    expect(await screen.findByText('Adsız form')).toBeInTheDocument()
    expect(screen.getByText('1 alan')).toBeInTheDocument()
  })

  it('10. exports valid JSON with types, labels, rules and order', async () => {
    const user = await newFormInEditor()
    await user.click(screen.getByRole('button', { name: 'Kısa metin alanı ekle' }))
    await user.type(screen.getByLabelText('En az karakter'), '3')
    await user.click(screen.getByLabelText('Zorunlu alan'))
    await user.click(screen.getByRole('button', { name: 'E-posta alanı ekle' }))
    await user.click(screen.getByRole('button', { name: "JSON'u dışa aktar" }))
    const dialog = screen.getByRole('dialog', { name: 'JSON dışa aktarma' })
    const json = JSON.parse(within(dialog).getByLabelText('Dışa aktarılan JSON').textContent ?? '')
    expect(json.form.fields).toEqual([
      { order: 1, name: 'ad_soyad', type: 'text', label: 'Ad Soyad', required: true, rules: { minLength: 3 } },
      { order: 2, name: 'e_posta', type: 'email', label: 'E-posta', required: false, rules: {} },
    ])
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('11a. corrupt LocalStorage does not crash the app; it reports and can start clean', async () => {
    localStorage.setItem(STORAGE_KEY, '{"forms": [broken')
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('alert')).toHaveTextContent('okunamadı')
    expect(screen.getByText('Henüz form yok')).toBeInTheDocument()
    expect(Object.keys(localStorage).some((k) => k.startsWith(`${STORAGE_KEY}.backup-`))).toBe(true)
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{"forms": [broken') // not overwritten before the user acts
    await user.click(screen.getByRole('button', { name: 'Temiz başlat' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('11b. partially invalid data keeps the valid forms and warns', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ forms: [createForm('Sağlam'), { id: 1 }] }))
    render(<App />)
    expect(screen.getByRole('alert')).toHaveTextContent('1 form kaydı geçersiz')
    expect(screen.getByText('Sağlam')).toBeInTheDocument()
  })

  it('11c. unknown form id shows a message instead of a blank page', async () => {
    window.location.hash = '#/forms/olmayan-id'
    render(<App />)
    expect(await screen.findByText('Form bulunamadı')).toBeInTheDocument()
  })

  it('BUG-001: a save from another tab is adopted, so this tab never overwrites it with a stale list', async () => {
    seed([createForm('Bu sekme')])
    const user = userEvent.setup()
    render(<App />)
    const other = [createForm('Diğer sekme'), ...stored()]
    const newValue = JSON.stringify({ version: 1, forms: other })
    localStorage.setItem(STORAGE_KEY, newValue) // what the other tab wrote
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue })) })
    expect(await screen.findByText('Diğer sekme')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '+ Yeni form' })) // this tab saves next
    expect(stored().map((f) => f.title)).toEqual(['Adsız form', 'Diğer sekme', 'Bu sekme'])
  })

  it('BUG-002: "Temiz başlat" disappears once the user has created a form after a corrupt-data warning', async () => {
    localStorage.setItem(STORAGE_KEY, '{bozuk')
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('button', { name: 'Temiz başlat' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'İlk formu oluştur' }))
    await screen.findByLabelText('Form başlığı')
    expect(screen.queryByRole('button', { name: 'Temiz başlat' })).not.toBeInTheDocument()
    expect(stored()).toHaveLength(1)
  })

  it('BUG-003: the skip link focuses the content without changing the route', async () => {
    const user = await newFormInEditor()
    const hash = window.location.hash
    await user.click(screen.getByRole('link', { name: 'İçeriğe atla' }))
    expect(window.location.hash).toBe(hash)
    expect(screen.getByLabelText('Form başlığı')).toBeInTheDocument()
    expect(document.activeElement?.id).toBe('main')
  })

  it('BUG-004: pressing the preview buttons does not move focus out of the field (no layout shift before the click)', async () => {
    const user = await newFormInEditor()
    await user.click(screen.getByRole('button', { name: 'Kısa metin alanı ekle' }))
    const preview = screen.getByRole('form', { name: 'Form önizlemesi' })
    for (const name of ['Gönder (test)', 'Temizle']) {
      // fireEvent returns false when the default action (moving focus) was prevented
      expect(fireEvent.mouseDown(within(preview).getByRole('button', { name }))).toBe(false)
    }
  })

  it('security: user text is rendered as text, never as HTML', async () => {
    const user = await newFormInEditor()
    await user.click(screen.getByRole('button', { name: 'Kısa metin alanı ekle' }))
    const label = screen.getByLabelText('Etiket')
    await user.clear(label)
    await user.type(label, '<img src=x onerror=alert(1)>')
    await waitFor(() => expect(screen.getAllByText('<img src=x onerror=alert(1)>').length).toBeGreaterThan(0))
    expect(document.querySelector('img[src="x"]')).toBeNull()
  })
})
