import { useState } from 'react'
import type { FormSchema } from '../interfaces/form'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Button } from '../components/ui'
import { navigate } from '../hooks/useHashRoute'

const fmt = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })

interface Props {
  forms: FormSchema[]
  onCreate: () => string
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function DashboardPage({ forms, onCreate, onDuplicate, onDelete }: Props) {
  const [pending, setPending] = useState<FormSchema | null>(null)
  const create = () => navigate({ page: 'editor', formId: onCreate() })

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Formlarım</h1>
          <p className="mt-1 text-sm text-slate-600">Form oluşturun, alanlarını düzenleyin, canlı önizleyin ve JSON olarak dışa aktarın.</p>
        </div>
        <Button variant="primary" onClick={create}>+ Yeni form</Button>
      </div>

      {forms.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-medium text-slate-800">Henüz form yok</p>
          <p className="mt-1 text-sm text-slate-600">İlk formunuzu oluşturarak başlayın.</p>
          <Button variant="primary" className="mt-4" onClick={create}>İlk formu oluştur</Button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Form listesi">
          {forms.map((f) => {
            const title = f.title || 'Adsız form' // also used in the button names, so an empty title never gives " formunu sil"
            return (
            <li key={f.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="truncate text-base font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-600">{f.description || 'Açıklama yok'}</p>
              <dl className="mt-3 flex gap-4 text-xs text-slate-500">
                <div><dt className="sr-only">Alan sayısı</dt><dd>{f.fields.length} alan</dd></div>
                <div><dt className="sr-only">Son güncelleme</dt><dd>{fmt.format(new Date(f.updatedAt))}</dd></div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="primary" onClick={() => navigate({ page: 'editor', formId: f.id })} aria-label={`${title} formunu düzenle`}>Düzenle</Button>
                <Button onClick={() => onDuplicate(f.id)} aria-label={`${title} formunu kopyala`}>Kopyala</Button>
                <Button variant="ghost" className="text-red-700 hover:bg-red-50" onClick={() => setPending(f)} aria-label={`${title} formunu sil`}>Sil</Button>
              </div>
            </li>
            )
          })}
        </ul>
      )}

      <ConfirmDialog open={pending !== null} title="Form silinsin mi?"
        message={`"${pending?.title || 'Adsız form'}" formu ve ${pending?.fields.length ?? 0} alanı kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        confirmLabel="Formu sil" onCancel={() => setPending(null)}
        onConfirm={() => { if (pending) onDelete(pending.id); setPending(null) }} />
    </main>
  )
}
