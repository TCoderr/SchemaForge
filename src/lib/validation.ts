import type { FormField, FormSchema, FormValues } from '../interfaces/form'
import { cleanOptions } from './fields'

// Deliberately simple, readable e-mail check (one @, a dot in the domain, no spaces).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns a Turkish error message, or null when the value is valid for the field's rules.
 *  `badInput`: the browser holds text it could not parse (a number input reports such text as ""). */
export function validateValue(field: FormField, value: string | boolean | undefined, badInput = false): string | null {
  const { rules } = field
  if (field.type === 'checkbox') {
    return field.required && value !== true ? 'Bu kutunun işaretlenmesi zorunludur.' : null
  }
  if (field.type === 'number' && badInput) return 'Lütfen bir sayı girin.'
  const text = typeof value === 'string' ? value.trim() : ''
  if (text === '') return field.required ? 'Bu alan zorunludur.' : null

  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'email': {
      if (field.type === 'email' && !EMAIL_RE.test(text)) return 'Geçerli bir e-posta adresi girin (ör. ornek@alanadi.com).'
      if (rules.minLength !== undefined && text.length < rules.minLength) return `En az ${rules.minLength} karakter girin.`
      if (rules.maxLength !== undefined && text.length > rules.maxLength) return `En fazla ${rules.maxLength} karakter girebilirsiniz.`
      return null
    }
    case 'number': {
      const num = Number(text.replace(',', '.'))
      if (!Number.isFinite(num)) return 'Lütfen bir sayı girin.'
      if (rules.min !== undefined && num < rules.min) return `Değer en az ${rules.min} olmalıdır.`
      if (rules.max !== undefined && num > rules.max) return `Değer en fazla ${rules.max} olmalıdır.`
      return null
    }
    case 'date': {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(Date.parse(text))) return 'Geçerli bir tarih girin.'
      if (rules.minDate && text < rules.minDate) return `Tarih ${rules.minDate} veya sonrası olmalıdır.`
      if (rules.maxDate && text > rules.maxDate) return `Tarih ${rules.maxDate} veya öncesi olmalıdır.`
      return null
    }
    case 'select':
      return cleanOptions(field.options).includes(text) ? null : 'Listeden bir seçenek seçin.'
  }
}

export function validateForm(form: FormSchema, values: FormValues, badInput: Record<string, boolean> = {}): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of form.fields) {
    const message = validateValue(field, values[field.id], badInput[field.id])
    if (message) errors[field.id] = message
  }
  return errors
}

/** Design-time problems in the rules themselves (shown in the properties panel). */
export function ruleProblems(field: FormField): string[] {
  const r = field.rules
  const out: string[] = []
  if (r.minLength !== undefined && r.maxLength !== undefined && r.minLength > r.maxLength) out.push('En az uzunluk, en fazla uzunluktan büyük olamaz.')
  if (r.min !== undefined && r.max !== undefined && r.min > r.max) out.push('En küçük değer, en büyük değerden büyük olamaz.')
  if (r.minDate && r.maxDate && r.minDate > r.maxDate) out.push('En erken tarih, en geç tarihten sonra olamaz.')
  if (field.type === 'select' && cleanOptions(field.options).length === 0) out.push('Seçim kutusunda en az bir seçenek olmalıdır.')
  if (!field.label.trim()) out.push('Etiket boş bırakılamaz.')
  return out
}

const NAME_RE = /^[a-z][a-z0-9_]*$/

/** The machine name must be a valid, unique JSON key. */
export function nameProblem(field: FormField, fields: FormField[]): string | null {
  if (!NAME_RE.test(field.name)) return 'Alan adı küçük harfle başlamalı; yalnızca a–z, 0–9 ve _ içermelidir.'
  if (fields.some((f) => f.id !== field.id && f.name === field.name)) return 'Bu alan adı formda zaten kullanılıyor.'
  return null
}

/** All design-time problems of a form (used to warn before export). */
export function formProblems(form: FormSchema): string[] {
  return form.fields.flatMap((f) => [...ruleProblems(f), nameProblem(f, form.fields)].filter((p): p is string => p !== null).map((p) => `${f.label || f.name}: ${p}`))
}
