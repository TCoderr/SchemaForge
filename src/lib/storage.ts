import { FIELD_TYPES, type FieldRules, type FormField, type FormSchema } from '../interfaces/form'
import { isFieldType } from './fields'

export const STORAGE_KEY = 'schemaforge.forms.v1'

export type LoadStatus =
  | { kind: 'ok' }
  | { kind: 'empty' }
  | { kind: 'partial'; skipped: number } // some stored forms were invalid and skipped
  | { kind: 'corrupt'; backupKey: string | null } // the stored value was not usable at all

export interface LoadResult {
  forms: FormSchema[]
  status: LoadStatus
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const isStr = (v: unknown): v is string => typeof v === 'string'
const optNum = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined)
const optDate = (v: unknown) => (isStr(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined)

/** Strict runtime check of one field. Unknown keys are dropped; wrong types make the field invalid. */
export function parseField(raw: unknown): FormField | null {
  if (!isObj(raw) || !isStr(raw.id) || !isFieldType(raw.type) || !isStr(raw.label) || !isStr(raw.name)) return null
  const r = isObj(raw.rules) ? raw.rules : {}
  const rules: FieldRules = {}
  const set = <K extends keyof FieldRules>(k: K, v: FieldRules[K]) => { if (v !== undefined) rules[k] = v }
  set('minLength', optNum(r.minLength)); set('maxLength', optNum(r.maxLength))
  set('min', optNum(r.min)); set('max', optNum(r.max))
  set('minDate', optDate(r.minDate)); set('maxDate', optDate(r.maxDate))
  return {
    id: raw.id,
    type: raw.type,
    label: raw.label,
    name: raw.name,
    placeholder: isStr(raw.placeholder) ? raw.placeholder : '',
    helpText: isStr(raw.helpText) ? raw.helpText : '',
    required: raw.required === true,
    rules,
    options: Array.isArray(raw.options) ? raw.options.filter(isStr) : [],
  }
}

export function parseForm(raw: unknown): FormSchema | null {
  if (!isObj(raw) || !isStr(raw.id) || !isStr(raw.title) || !Array.isArray(raw.fields)) return null
  const fields = raw.fields.map(parseField)
  if (fields.some((f) => f === null)) return null
  return {
    id: raw.id,
    title: raw.title,
    description: isStr(raw.description) ? raw.description : '',
    fields: fields as FormField[],
    createdAt: isStr(raw.createdAt) ? raw.createdAt : new Date(0).toISOString(),
    updatedAt: isStr(raw.updatedAt) ? raw.updatedAt : new Date(0).toISOString(),
  }
}

/** Never throws: corrupt data is backed up under a separate key and reported to the UI. */
export function loadForms(storage: Storage = window.localStorage): LoadResult {
  let text: string | null
  try {
    text = storage.getItem(STORAGE_KEY)
  } catch {
    return { forms: [], status: { kind: 'corrupt', backupKey: null } } // storage not accessible (e.g. blocked)
  }
  if (text === null) return { forms: [], status: { kind: 'empty' } }
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return { forms: [], status: { kind: 'corrupt', backupKey: backup(storage, text) } }
  }
  const list = isObj(data) && Array.isArray(data.forms) ? data.forms : null
  if (!list) return { forms: [], status: { kind: 'corrupt', backupKey: backup(storage, text) } }
  const forms = list.map(parseForm).filter((f): f is FormSchema => f !== null)
  const skipped = list.length - forms.length
  if (skipped > 0) backup(storage, text)
  return { forms, status: skipped > 0 ? { kind: 'partial', skipped } : { kind: 'ok' } }
}

function backup(storage: Storage, text: string): string | null {
  const key = `${STORAGE_KEY}.backup-${Date.now()}`
  try {
    storage.setItem(key, text)
    return key
  } catch {
    return null
  }
}

export function saveForms(forms: FormSchema[], storage: Storage = window.localStorage): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, forms }))
    return true
  } catch {
    return false // quota exceeded or storage blocked; the UI shows a warning
  }
}

export const SUPPORTED_TYPES = FIELD_TYPES
