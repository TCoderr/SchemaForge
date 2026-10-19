import { RULES_BY_TYPE, type FormSchema } from '../interfaces/form'

export const EXPORT_FORMAT = 'schemaforge.form'
export const EXPORT_VERSION = 1

/** Portable JSON document: field order, type, label, name, rules and options. Internal ids are not exported. */
export function buildExport(form: FormSchema) {
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    form: {
      title: form.title,
      description: form.description,
      fields: form.fields.map((f, index) => {
        const rules: Record<string, number | string> = {}
        for (const key of RULES_BY_TYPE[f.type]) {
          const v = f.rules[key]
          if (v !== undefined) rules[key] = v
        }
        return {
          order: index + 1,
          name: f.name,
          type: f.type,
          label: f.label,
          ...(f.placeholder ? { placeholder: f.placeholder } : {}),
          ...(f.helpText ? { helpText: f.helpText } : {}),
          required: f.required,
          rules,
          ...(f.type === 'select' ? { options: f.options.filter((o) => o.trim()) } : {}),
        }
      }),
    },
  }
}

export function exportJson(form: FormSchema): string {
  return JSON.stringify(buildExport(form), null, 2)
}

export function exportFileName(form: FormSchema): string {
  const base = form.title.trim().toLowerCase().replace(/[^a-z0-9ğüşöçı]+/gi, '-').replace(/^-+|-+$/g, '') || 'form'
  return `${base}.schemaforge.json`
}

/** Triggers a browser download; returns false where downloads are not possible (e.g. tests). */
export function downloadJson(form: FormSchema): boolean {
  if (typeof URL.createObjectURL !== 'function') return false
  const blob = new Blob([exportJson(form)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = exportFileName(form)
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
  return true
}
