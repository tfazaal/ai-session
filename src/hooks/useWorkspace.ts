import { useEffect, useState } from 'react'
import {
  pathForWorkspace,
  workspaceFromPathname,
  type Workspace,
} from '../lib/workspace.ts'

export function useWorkspace() {
  const [workspace, setWorkspace] = useState<Workspace>(() =>
    workspaceFromPathname(window.location.pathname),
  )

  useEffect(() => {
    const onPopState = () => {
      setWorkspace(workspaceFromPathname(window.location.pathname))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function navigate(next: Workspace) {
    if (workspaceFromPathname(window.location.pathname) === next) return
    const path = `${pathForWorkspace(next)}${window.location.hash}`
    window.history.pushState(null, '', path)
    setWorkspace(next)
  }

  return { workspace, navigate }
}
