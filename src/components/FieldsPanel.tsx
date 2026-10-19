import { FIELD_TYPES, FIELD_TYPE_LABELS, type FieldType, type FormField } from '../interfaces/form'
import { Button, Panel } from './ui'

const ICON: Record<FieldType, string> = { text: 'Aa', textarea: '¶', number: '#', email: '@', select: '▾', checkbox: '☑', date: '📅' }

interface Props {
  fields: FormField[]
  selectedId: string | null
  onAdd: (type: FieldType) => void
  onSelect: (id: string) => void
  onMove: (index: number, delta: -1 | 1) => void
  onDelete: (field: FormField) => void
}

export function FieldsPanel({ fields, selectedId, onAdd, onSelect, onMove, onDelete }: Props) {
  return (
    <Panel title="Alanlar" id="fields-panel-title">
      <p className="mb-2 text-xs font-medium text-slate-500">Alan ekle</p>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Alan ekle">
        {FIELD_TYPES.map((type) => (
          <Button key={type} onClick={() => onAdd(type)} className="justify-start" aria-label={`${FIELD_TYPE_LABELS[type]} alanı ekle`}>
            <span aria-hidden="true" className="w-5 text-center text-indigo-600">{ICON[type]}</span>
            {FIELD_TYPE_LABELS[type]}
          </Button>
        ))}
      </div>

      <p className="mt-5 mb-2 text-xs font-medium text-slate-500">Form alanları ({fields.length})</p>
      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
          Henüz alan yok. Yukarıdan bir alan türü seçin.
        </p>
      ) : (
        <ol className="space-y-2" aria-label="Form alanları">
          {fields.map((f, i) => {
            const selected = f.id === selectedId
            const label = f.label || '(etiketsiz)' // same text as shown in the list; keeps the button names meaningful
            return (
              <li key={f.id} className={`flex items-center gap-1 rounded-lg border p-1 ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
                <button type="button" onClick={() => onSelect(f.id)} aria-current={selected ? 'true' : undefined}
                  className="min-w-0 flex-1 rounded-md px-2 py-1.5 text-left focus-visible:outline-2 focus-visible:outline-indigo-600">
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {i + 1}. {label}{f.required && <span className="text-red-600" aria-label="zorunlu"> *</span>}
                  </span>
                  <span className="block text-xs text-slate-500">{FIELD_TYPE_LABELS[f.type]} · {f.name}</span>
                </button>
                <Button variant="ghost" className="px-2" onClick={() => onMove(i, -1)} disabled={i === 0} aria-label={`${label} alanını yukarı taşı`}>↑</Button>
                <Button variant="ghost" className="px-2" onClick={() => onMove(i, 1)} disabled={i === fields.length - 1} aria-label={`${label} alanını aşağı taşı`}>↓</Button>
                <Button variant="ghost" className="px-2 text-red-700 hover:bg-red-50" onClick={() => onDelete(f)} aria-label={`${label} alanını sil`}>✕</Button>
              </li>
            )
          })}
        </ol>
      )}
    </Panel>
  )
}
