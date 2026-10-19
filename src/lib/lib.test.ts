import { describe, expect, it } from 'vitest'
import type { FormField, FormSchema } from '../interfaces/form'
import { buildExport, exportFileName, exportJson } from './exportSchema'
import { changeFieldType, cleanOptions, createField, createForm, duplicateForm, moveItem, toFieldName, uniqueName } from './fields'
import { loadForms, saveForms, STORAGE_KEY } from './storage'
import { formProblems, validateValue } from './validation'

const field = (patch: Partial<FormField>): FormField => ({ ...createField('text'), ...patch })

describe('validateValue', () => {
  it('required text / textarea', () => {
    const f = field({ required: true })
    expect(validateValue(f, '')).toBe('Bu alan zorunludur.')
    expect(validateValue(f, '   ')).toBe('Bu alan zorunludur.')
    expect(validateValue(f, 'Ada')).toBeNull()
    expect(validateValue(field({ required: false }), '')).toBeNull()
  })
  it('min / max length', () => {
    const f = field({ rules: { minLength: 3, maxLength: 5 } })
    expect(validateValue(f, 'ab')).toBe('En az 3 karakter girin.')
    expect(validateValue(f, 'abcdef')).toBe('En fazla 5 karakter girebilirsiniz.')
    expect(validateValue(f, 'abcd')).toBeNull()
  })
  it('email format', () => {
    const f = field({ type: 'email' })
    expect(validateValue(f, 'ornek@alanadi')).toMatch(/Geçerli bir e-posta/)
    expect(validateValue(f, 'a b@c.com')).toMatch(/Geçerli bir e-posta/)
    expect(validateValue(f, 'ornek@alanadi.com')).toBeNull()
  })
  it('number range and non-numbers', () => {
    const f = field({ type: 'number', rules: { min: 18, max: 65 } })
    expect(validateValue(f, 'abc')).toBe('Lütfen bir sayı girin.')
    expect(validateValue(f, '17')).toBe('Değer en az 18 olmalıdır.')
    expect(validateValue(f, '66')).toBe('Değer en fazla 65 olmalıdır.')
    expect(validateValue(f, '30')).toBeNull()
  })
  it('date range', () => {
    const f = field({ type: 'date', rules: { minDate: '2026-01-01', maxDate: '2026-12-31' } })
    expect(validateValue(f, '2025-12-31')).toMatch(/veya sonrası/)
    expect(validateValue(f, '2027-01-01')).toMatch(/veya öncesi/)
    expect(validateValue(f, '2026-06-15')).toBeNull()
  })
  it('select must be one of the options; required checkbox must be ticked', () => {
    expect(validateValue(field({ type: 'select', options: ['A', 'B'] }), 'C')).toBe('Listeden bir seçenek seçin.')
    expect(validateValue(field({ type: 'select', options: ['A', 'B'] }), 'A')).toBeNull()
    expect(validateValue(field({ type: 'checkbox', required: true }), false)).toMatch(/işaretlenmesi zorunludur/)
    expect(validateValue(field({ type: 'checkbox', required: true }), true)).toBeNull()
  })
})

describe('fields helpers', () => {
  it('Turkish label -> safe unique field name', () => {
    expect(toFieldName('E-posta Adresi')).toBe('e_posta_adresi')
    expect(toFieldName('Şehir / İlçe')).toBe('sehir_ilce')
    const a = createField('email'); const b = createField('email', [a])
    expect(b.name).toBe('e_posta_2')
    expect(uniqueName('x', [field({ name: 'x' }), field({ name: 'x_2' })])).toBe('x_3')
  })
  it('changing the type drops rules/options that no longer apply', () => {
    const f = field({ type: 'text', rules: { minLength: 2, maxLength: 9 } })
    const n = changeFieldType(f, 'number')
    expect(n.rules).toEqual({}); expect(n.type).toBe('number')
    const s = changeFieldType(f, 'select')
    expect(s.options.length).toBeGreaterThan(0)
    expect(changeFieldType(s, 'email').options).toEqual([])
    expect(changeFieldType(field({ type: 'textarea', rules: { maxLength: 9 } }), 'text').rules).toEqual({ maxLength: 9 })
  })
  it('moveItem and duplicateForm', () => {
    expect(moveItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1])
    expect(moveItem([1, 2, 3], 0, -1)).toEqual([1, 2, 3])
    const form = { ...createForm('Başvuru'), fields: [createField('text')] }
    const copy = duplicateForm(form, ['Başvuru', 'Başvuru (kopya)'])
    expect(copy.title).toBe('Başvuru (kopya 2)')
    expect(copy.id).not.toBe(form.id); expect(copy.fields[0].id).not.toBe(form.fields[0].id)
  })
})

