import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import type { FarmSite } from '../../types/site.ts'
import { Dashboard } from './Dashboard.tsx'

const sampleSites: FarmSite[] = [
  {
    id: 'NO-1',
    name: 'Hestøya',
    location: 'Nordland, Norway',
    cages: 12,
    status: 'operational',
    updatedOn: '2026-10-11',
    description: 'Sheltered site.',
  },
  {
    id: 'NO-2',
    name: 'Rørvik North',
    location: 'Trøndelag, Norway',
    cages: 8,
    status: 'attention',
    updatedOn: '2026-10-12',
    description: 'Overnight oxygen drop in two cages.',
  },
  {
    id: 'SC-1',
    name: 'Sound of Mull',
    location: 'Argyll, Scotland',
    cages: 1,
    status: 'maintenance',
    updatedOn: '2026-10-06',
  },
]

function mockViewport({ narrow, wide }: { narrow: boolean; wide: boolean }) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query === '(max-width: 719px)' ? narrow : query === '(min-width: 1080px)' ? wide : false,
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

describe('Dashboard', () => {
  it('shows summary counts calculated from the sites', () => {
    render(<Dashboard sites={sampleSites} />)

    expect(screen.getByRole('button', { name: /Total sites\s+3/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Operational\s+1/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Needs attention\s+1/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Maintenance\s+1/ })).toBeInTheDocument()
    expect(screen.getByText('Showing 3 of 3 sites')).toBeInTheDocument()
  })

  it('updates the summary when the site records change', () => {
    const { rerender } = render(<Dashboard sites={sampleSites} />)

    rerender(
      <Dashboard
        sites={[
          ...sampleSites,
          {
            id: 'NO-3',
            name: 'Finnmark Coast',
            location: 'Finnmark, Norway',
            cages: 4,
            status: 'operational',
            updatedOn: '2026-09-28',
          },
        ]}
      />,
    )

    expect(screen.getByRole('button', { name: /Total sites\s+4/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Operational\s+2/ })).toBeInTheDocument()
  })

  it('searches by site name and location together with status', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleSites} />)

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'norway')
    expect(screen.getByRole('button', { name: /Hestøya/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Rørvik North/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Sound of Mull/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Needs attention' }))

    expect(screen.getByRole('button', { name: /Rørvik North/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Hestøya/ })).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 3 sites')).toBeInTheDocument()
  })

  it('filters from a summary card and clears every filter', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleSites} />)

    await user.click(screen.getByRole('button', { name: /Needs attention/ }))
    expect(screen.getByRole('radio', { name: 'Needs attention' })).toBeChecked()
    expect(screen.queryByRole('button', { name: /Sound of Mull/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.getByRole('radio', { name: 'All statuses' })).toBeChecked()
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('')
    expect(screen.getByRole('button', { name: /Sound of Mull/ })).toBeInTheDocument()
  })

  it('shows an empty result state and ignores description text', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleSites} />)

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'oxygen')

    expect(screen.getByRole('heading', { name: 'No matching sites' })).toBeInTheDocument()
    expect(screen.getByText('No sites match "oxygen".')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'No sites available' })).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows a distinct state when no site records exist', () => {
    render(<Dashboard sites={[]} />)

    expect(screen.getByRole('button', { name: /Total sites\s+0/ })).toBeDisabled()
    expect(screen.getByRole('heading', { name: 'No sites available' })).toBeInTheDocument()
    expect(screen.getByText('There are no fish farming sites in the current records.')).toBeInTheDocument()
    expect(screen.queryByRole('searchbox', { name: 'Search' })).not.toBeInTheDocument()
  })

  it('shows the selected site, including a missing description', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleSites} />)

    const row = screen.getByRole('row', { name: /Sound of Mull/ })
    expect(within(row).getByText('Maintenance')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Sound of Mull/ }))

    const detail = screen.getByRole('region', { name: 'Sound of Mull' })
    expect(within(detail).getByText('SC-1')).toBeInTheDocument()
    expect(within(detail).getByText('Argyll, Scotland')).toBeInTheDocument()
    expect(within(detail).getByText('1 cage')).toBeInTheDocument()
    expect(within(detail).getByText('6 Oct 2026')).toBeInTheDocument()
    expect(within(detail).getByText('Maintenance')).toBeInTheDocument()
    expect(within(detail).getByText('No description has been recorded for this site.')).toBeInTheDocument()
  })

  it('keeps search and the selected site when returning from details', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleSites} />)

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'norway')
    await user.click(screen.getByRole('button', { name: /Rørvik North/ }))

    expect(screen.getByText('Overnight oxygen drop in two cages.')).toBeInTheDocument()
    expect(screen.getByText('12 Oct 2026')).toBeInTheDocument()
    expect(screen.queryByRole('searchbox', { name: 'Search' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back to sites' }))

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('norway')
    expect(screen.getByRole('button', { name: /Rørvik North/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('button', { name: /Sound of Mull/ })).not.toBeInTheDocument()
  })

  it('explains an unknown site selection', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleSites} initialSelectedId="NO-404" />)

    expect(screen.getByRole('heading', { name: 'Site not found' })).toBeInTheDocument()
    expect(screen.getByText('This selection does not match any site in the current records.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back to sites' }))

    expect(screen.queryByRole('heading', { name: 'Site not found' })).not.toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Farm sites' })).toBeInTheDocument()
  })

  it('uses cards on a narrow viewport and keeps the list beside details on a wide one', async () => {
    const user = userEvent.setup()
    mockViewport({ narrow: true, wide: false })
    const { unmount } = render(<Dashboard sites={sampleSites} />)

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Farm sites' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Hestøya/ }))
    expect(screen.getByRole('heading', { level: 2, name: 'Hestøya' })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Farm sites' })).not.toBeInTheDocument()
    unmount()

    mockViewport({ narrow: false, wide: true })
    render(<Dashboard sites={sampleSites} />)

    expect(screen.getByRole('table', { name: 'Farm sites' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Site details' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Hestøya/ }))

    expect(screen.getByRole('table', { name: 'Farm sites' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Hestøya' })).toBeInTheDocument()
    expect(screen.getByText('Sheltered site.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('heading', { level: 2, name: 'Hestøya' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Site details' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hestøya/ })).toHaveAttribute('aria-pressed', 'false')
  })
})
