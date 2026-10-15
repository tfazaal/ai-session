export const WORKSPACES = ['operations', 'equipment'] as const

export type Workspace = (typeof WORKSPACES)[number]

export function workspaceFromPathname(pathname: string): Workspace {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return normalized === '/equipment' ? 'equipment' : 'operations'
}

export function pathForWorkspace(workspace: Workspace): string {
  return workspace === 'equipment' ? '/equipment' : '/'
}
