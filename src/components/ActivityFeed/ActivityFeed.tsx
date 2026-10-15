import type { SiteActivity } from '../../types/activity.ts'
import { ACTIVITY_TYPE_LABELS } from '../../lib/activityLabels.ts'
import { formatDateTime } from '../../lib/format.ts'
import styles from './ActivityFeed.module.css'

export function ActivityFeed({
  activities,
  onSelectSite,
}: {
  activities: readonly SiteActivity[]
  onSelectSite: (siteId: string) => void
}) {
  return (
    <section className={styles.section} aria-labelledby="activity-feed-heading">
      <h2 id="activity-feed-heading" className={styles.title}>
        Recent activity
      </h2>
      <p className={styles.subtitle}>Fictional events for demonstration — not from live systems.</p>
      <ul className={styles.list}>
        {activities.map((event) => (
          <li key={event.id} className={styles.item}>
            <button
              type="button"
              className={styles.button}
              onClick={() => onSelectSite(event.siteId)}
            >
              <span className={styles.meta}>
                <span className={styles.type}>{ACTIVITY_TYPE_LABELS[event.type]}</span>
                <span className={styles.siteId}>{event.siteId}</span>
                <time dateTime={event.timestamp}>{formatDateTime(event.timestamp)}</time>
              </span>
              <p className={styles.description}>{event.description}</p>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
