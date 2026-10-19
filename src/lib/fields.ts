import { FIELD_TYPES, RULES_BY_TYPE, type FieldRules, type FieldType, type FormField, type FormSchema } from '../interfaces/form'

export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Turkish-friendly slug used for field names: "E-posta adresi" -> "e_posta_adresi". */
export function toFieldName(label: string): string {
  const map: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u' }
  const slug = label
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => map[c] ?? c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return slug || 'alan'
}

/** Makes `name` unique among the other fields of a form by appending _2, _3 ... */
export function uniqueName(name: string, fields: FormField[], selfId?: string): string {
  const taken = new Set(fields.filter((f) => f.id !== selfId).map((f) => f.name))
  if (!taken.has(name)) return name
  let i = 2
  while (taken.has(`${name}_${i}`)) i += 1
  return `${name}_${i}`
}

const DEFAULT_LABELS: Record<FieldType, string> = {
  text: 'Ad Soyad',
  textarea: 'Mesajınız',
  number: 'Yaş',
  email: 'E-posta',
  select: 'Şehir',
  checkbox: 'Koşulları kabul ediyorum',
  date: 'Başlangıç tarihi',
}

export function createField(type: FieldType, existing: FormField[] = []): FormField {
  const label = DEFAULT_LABELS[type]
  return {
    id: newId(),
    type,
    label,
    name: uniqueName(toFieldName(label), existing),
    placeholder: '',
    helpText: '',
    required: false,
    rules: {},
    options: type === 'select' ? ['Seçenek 1', 'Seçenek 2'] : [],
  }
}

/** Changing the type keeps label/name/required but drops rules and options that no longer apply. */
export function changeFieldType(field: FormField, type: FieldType): FormField {
  const allowed = RULES_BY_TYPE[type]
  const rules: FieldRules = {}
  for (const key of allowed) {
    if (field.rules[key] !== undefined) (rules as Record<string, unknown>)[key] = field.rules[key]
  }
  return {
    ...field,
    type,
    rules,
    options: type === 'select' ? (field.options.length ? field.options : ['Seçenek 1', 'Seçenek 2']) : [],
    placeholder: type === 'checkbox' || type === 'select' || type === 'date' ? '' : field.placeholder,
  }
}

export function createForm(title = 'Adsız form'): FormSchema {
  const now = new Date().toISOString()
  return { id: newId(), title, description: '', fields: [], createdAt: now, updatedAt: now }
}

export function duplicateForm(form: FormSchema, existingTitles: string[]): FormSchema {
  const now = new Date().toISOString()
  let title = `${form.title} (kopya)`
  let i = 2
  while (existingTitles.includes(title)) title = `${form.title} (kopya ${i++})`
  return { ...form, id: newId(), title, fields: form.fields.map((f) => ({ ...f, id: newId(), rules: { ...f.rules }, options: [...f.options] })), createdAt: now, updatedAt: now }
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list
  const copy = [...list]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

export function isFieldType(value: unknown): value is FieldType {
  return typeof value === 'string' && (FIELD_TYPES as readonly string[]).includes(value)
}
