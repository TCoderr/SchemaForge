import { Component, type ReactNode } from 'react'

/** Last line of defence against a blank white page: shows a recovery screen instead. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <main role="alert" className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Beklenmeyen bir hata oluştu</h1>
        <p className="mt-2 text-sm text-slate-600">Kayıtlı formlarınız tarayıcıda duruyor. Sayfayı yenileyerek tekrar deneyebilirsiniz.</p>
        <button type="button" className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white" onClick={() => window.location.reload()}>
          Sayfayı yenile
        </button>
      </main>
    )
  }
}
