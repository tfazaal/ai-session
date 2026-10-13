import styles from './EquipmentBadges.module.css'

export function OverdueFlag({ overdue }: { overdue: boolean }) {
  return (
    <span className={overdue ? styles.overdueYes : styles.overdueNo}>{overdue ? 'Yes' : 'No'}</span>
  )
}
