import { describe, expect, it } from 'vitest'
import { pathForWorkspace, workspaceFromPathname } from './workspace.ts'

describe('workspace', () => {
  it('reads the equipment path and defaults everything else to operations', () => {
    expect(workspaceFromPathname('/equipment')).toBe('equipment')
    expect(workspaceFromPathname('/equipment/')).toBe('equipment')
    expect(workspaceFromPathname('/')).toBe('operations')
    expect(workspaceFromPathname('/operations')).toBe('operations')
  })

  it('builds a path for each workspace', () => {
    expect(pathForWorkspace('operations')).toBe('/')
    expect(pathForWorkspace('equipment')).toBe('/equipment')
  })
})
