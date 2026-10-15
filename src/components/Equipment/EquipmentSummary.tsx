import styles from './EquipmentSummary.module.css'

export function EquipmentSummary({
  total,
  requiring,
  underMaintenance,
}: {
  total: number
  requiring: number
  underMaintenance: number
}) {
  return (
    <section aria-labelledby="equipment-summary-heading">
      <h2 id="equipment-summary-heading" className="visuallyHidden">
        Equipment summary
      </h2>
      <div className={styles.grid}>
        <article className={styles.card}>
          <span className={styles.label}>Total equipment</span>
          <strong className={styles.value}>{total}</strong>
          <span className={styles.hint}>Items in the current records</span>
        </article>
        <article className={`${styles.card} ${styles.attention}`}>
          <span className={styles.label}>Requires maintenance</span>
          <strong className={styles.value}>{requiring}</strong>
          <span className={styles.hint}>Summary count</span>
        </article>
        <article className={`${styles.card} ${styles.maintenance}`}>
          <span className={styles.label}>Under maintenance</span>
          <strong className={styles.value}>{underMaintenance}</strong>
          <span className={styles.hint}>Work currently underway</span>
        </article>
      </div>
    </section>
  )
}
