import { useState, type FormEvent } from 'react'
import type { FormField, FormSchema, FormValues } from '../interfaces/form'
import { cleanOptions } from '../lib/fields'
import { validateForm, validateValue } from '../lib/validation'
import { Button, inputClass, Panel } from './ui'

/** Renders the schema as a real, working form. Values stay in memory only; nothing is sent anywhere. */
export function PreviewPanel({ form }: { form: FormSchema }) {
  const [values, setValues] = useState<FormValues>({})
  /** Number inputs whose text the browser cannot parse (it reports "" for them), keyed by field id. */
  const [badInput, setBadInput] = useState<Record<string, boolean>>({})
  /** Fields whose error is on screen (flagged on blur or submit). The messages themselves are derived from the
   *  current schema on every render, so they follow rule changes such as "required" being switched off. */
  const [flagged, setFlagged] = useState<Record<string, boolean>>({})
  const [result, setResult] = useState<'ok' | 'error' | null>(null)
  const [generation, setGeneration] = useState(0) // "Temizle" remounts the inputs so rejected text disappears too

  const check = (f: FormField) => validateValue(f, values[f.id], badInput[f.id])
  const errors: Record<string, string> = {}
  for (const f of form.fields) {
    const message = flagged[f.id] ? check(f) : null
    if (message) errors[f.id] = message
  }
  const errorCount = Object.keys(errors).length
  const valid = Object.keys(validateForm(form, values, badInput)).length === 0

  const setValue = (f: FormField, v: string | boolean) => {
    setValues((prev) => ({ ...prev, [f.id]: v }))
    setResult(null)
    if (flagged[f.id] && !validateValue(f, v, badInput[f.id])) setFlagged((prev) => ({ ...prev, [f.id]: false }))
  }
  const setBad = (f: FormField, bad: boolean) => setBadInput((prev) => (Boolean(prev[f.id]) === bad ? prev : { ...prev, [f.id]: bad }))
  const onBlur = (f: FormField) => setFlagged((prev) => ({ ...prev, [f.id]: check(f) !== null }))
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateForm(form, values, badInput)
    setFlagged(Object.fromEntries(form.fields.map((f) => [f.id, f.id in errs])))
    setResult(Object.keys(errs).length ? 'error' : 'ok')
  }
  const reset = () => { setValues({}); setBadInput({}); setFlagged({}); setResult(null); setGeneration((g) => g + 1) }

  return (
    <Panel title="Canlı önizleme" id="preview-panel-title">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <h3 className="text-xl font-semibold text-slate-900">{form.title || 'Adsız form'}</h3>
        {form.description && <p className="mt-1 text-sm text-slate-600">{form.description}</p>}
      </div>
      {form.fields.length === 0 ? (
        <p className="text-sm text-slate-500">Alan eklediğinizde form burada görünür.</p>
      ) : (
        <form key={generation} noValidate onSubmit={onSubmit} aria-label="Form önizlemesi" className="space-y-4">
          {form.fields.map((f) => <PreviewField key={f.id} field={f} value={values[f.id]} error={errors[f.id]}
            onChange={(v) => setValue(f, v)} onBadInput={(bad) => setBad(f, bad)} onBlur={() => onBlur(f)} />)}
          {/* preventDefault on mousedown keeps focus in the field: otherwise its blur validation inserts an error message,
              the buttons shift down under the pointer and the click is lost. Keyboard and touch activation are unchanged. */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" variant="primary" onMouseDown={(e) => e.preventDefault()}>Gönder (test)</Button>
            <Button onClick={reset} onMouseDown={(e) => e.preventDefault()}>Temizle</Button>
          </div>
          <div aria-live="polite">
            {result === 'ok' && valid && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Form geçerli. Bu bir önizlemedir; veriler hiçbir yere gönderilmedi.</p>}
            {result === 'error' && errorCount > 0 && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{errorCount} alanda hata var. Lütfen işaretli alanları düzeltin.</p>}
          </div>
        </form>
      )}
    </Panel>
  )
}

function PreviewField({ field: f, value, error, onChange, onBadInput, onBlur }: {
  field: FormField; value: string | boolean | undefined; error?: string; onChange: (v: string | boolean) => void
  onBadInput: (bad: boolean) => void; onBlur: () => void
}) {
  const id = `pv-${f.id}`
  const describedBy = [f.helpText ? `${id}-help` : '', error ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined
  const common = { id, name: f.name, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy, 'aria-required': f.required || undefined, onBlur }
  const cls = `${inputClass} ${error ? 'border-red-500' : ''}`
  const text = typeof value === 'string' ? value : ''

  const label = (
    <label htmlFor={id} className="block text-sm font-medium text-slate-800">
      {f.label || '(etiketsiz alan)'}{f.required && <span className="text-red-600" aria-hidden="true"> *</span>}
      {f.required && <span className="sr-only"> (zorunlu)</span>}
    </label>
  )
  let control
  switch (f.type) {
    case 'textarea':
      control = <textarea {...common} rows={4} className={cls} placeholder={f.placeholder} value={text} onChange={(e) => onChange(e.target.value)} />
      break
    case 'select':
      control = (
        <select {...common} className={cls} value={text} onChange={(e) => onChange(e.target.value)}>
          <option value="">Seçiniz…</option>
          {cleanOptions(f.options).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )
      break
    case 'checkbox':
      return (
        <div>
          <div className="flex items-center gap-2">
            <input {...common} type="checkbox" className="size-4 accent-indigo-600" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
            {label}
          </div>
          <Help f={f} id={id} error={error} />
        </div>
      )
    default:
      control = (
        <input {...common} className={cls} placeholder={f.placeholder} value={text}
          type={f.type === 'number' ? 'number' : f.type === 'email' ? 'email' : f.type === 'date' ? 'date' : 'text'}
          min={f.type === 'number' ? f.rules.min : f.type === 'date' ? f.rules.minDate : undefined}
          max={f.type === 'number' ? f.rules.max : f.type === 'date' ? f.rules.maxDate : undefined}
          maxLength={f.type !== 'number' && f.type !== 'date' ? f.rules.maxLength : undefined}
          // onInput fires on every keystroke; onChange does not when the parsed value stays "" (e.g. "-" -> "1-")
          onInput={f.type === 'number' ? (e) => onBadInput(e.currentTarget.validity.badInput) : undefined}
          onChange={(e) => onChange(e.target.value)} />
      )
  }
  return <div className="space-y-1">{label}{control}<Help f={f} id={id} error={error} /></div>
}

function Help({ f, id, error }: { f: FormField; id: string; error?: string }) {
  return (
    <>
      {f.helpText && <p id={`${id}-help`} className="text-xs text-slate-500">{f.helpText}</p>}
      {error && <p id={`${id}-err`} className="text-sm text-red-700">{error}</p>}
    </>
  )
}
