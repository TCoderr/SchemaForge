import type { LoadStatus } from '../lib/storage'
import { Button } from './ui'

/** Explains recovered / corrupt LocalStorage data instead of crashing or silently losing it. */
export function StorageBanner({ status, saveFailed, canReset, onReset, onDismiss }: {
  status: LoadStatus; saveFailed: boolean; canReset: boolean; onReset: () => void; onDismiss: () => void
}) {
  if (saveFailed) {
    return (
      <div role="alert" className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Değişiklikler tarayıcıya kaydedilemedi (depolama dolu veya engellenmiş olabilir). Sayfayı kapatmadan önce formunuzu JSON olarak dışa aktarın.
      </div>
    )
  }
  if (status.kind !== 'corrupt' && status.kind !== 'partial') return null
  return (
    <div role="alert" className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p>
          {status.kind === 'corrupt'
            ? 'Tarayıcıda kayıtlı form verisi okunamadı (bozuk veya beklenmeyen biçimde). Uygulama boş bir listeyle açıldı.'
            : `${status.skipped} form kaydı geçersiz olduğu için yüklenmedi; diğer formlar kurtarıldı.`}
          {status.kind === 'corrupt' && status.backupKey ? ` Ham veri "${status.backupKey}" anahtarına yedeklendi.` : ''}
        </p>
        <div className="flex gap-2">
          {/* Only while nothing new exists: once the user has created forms they already replaced the unreadable value,
              and "start clean" would delete their new work. */}
          {status.kind === 'corrupt' && canReset && <Button onClick={onReset}>Temiz başlat</Button>}
          <Button variant="ghost" onClick={onDismiss}>Kapat</Button>
        </div>
      </div>
    </div>
  )
}
