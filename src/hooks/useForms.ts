import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormSchema } from '../interfaces/form'
import { createForm, duplicateForm } from '../lib/fields'
import { loadForms, saveForms, STORAGE_KEY, type LoadStatus } from '../lib/storage'

/** All forms + LocalStorage persistence. Nothing is written until the user changes something,
 *  so a corrupt value is never silently overwritten before it has been backed up and reported. */
export function useForms() {
  const [initial] = useState(() => loadForms())
  const [forms, setForms] = useState<FormSchema[]>(initial.forms)
  const [status, setStatus] = useState<LoadStatus>(initial.status)
  const [saveFailed, setSaveFailed] = useState(false)
  const dirty = useRef(false)

  useEffect(() => {
    if (!dirty.current) return
    setSaveFailed(!saveForms(forms))
  }, [forms])

  // Another tab saved: adopt its list, otherwise this tab's next save would overwrite that tab's forms with a stale copy.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.newValue === null) return
      const next = loadForms()
      if (next.status.kind !== 'ok') return
      dirty.current = false
      setForms(next.forms)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const mutate = useCallback((fn: (prev: FormSchema[]) => FormSchema[]) => {
    dirty.current = true
    setForms(fn)
  }, [])

  const create = useCallback(() => {
    const form = createForm()
    mutate((prev) => [form, ...prev])
    return form.id
  }, [mutate])

  const update = useCallback((id: string, change: (f: FormSchema) => FormSchema) => {
    mutate((prev) => prev.map((f) => (f.id === id ? { ...change(f), updatedAt: new Date().toISOString() } : f)))
  }, [mutate])

  const remove = useCallback((id: string) => mutate((prev) => prev.filter((f) => f.id !== id)), [mutate])

  const duplicate = useCallback((id: string) => {
    mutate((prev) => {
      const src = prev.find((f) => f.id === id)
      if (!src) return prev
      const copy = duplicateForm(src, prev.map((f) => f.title))
      const at = prev.indexOf(src)
      return [...prev.slice(0, at + 1), copy, ...prev.slice(at + 1)]
    })
  }, [mutate])

  /** Start over after corrupt data: the broken value stays in its backup key. */
  const resetStorage = useCallback(() => {
    try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* storage blocked */ }
    dirty.current = false
    setForms([])
    setStatus({ kind: 'empty' })
  }, [])

  const dismissStatus = useCallback(() => setStatus({ kind: 'ok' }), [])

  return { forms, status, saveFailed, create, update, remove, duplicate, resetStorage, dismissStatus }
}
