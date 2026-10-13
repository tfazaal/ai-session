import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App.tsx'

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('App workspace navigation', () => {
  it('opens equipment from the header and restores operations with the back button', async () => {
    const user = userEvent.setup()
    window.history.replaceState(null, '', '/?status=attention')
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Fish farm operations' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Operations' })).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('button', { name: 'Equipment' }))

    expect(window.location.pathname).toBe('/equipment')
    expect(screen.getByRole('heading', { name: 'Equipment dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Equipment' })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('heading', { name: 'Fish farm operations' })).not.toBeInTheDocument()

    act(() => {
      window.history.back()
    })

    await waitFor(() => {
      expect(window.location.pathname).toBe('/')
      expect(window.location.search).toBe('?status=attention')
      expect(screen.getByRole('heading', { name: 'Fish farm operations' })).toBeInTheDocument()
    })
  })
})