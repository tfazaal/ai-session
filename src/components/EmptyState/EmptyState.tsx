import styles from './EmptyState.module.css'

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className={styles.empty}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {action ? (
        <button type="button" className={styles.action} onClick={action.onClick}>
          {action.label}
        </button>
      ) : null}
    </div>
  )
}
