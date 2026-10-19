import { useState } from 'react'
import type { FieldType, FormField, FormSchema } from '../interfaces/form'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ExportDialog } from '../components/ExportDialog'
import { FieldsPanel } from '../components/FieldsPanel'
import { PreviewPanel } from '../components/PreviewPanel'
import { PropertiesPanel } from '../components/PropertiesPanel'
import { Button, inputClass } from '../components/ui'
import { createField, moveItem } from '../lib/fields'

interface Props {
  form: FormSchema | undefined
  onChange: (id: string, change: (f: FormSchema) => FormSchema) => void
}

export function EditorPage({ form, onChange }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(form?.fields[0]?.id ?? null)
  const [pendingField, setPendingField] = useState<FormField | null>(null)
  const [exporting, setExporting] = useState(false)

  if (!form) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Form bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-600">Bu form silinmiş veya bu tarayıcıda hiç oluşturulmamış olabilir.</p>
        <a href="#/" className="mt-4 inline-block text-sm font-medium text-indigo-700 underline">Form listesine dön</a>
      </main>
    )
  }

  const change = (fn: (f: FormSchema) => FormSchema) => onChange(form.id, fn)
  const selected = form.fields.find((f) => f.id === selectedId) ?? null
  const addField = (type: FieldType) => {
    const field = createField(type, form.fields)
    change((f) => ({ ...f, fields: [...f.fields, field] }))
    setSelectedId(field.id)
  }
  const updateField = (field: FormField) => change((f) => ({ ...f, fields: f.fields.map((x) => (x.id === field.id ? field : x)) }))
  const moveField = (index: number, delta: -1 | 1) => change((f) => ({ ...f, fields: moveItem(f.fields, index, index + delta) }))
  const deleteField = (id: string) => {
    const rest = form.fields.filter((f) => f.id !== id)
    change((f) => ({ ...f, fields: f.fields.filter((x) => x.id !== id) }))
    if (selectedId === id) setSelectedId(rest[0]?.id ?? null)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <a href="#/" className="text-sm font-medium text-indigo-700 underline-offset-2 hover:underline sm:mt-2">← Formlar</a>
        <div className="w-full min-w-0 flex-1 space-y-2">
          <label htmlFor="form-title" className="sr-only">Form başlığı</label>
          <input id="form-title" className={`${inputClass} text-lg font-semibold`} value={form.title}
            onChange={(e) => change((f) => ({ ...f, title: e.target.value }))} placeholder="Form başlığı" />
          <label htmlFor="form-desc" className="sr-only">Form açıklaması</label>
          <textarea id="form-desc" rows={2} className={inputClass} value={form.description} placeholder="Form açıklaması (isteğe bağlı)"
            onChange={(e) => change((f) => ({ ...f, description: e.target.value }))} />
        </div>
        <Button variant="primary" onClick={() => setExporting(true)}>JSON'u dışa aktar</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)_minmax(0,1fr)]">
        <FieldsPanel fields={form.fields} selectedId={selectedId} onAdd={addField} onSelect={setSelectedId}
          onMove={moveField} onDelete={setPendingField} />
        <PropertiesPanel field={selected} fields={form.fields} onChange={updateField} />
        <PreviewPanel form={form} />
      </div>

      <ConfirmDialog open={pendingField !== null} title="Alan silinsin mi?"
        message={`"${pendingField?.label || '(etiketsiz)'}" alanı formdan kaldırılacak.`} confirmLabel="Alanı sil"
        onCancel={() => setPendingField(null)}
        onConfirm={() => { if (pendingField) deleteField(pendingField.id); setPendingField(null) }} />
      {exporting && <ExportDialog form={form} onClose={() => setExporting(false)} />}
    </main>
  )
}
