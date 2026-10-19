import { useEffect, useState } from 'react'

export type Route = { page: 'dashboard' } | { page: 'editor'; formId: string }

export function parseHash(hash: string): Route {
  const m = /^#\/forms\/([\w-]+)$/.exec(hash)
  return m ? { page: 'editor', formId: m[1] } : { page: 'dashboard' }
}

export function navigate(route: Route) {
  window.location.hash = route.page === 'editor' ? `/forms/${route.formId}` : '/'
}

/** Minimal hash router: works on static hosting (Netlify) without server rewrites and survives reloads. */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
