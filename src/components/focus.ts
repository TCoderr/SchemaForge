import type { KeyboardEvent } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** onKeyDown for a modal dialog: Tab and Shift+Tab cycle inside it and never reach the page behind. */
export function trapTab(e: KeyboardEvent<HTMLElement>) {
  if (e.key !== 'Tab') return
  const items = [...e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)]
  if (items.length === 0) return
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  const inside = e.currentTarget.contains(active)
  if (e.shiftKey && (active === first || !inside)) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && (active === last || !inside)) { e.preventDefault(); first.focus() }
}

/** After a dialog closes: back to the element that opened it, or to the main content when that element is gone
 *  (e.g. the "Sil" button of a form that was just deleted), so focus is never dropped onto <body>. */
export function restoreFocus(opener: Element | null) {
  if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
  else document.getElementById('main')?.focus()
}