describe('storage', () => {
  it('round-trips forms', () => {
    const form: FormSchema = { ...createForm('Test'), fields: [createField('date')] }
    expect(saveForms([form])).toBe(true)
    expect(loadForms()).toEqual({ forms: [form], status: { kind: 'ok' } })
  })
  it('empty storage', () => {
    expect(loadForms().status).toEqual({ kind: 'empty' })
  })
  it('corrupt JSON never throws and is backed up', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    const r = loadForms()
    expect(r.forms).toEqual([])
    expect(r.status.kind).toBe('corrupt')
    const key = (r.status as { backupKey: string }).backupKey
    expect(localStorage.getItem(key)).toBe('{not json')
  })
  it('wrong shape is treated as corrupt', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]))
    expect(loadForms().status.kind).toBe('corrupt')
  })
  it('invalid forms are skipped, valid ones recovered', () => {
    const good = { ...createForm('İyi'), fields: [createField('text')] }
    const bad = { id: 'x', title: 'Kötü', fields: [{ id: 'f', type: 'unknown-type', label: 'a', name: 'a' }] }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, forms: [good, bad, 'nope'] }))
    const r = loadForms()
    expect(r.forms.map((f) => f.title)).toEqual(['İyi'])
    expect(r.status).toEqual({ kind: 'partial', skipped: 2 })
  })
  it('storage that throws is handled', () => {
    const broken = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('quota') } } as unknown as Storage
    expect(loadForms(broken).status.kind).toBe('corrupt')
    expect(saveForms([], broken)).toBe(false)
  })
})

describe('JSON export', () => {
  it('is valid JSON with order, type, label, rules and options; no internal ids', () => {
    const form: FormSchema = {
      ...createForm('Kayıt'),
      fields: [
        field({ label: 'Ad', name: 'ad', required: true, rules: { minLength: 2, min: 5 } }),
        { ...createField('select'), label: 'Şehir', name: 'sehir', options: ['İzmir', '', 'Ankara'] },
      ],
    }
    const parsed = JSON.parse(exportJson(form))
    expect(parsed.format).toBe('schemaforge.form'); expect(parsed.version).toBe(1)
    expect(parsed.form.title).toBe('Kayıt')
    expect(parsed.form.fields[0]).toEqual({ order: 1, name: 'ad', type: 'text', label: 'Ad', required: true, rules: { minLength: 2 } })
    expect(parsed.form.fields[1]).toMatchObject({ order: 2, name: 'sehir', type: 'select', options: ['İzmir', 'Ankara'] })
    expect(JSON.stringify(parsed)).not.toContain(form.fields[0].id)
    expect(buildExport(form).form.fields).toHaveLength(2)
  })
  it('design problems are reported before export', () => {
    const form = { ...createForm(), fields: [field({ name: 'Bad Name', rules: { minLength: 9, maxLength: 2 } })] }
    const p = formProblems(form)
    expect(p.some((x) => x.includes('küçük harfle'))).toBe(true)
    expect(p.some((x) => x.includes('En az uzunluk'))).toBe(true)
  })
})

describe('1.0.2 regressions (BUG-005, BUG-006, BUG-008)', () => {
  it('BUG-005: a number the browser could not parse is invalid whether the field is optional or required', () => {
    const optional = { ...createField('number'), required: false }
    expect(validateValue(optional, '', true)).toBe('Lütfen bir sayı girin.')
    expect(validateValue({ ...optional, required: true }, '', true)).toBe('Lütfen bir sayı girin.')
    expect(validateValue(optional, '', false)).toBeNull()
    expect(validateValue(field({}), '', true)).toBeNull() // only number inputs report bad input
  })
  it('BUG-006: options are trimmed, empty lines and duplicates dropped, and validation/export agree', () => {
    expect(cleanOptions(['  İstanbul ', 'Ankara', '', ' Ankara'])).toEqual(['İstanbul', 'Ankara'])
    const select = { ...createField('select'), required: true, options: ['İstanbul ', 'Ankara'] }
    expect(validateValue(select, 'İstanbul')).toBeNull()
    expect(validateValue(select, 'İzmir')).toBe('Listeden bir seçenek seçin.')
    expect(buildExport({ ...createForm(), fields: [select] }).form.fields[0].options).toEqual(['İstanbul', 'Ankara'])
  })
  it('BUG-008: export file names lower-case Turkish letters correctly', () => {
    expect(exportFileName(createForm('İŞĞÜÖÇ ışğüöç Iİ'))).toBe('işğüöç-ışğüöç-ıi.schemaforge.json')
    expect(exportFileName(createForm('İletişim Formu'))).toBe('iletişim-formu.schemaforge.json')
    expect(exportFileName(createForm('   '))).toBe('form.schemaforge.json')
  })
})
