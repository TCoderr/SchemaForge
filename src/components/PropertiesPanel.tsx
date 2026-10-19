import { useId, type ReactNode } from 'react'
import { FIELD_TYPES, FIELD_TYPE_LABELS, RULES_BY_TYPE, type FieldRules, type FieldType, type FormField } from '../interfaces/form'
import { changeFieldType, toFieldName, uniqueName } from '../lib/fields'
import { nameProblem, ruleProblems } from '../lib/validation'
import { inputClass, Panel } from './ui'

const RULE_LABELS: Record<keyof FieldRules, string> = {
  minLength: 'En az karakter', maxLength: 'En fazla karakter', min: 'En küçük değer', max: 'En büyük değer',
  minDate: 'En erken tarih', maxDate: 'En geç tarih',
}
function Row({ label, htmlFor, children, hint }: { label: string; htmlFor: string; children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export function PropertiesPanel({ field, fields, onChange }: { field: FormField | null; fields: FormField[]; onChange: (f: FormField) => void }) {
  const uid = useId()
  if (!field) {
    return (
      <Panel title="Özellikler" id="props-panel-title">
        <p className="text-sm text-slate-500">Düzenlemek için soldan bir alan seçin veya yeni bir alan ekleyin.</p>
      </Panel>
    )
  }
  const id = (k: string) => `${uid}-${k}`
  const set = (patch: Partial<FormField>) => onChange({ ...field, ...patch })
  const setRule = (key: keyof FieldRules, raw: string) => {
    const rules = { ...field.rules }
    if (raw === '') delete rules[key]
    else if (key === 'minDate' || key === 'maxDate') rules[key] = raw
    else {
      const n = Number(raw)
      if (Number.isFinite(n)) rules[key] = n
    }
    set({ rules })
  }
  const onLabel = (label: string) => {
    // keep the machine name in sync with the label until the user edits the name by hand
    const auto = field.name === uniqueName(toFieldName(field.label), fields, field.id)
    set({ label, ...(auto ? { name: uniqueName(toFieldName(label), fields, field.id) } : {}) })
  }
  const problems = [...ruleProblems(field), ...[nameProblem(field, fields)].filter((p): p is string => p !== null)]
  const showPlaceholder = !['checkbox', 'select', 'date'].includes(field.type)

  return (
    <Panel title="Özellikler" id="props-panel-title">
      <div className="space-y-4">
        <Row label="Alan türü" htmlFor={id('type')}>
          <select id={id('type')} className={inputClass} value={field.type} onChange={(e) => onChange(changeFieldType(field, e.target.value as FieldType))}>
            {FIELD_TYPES.map((t) => <option key={t} value={t}>{FIELD_TYPE_LABELS[t]}</option>)}
          </select>
        </Row>
        <Row label="Etiket" htmlFor={id('label')}>
          <input id={id('label')} className={inputClass} value={field.label} onChange={(e) => onLabel(e.target.value)} />
        </Row>
        <Row label="Alan adı (JSON anahtarı)" htmlFor={id('name')} hint="Dışa aktarılan JSON'da bu ad kullanılır.">
          <input id={id('name')} className={`${inputClass} font-mono`} value={field.name} onChange={(e) => set({ name: e.target.value.trim() })} />
        </Row>
        {showPlaceholder && (
          <Row label="Yer tutucu (placeholder)" htmlFor={id('ph')}>
            <input id={id('ph')} className={inputClass} value={field.placeholder} onChange={(e) => set({ placeholder: e.target.value })} />
          </Row>
        )}
        <Row label="Açıklama / yardım metni" htmlFor={id('help')}>
          <input id={id('help')} className={inputClass} value={field.helpText} onChange={(e) => set({ helpText: e.target.value })} />
        </Row>
        <div className="flex items-center gap-2">
          <input id={id('req')} type="checkbox" className="size-4 accent-indigo-600" checked={field.required} onChange={(e) => set({ required: e.target.checked })} />
          <label htmlFor={id('req')} className="text-sm font-medium text-slate-700">Zorunlu alan</label>
        </div>

        {field.type === 'select' && (
          <Row label="Seçenekler" htmlFor={id('opts')} hint="Her satıra bir seçenek yazın.">
            <textarea id={id('opts')} rows={4} className={inputClass} value={field.options.join('\n')}
              onChange={(e) => set({ options: e.target.value.split('\n') })} />
          </Row>
        )}

        {RULES_BY_TYPE[field.type].length > 0 && (
          <fieldset className="space-y-3 rounded-lg border border-slate-200 p-3">
            <legend className="px-1 text-sm font-semibold text-slate-700">Doğrulama kuralları</legend>
            <div className="grid grid-cols-2 gap-3">
              {RULES_BY_TYPE[field.type].map((key) => (
                <Row key={key} label={RULE_LABELS[key]} htmlFor={id(key)}>
                  <input id={id(key)} className={inputClass} type={key.endsWith('Date') ? 'date' : 'number'}
                    min={key === 'minLength' || key === 'maxLength' ? 0 : undefined}
                    value={field.rules[key] ?? ''} onChange={(e) => setRule(key, e.target.value)} />
                </Row>
              ))}
            </div>
            {field.type === 'email' && <p className="text-xs text-slate-500">E-posta biçimi her zaman kontrol edilir.</p>}
          </fieldset>
        )}

        {problems.length > 0 && (
          <ul role="status" className="space-y-1 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            {problems.map((p) => <li key={p}>⚠ {p}</li>)}
          </ul>
        )}
      </div>
    </Panel>
  )
}
