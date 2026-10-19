import { DashboardPage } from './pages/DashboardPage'
import { EditorPage } from './pages/EditorPage'
import { StorageBanner } from './components/StorageBanner'
import { useForms } from './hooks/useForms'
import { useHashRoute } from './hooks/useHashRoute'

export default function App() {
  const route = useHashRoute()
  const { forms, status, saveFailed, create, update, remove, duplicate, resetStorage, dismissStatus } = useForms()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-white focus:p-2">İçeriğe atla</a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <a href="#/" className="flex items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-indigo-600">
            <img src="/favicon.svg" alt="" className="size-8" />
            <span className="text-lg font-bold tracking-tight">Schema<span className="text-indigo-600">Forge</span></span>
          </a>
          <p className="text-xs text-slate-600">
            <span aria-hidden="true">🔒 </span>Formlarınız yalnızca bu tarayıcıda (LocalStorage) saklanır; sunucuya gönderilmez.
          </p>
        </div>
      </header>
      <StorageBanner status={status} saveFailed={saveFailed} onReset={resetStorage} onDismiss={dismissStatus} />
      <div id="main">
        {route.page === 'editor'
          ? <EditorPage key={route.formId} form={forms.find((f) => f.id === route.formId)} onChange={update} />
          : <DashboardPage forms={forms} onCreate={create} onDuplicate={duplicate} onDelete={remove} />}
      </div>
      <footer className="mx-auto max-w-7xl px-4 py-8 text-xs text-slate-500">
        SchemaForge · Tugay Sinan Ergün · Veriler başka bir cihaza veya tarayıcıya taşınmaz; yedek için JSON dışa aktarmayı kullanın.
      </footer>
    </div>
  )
}
