import { Dashboard } from './components/Dashboard/Dashboard.tsx'
import { sites } from './data/sites.ts'

export default function App() {
  return <Dashboard sites={sites} />
}
