// SchemaForge data model. Author: Tugay Sinan Ergün

export const FIELD_TYPES = ['text', 'textarea', 'number', 'email', 'select', 'checkbox', 'date'] as const
export type FieldType = (typeof FIELD_TYPES)[number]

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Kısa metin',
  textarea: 'Uzun metin',
  number: 'Sayı',
  email: 'E-posta',
  select: 'Seçim kutusu',
  checkbox: 'Onay kutusu',
  date: 'Tarih',
}

/** Validation rules. Only the rules that make sense for a field type are used (see RULES_BY_TYPE). */
export interface FieldRules {
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  minDate?: string // YYYY-MM-DD
  maxDate?: string
}

export const RULES_BY_TYPE: Record<FieldType, (keyof FieldRules)[]> = {
  text: ['minLength', 'maxLength'],
  textarea: ['minLength', 'maxLength'],
  email: ['maxLength'],
  number: ['min', 'max'],
  date: ['minDate', 'maxDate'],
  select: [],
  checkbox: [],
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  /** Machine-readable key used in the exported JSON. */
  name: string
  placeholder: string
  helpText: string
  required: boolean
  rules: FieldRules
  /** Only for select fields. */
  options: string[]
}

export interface FormSchema {
  id: string
  title: string
  description: string
  fields: FormField[] // array order = field order
  createdAt: string
  updatedAt: string
}

/** Values entered in the live preview, keyed by field id. */
export type FormValues = Record<string, string | boolean>
