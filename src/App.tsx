import { Dashboard } from './components/Dashboard/Dashboard.tsx'
import { activities } from './data/activities.ts'
import { sites } from './data/sites.ts'

export default function App() {
  return <Dashboard sites={sites} activities={activities} />
}
