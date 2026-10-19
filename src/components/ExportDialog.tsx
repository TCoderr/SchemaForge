import { useEffect, useRef, useState } from 'react'
import type { FormSchema } from '../interfaces/form'
import { downloadJson, exportFileName, exportJson } from '../lib/exportSchema'
import { formProblems } from '../lib/validation'
import { restoreFocus, trapTab } from './focus'
import { Button } from './ui'

export function ExportDialog({ form, onClose }: { form: FormSchema; onClose: () => void }) {
  const json = exportJson(form)
  const problems = formProblems(form)
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); restoreFocus(opener) }
  }, [onClose])

  const copy = async () => {
    try { await navigator.clipboard.writeText(json); setCopied('ok') } catch { setCopied('fail') }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="export-title" onClick={(e) => e.stopPropagation()} onKeyDown={trapTab}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between gap-2 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="export-title" className="text-lg font-semibold text-slate-900">JSON dışa aktarma</h2>
            <p className="text-xs text-slate-500">{exportFileName(form)} · {form.fields.length} alan · biçim schemaforge.form v1</p>
          </div>
          <Button ref={closeRef} variant="ghost" onClick={onClose} aria-label="Kapat">✕</Button>
        </header>
        {problems.length > 0 && (
          <div role="status" className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900">
            <p className="font-medium">Dışa aktarmadan önce kontrol edin:</p>
            <ul className="mt-1 list-inside list-disc">{problems.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        )}
        <pre aria-label="Dışa aktarılan JSON" tabIndex={0}
          className="flex-1 overflow-auto bg-slate-950 p-5 font-mono text-xs leading-relaxed text-slate-100">{json}</pre>
        <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <span aria-live="polite" className="mr-auto text-sm text-slate-600">
            {copied === 'ok' ? 'Panoya kopyalandı.' : copied === 'fail' ? 'Kopyalanamadı; metni elle seçebilirsiniz.' : ''}
          </span>
          <Button onClick={copy}>Panoya kopyala</Button>
          <Button variant="primary" onClick={() => downloadJson(form)}>JSON indir</Button>
        </footer>
      </div>
    </div>
  )
}
