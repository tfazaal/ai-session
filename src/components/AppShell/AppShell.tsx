import type { ReactNode } from 'react'
import type { Workspace } from '../../lib/workspace.ts'
import styles from './AppShell.module.css'

const NAV_ITEMS: { id: Workspace; label: string }[] = [
  { id: 'operations', label: 'Operations' },
  { id: 'equipment', label: 'Equipment' },
]

export function AppShell({
  workspace,
  metaLabel,
  onNavigate,
  children,
}: {
  workspace: Workspace
  metaLabel: string
  onNavigate: (workspace: Workspace) => void
  children: ReactNode
}) {
  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#content">
        Skip to content
      </a>
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <g fill="none" stroke="#ffffff" strokeWidth="1.5">
                <rect x="7" y="7" width="7" height="7" rx="1" />
                <rect x="18" y="7" width="7" height="7" rx="1" />
                <rect x="7" y="18" width="7" height="7" rx="1" />
                <rect x="18" y="18" width="7" height="7" rx="1" />
              </g>
            </svg>
            <div className={styles.brandText}>
              <p className={styles.product}>Harborline</p>
              <p className={styles.tagline}>Fish farm operations</p>
            </div>
          </div>
          <nav className={styles.nav} aria-label="Workspaces">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.navButton}
                aria-current={workspace === item.id ? 'page' : undefined}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <p className={styles.meta}>
            <span className={styles.environment}>Internal</span>
            <span className={styles.count}>{metaLabel}</span>
          </p>
        </div>
      </header>
      <main id="content" className={styles.main}>
        {children}
      </main>
    </div>
  )
}
