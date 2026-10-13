import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import type { Equipment } from '../../equipment/types.ts'
import { EquipmentDashboard } from './EquipmentDashboard.tsx'

const records: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Primary Feed Blower',
    assetId: 'FF-AST-1001',
    farmSite: 'Skjervøy North',
    equipmentType: 'Feed System',
    status: 'Operational',
    maintenancePriority: 'High',
    lastMaintenanceDate: '2024-02-10',
  },
  {
    id: 'eq-2',
    name: 'Oxygen Diffuser Array',
    assetId: 'FF-AST-1002',
    farmSite: 'Skjervøy North',
    equipmentType: 'Oxygenation',
    status: 'Requires Maintenance',
    maintenancePriority: 'Critical',
    lastMaintenanceDate: '2023-11-05',
  },
  {
    id: 'eq-3',
    name: 'Pen 4 Anchor Winch',
    assetId: 'FF-AST-2033',
    farmSite: 'Lofoten West',
    equipmentType: 'Net Pen',
    status: 'Under Maintenance',
    maintenancePriority: 'Medium',
    lastMaintenanceDate: '2025-08-20',
  },
]

function mockViewport(narrow: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query === '(max-width: 719px)' ? narrow : false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  })
}

afterEach(() => {
  cleanup()
  Reflect.deleteProperty(window, 'matchMedia')
})

describe('EquipmentDashboard', () => {
  it('shows summary counts and filters by status', async () => {
    const user = userEvent.setup()
    render(<EquipmentDashboard equipment={records} />)

    expect(screen.getByText('Total equipment').parentElement).toHaveTextContent('3')
    expect(screen.getByText('Requires maintenance').parentElement).toHaveTextContent('1')
    expect(screen.getByText('Under maintenance').parentElement).toHaveTextContent('1')
    expect(screen.getByText('1 asset requires maintenance')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Status filter'), 'Requires Maintenance')

    expect(screen.getByRole('cell', { name: 'Oxygen Diffuser Array' })).toBeInTheDocument()
    expect(screen.queryByRole('cell', { name: 'Primary Feed Blower' })).not.toBeInTheDocument()
  })

  it('expands and closes equipment details', async () => {
    const user = userEvent.setup()
    render(<EquipmentDashboard equipment={records} />)

    const row = screen.getByRole('row', { name: /Primary Feed Blower/ })
    await user.click(within(row).getByRole('button', { name: 'Details' }))

    const detail = screen.getByRole('region', { name: 'Primary Feed Blower details' })
    expect(within(detail).getByText('FF-AST-1001')).toBeInTheDocument()
    expect(within(detail).getByText('10 Feb 2024')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('heading', { level: 3, name: 'Primary Feed Blower' })).not.toBeInTheDocument()
  })

  it('shows an empty state when the filter matches nothing', async () => {
    const user = userEvent.setup()
    render(<EquipmentDashboard equipment={[records[0]]} />)

    await user.selectOptions(screen.getByLabelText('Status filter'), 'Under Maintenance')

    expect(screen.getByRole('heading', { name: 'No matching equipment' })).toBeInTheDocument()
  })

  it('uses cards on a narrow viewport', async () => {
    const user = userEvent.setup()
    mockViewport(true)
    render(<EquipmentDashboard equipment={records} />)

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Equipment' })).toBeInTheDocument()

    const card = screen.getByText('Pen 4 Anchor Winch').closest('article')
    expect(card).toBeTruthy()
    await user.click(within(card as HTMLElement).getByRole('button', { name: 'Details' }))
    expect(within(card as HTMLElement).getByRole('button', { name: 'Hide details' })).toBeInTheDocument()
  })
})
