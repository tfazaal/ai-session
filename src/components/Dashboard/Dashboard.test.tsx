import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { emptyActivities, sampleFarmSites } from '../../test/fixtures/sites.ts'
import { Dashboard } from './Dashboard.tsx'

vi.mock('../SiteMap/SiteMap.tsx', () => ({
  SiteMap: ({
    sites,
    onSelect,
  }: {
    sites: { id: string; name: string }[]
    selectedId: string | null
    onSelect: (id: string) => void
  }) => (
    <div data-testid="site-map" aria-label="Farm site map">
      {sites.map((site) => (
        <button key={site.id} type="button" onClick={() => onSelect(site.id)}>
          Map: {site.name}
        </button>
      ))}
    </div>
  ),
}))

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
  window.history.replaceState(null, '', '/')
})

describe('Dashboard', () => {
  it('shows summary counts calculated from the sites', () => {
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    expect(screen.getByRole('button', { name: /Total sites\s+3/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Operational\s+1/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Needs attention\s+1/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Maintenance\s+1/ })).toBeInTheDocument()
    expect(screen.getByText('Showing 3 of 3 sites')).toBeInTheDocument()
  })

  it('updates the summary when the site records change', () => {
    const { rerender } = render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    rerender(
      <Dashboard
        sites={[
          ...sampleFarmSites,
          {
            ...sampleFarmSites[0],
            id: 'NO-3',
            name: 'Finnmark Coast',
            region: 'Finnmark',
            totalCages: 4,
            activeCages: 4,
            status: 'operational',
            updatedAt: '2026-09-28T11:00:00Z',
          },
        ]}
        activities={emptyActivities}
      />,
    )

    expect(screen.getByRole('button', { name: /Total sites\s+4/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Operational\s+2/ })).toBeInTheDocument()
  })

  it('searches by site name and location together with status', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'norway')
    expect(screen.getByRole('button', { name: /Hestøya\s+NO-1/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Rørvik North\s+NO-2/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Sound of Mull\s+SC-1/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Needs attention' }))

    expect(screen.getByRole('button', { name: /Rørvik North\s+NO-2/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Hestøya\s+NO-1/ })).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 3 sites')).toBeInTheDocument()
  })

  it('filters from a summary card and clears every filter', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    await user.click(screen.getByRole('button', { name: /Needs attention/ }))
    expect(screen.getByRole('radio', { name: 'Needs attention' })).toBeChecked()
    expect(screen.queryByRole('button', { name: /Sound of Mull\s+SC-1/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear all filters' }))

    expect(screen.getByRole('radio', { name: 'All statuses' })).toBeChecked()
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('')
    expect(screen.getByRole('button', { name: /Sound of Mull\s+SC-1/ })).toBeInTheDocument()
  })

  it('shows an empty result state and ignores description text', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'oxygen')

    expect(screen.getByRole('heading', { name: 'No matching sites' })).toBeInTheDocument()
    expect(screen.getByText('No sites match "oxygen".')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'No sites available' })).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows a distinct state when no site records exist', () => {
    render(<Dashboard sites={[]} activities={emptyActivities} />)

    expect(screen.getByRole('button', { name: /Total sites\s+0/ })).toBeDisabled()
    expect(screen.getByRole('heading', { name: 'No sites available' })).toBeInTheDocument()
    expect(screen.getByText('There are no fish farming sites in the current records.')).toBeInTheDocument()
    expect(screen.queryByRole('searchbox', { name: 'Search' })).not.toBeInTheDocument()
  })

  it('shows the selected site, including a missing description', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    const row = screen.getByRole('row', { name: /Sound of Mull/ })
    expect(within(row).getByText('Maintenance')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Sound of Mull\s+SC-1/ }))

    const detail = screen.getByRole('region', { name: 'Sound of Mull' })
    expect(within(detail).getByText('SC-1')).toBeInTheDocument()
    expect(within(detail).getByText(/Argyll, Scotland/)).toBeInTheDocument()
    expect(within(detail).getByText('1 cage (0 active)')).toBeInTheDocument()
    expect(within(detail).getByText(/6 Oct 2026/)).toBeInTheDocument()
    expect(within(detail).getByText('Maintenance')).toBeInTheDocument()
    expect(within(detail).getByText('No description has been recorded for this site.')).toBeInTheDocument()
  })

  it('selects a site from the map mock', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    await user.click(screen.getByRole('button', { name: 'Map: Hestøya' }))

    expect(window.location.search).toBe('?site=NO-1')
    expect(screen.getByRole('heading', { level: 2, name: 'Hestøya' })).toBeInTheDocument()
  })

  it('keeps search and the selected site when returning from details', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'norway')
    await user.click(screen.getByRole('button', { name: /Rørvik North\s+NO-2/ }))

    expect(screen.getByText('Overnight oxygen drop in two cages.')).toBeInTheDocument()
    expect(screen.getByText(/12 Oct 2026/)).toBeInTheDocument()
    expect(screen.queryByRole('searchbox', { name: 'Search' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back to sites' }))

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('norway')
    expect(screen.getByRole('button', { name: /Rørvik North\s+NO-2/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('button', { name: /Sound of Mull\s+SC-1/ })).not.toBeInTheDocument()
  })

  it('explains an unknown site selection', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} initialSelectedId="NO-404" />)

    expect(screen.getByRole('heading', { name: 'Site not found' })).toBeInTheDocument()
    expect(screen.getByText('This selection does not match any site in the current records.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back to sites' }))

    expect(screen.queryByRole('heading', { name: 'Site not found' })).not.toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Farm sites' })).toBeInTheDocument()
  })

  it('uses cards on a narrow viewport and keeps the list beside details on a wide one', async () => {
    const user = userEvent.setup()
    mockViewport({ narrow: true, wide: false })
    const { unmount } = render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Farm sites' })).toBeInTheDocument()

    await user.click(document.getElementById('site-trigger-NO-1')!)
    expect(screen.getByRole('heading', { level: 2, name: 'Hestøya' })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Farm sites' })).not.toBeInTheDocument()
    unmount()
    window.history.replaceState(null, '', '/')

    mockViewport({ narrow: false, wide: true })
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    expect(screen.getByRole('table', { name: 'Farm sites' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Site details' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Hestøya\s+NO-1/ }))

    expect(screen.getByRole('table', { name: 'Farm sites' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Hestøya' })).toBeInTheDocument()
    expect(screen.getByText('Sheltered site.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('heading', { level: 2, name: 'Hestøya' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Site details' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hestøya\s+NO-1/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('loads filters from the query string on first render', () => {
    window.history.replaceState(null, '', '/?status=attention&q=norway')

    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('norway')
    expect(screen.getByRole('radio', { name: 'Needs attention' })).toBeChecked()
    expect(screen.getByRole('button', { name: /Rørvik North\s+NO-2/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Sound of Mull\s+SC-1/ })).not.toBeInTheDocument()
  })

  it('writes status changes to the URL for sharing and browser history', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    await user.click(screen.getByRole('button', { name: /Needs attention/ }))
    expect(window.location.search).toBe('?status=attention')

    await user.click(screen.getByRole('button', { name: /Operational/ }))
    expect(window.location.search).toBe('?status=operational')

    await user.click(screen.getByRole('button', { name: /Operational/ }))
    expect(window.location.search).toBe('')
  })

  it('restores filters when the user navigates with the browser back button', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    await user.click(screen.getByRole('button', { name: /Maintenance/ }))
    expect(window.location.search).toBe('?status=maintenance')

    act(() => {
      window.history.back()
    })

    await waitFor(() => {
      expect(window.location.search).toBe('')
      expect(screen.getByText(/Showing 3 of 3 sites/)).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: /Hestøya\s+NO-1/ })).toBeInTheDocument()
  })

  it('includes the selected site in the URL', async () => {
    const user = userEvent.setup()
    render(<Dashboard sites={sampleFarmSites} activities={emptyActivities} />)

    await user.click(screen.getByRole('button', { name: /Sound of Mull\s+SC-1/ }))

    expect(window.location.search).toBe('?site=SC-1')
  })
})
