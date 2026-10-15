import { Dashboard } from './components/Dashboard/Dashboard.tsx'
import { EquipmentDashboard } from './components/Equipment/EquipmentDashboard.tsx'
import { AppShell } from './components/AppShell/AppShell.tsx'
import { activities } from './data/activities.ts'
import { sites } from './data/sites.ts'
import { equipment } from './equipment/equipment.ts'
import { formatSiteCount } from './lib/format.ts'
import { useWorkspace } from './hooks/useWorkspace.ts'

function formatItemCount(count: number): string {
  return `${count} ${count === 1 ? 'item' : 'items'}`
}

export default function App() {
  const { workspace, navigate } = useWorkspace()
  const metaLabel =
    workspace === 'equipment' ? formatItemCount(equipment.length) : formatSiteCount(sites.length)

  return (
    <AppShell workspace={workspace} metaLabel={metaLabel} onNavigate={navigate}>
      {workspace === 'equipment' ? (
        <EquipmentDashboard equipment={equipment} />
      ) : (
        <Dashboard sites={sites} activities={activities} />
      )}
    </AppShell>
  )
}
