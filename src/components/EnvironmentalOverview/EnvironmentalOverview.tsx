import type { EnvironmentalOverview as EnvironmentalOverviewMetrics } from '../../lib/environmentalMetrics.ts'
import { STALE_READING_HOURS } from '../../lib/environmentalMetrics.ts'
import styles from './EnvironmentalOverview.module.css'

function formatTemp(value: number | null): string {
  if (value == null) return '—'
  return `${value.toFixed(1)} °C`
}

function formatOxygen(value: number | null): string {
  if (value == null) return '—'
  return `${value.toFixed(1)} mg/L`
}

export function EnvironmentalOverview({
  metrics,
}: {
  metrics: EnvironmentalOverviewMetrics
}) {
  const noReadings = metrics.sitesWithReadings === 0

  return (
    <section className={styles.section} aria-labelledby="env-overview-heading">
      <h2 id="env-overview-heading" className={styles.title}>
        Environmental overview (simulated)
      </h2>
      <p className={styles.subtitle}>
        Averages and alerts are calculated from fictional prototype readings, not live sensors.
      </p>
      <dl className={styles.grid}>
        <div className={styles.metric}>
          <dt>Avg. water temperature</dt>
          <dd className={noReadings ? styles.missing : undefined}>
            {formatTemp(metrics.averageWaterTemperatureC)}
          </dd>
        </div>
        <div className={styles.metric}>
          <dt>Avg. oxygen</dt>
          <dd className={noReadings ? styles.missing : undefined}>
            {formatOxygen(metrics.averageOxygenMgL)}
          </dd>
        </div>
        <div className={`${styles.metric} ${metrics.overdueInspections > 0 ? styles.warn : ''}`}>
          <dt>Overdue inspections</dt>
          <dd>{metrics.overdueInspections}</dd>
        </div>
        <div className={`${styles.metric} ${metrics.staleReadings > 0 ? styles.warn : ''}`}>
          <dt>Stale readings (&gt;{STALE_READING_HOURS}h)</dt>
          <dd>{metrics.staleReadings}</dd>
        </div>
      </dl>
    </section>
  )
}
