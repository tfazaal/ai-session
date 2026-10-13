import type { DashboardMetrics } from '../../lib/metrics.ts'
import type { StatusFilter } from '../../types/site.ts'
import styles from './SummaryCards.module.css'

const cards: {
  filter: StatusFilter
  label: string
  hint: string
  metric: keyof DashboardMetrics
  tone?: string
}[] = [
  {
    filter: 'all',
    label: 'Total sites',
    hint: 'In the current records',
    metric: 'total',
  },
  {
    filter: 'operational',
    label: 'Operational',
    hint: 'Running as planned',
    metric: 'operational',
    tone: styles.operational,
  },
  {
    filter: 'attention',
    label: 'Needs attention',
    hint: 'Review recommended',
    metric: 'attention',
    tone: styles.attention,
  },
  {
    filter: 'maintenance',
    label: 'Maintenance',
    hint: 'Work in progress',
    metric: 'maintenance',
    tone: styles.maintenance,
  },
]

export function SummaryCards({
  metrics,
  status,
  disabled,
  onStatusChange,
}: {
  metrics: DashboardMetrics
  status: StatusFilter
  disabled: boolean
  onStatusChange: (status: StatusFilter) => void
}) {
  return (
    <section aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="visuallyHidden">
        Summary
      </h2>
      <div className={styles.grid}>
        {cards.map((card) => {
          const pressed = status === card.filter
          return (
            <button
              key={card.filter}
              type="button"
              className={[styles.card, card.tone].filter(Boolean).join(' ')}
              aria-pressed={pressed}
              disabled={disabled}
              onClick={() => onStatusChange(card.filter)}
            >
              <span className={styles.label}>{card.label}</span>
              <span className={styles.value}>{metrics[card.metric]}</span>
              <span className={styles.hint}>{card.hint}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
