import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Calculator shell', () => {
  it('shows the initial value and keypad', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Calculate clearly.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7' })).toHaveStyle({ gridColumn: '1', gridRow: '1' })
    expect(screen.getByRole('button', { name: '%' })).toHaveStyle({ gridColumn: '5', gridRow: '1' })
  })

  it('sends the display expression to the API and shows the result', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ value: 5 }), { status: 200 }))
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))

    await waitFor(() => expect(screen.getByLabelText('Current value')).toHaveTextContent('5'))
    expect(fetch).toHaveBeenCalledWith('http://localhost:5162/api/calculations', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ left: 2, right: 3, operator: '+' }),
    }))
  })
})