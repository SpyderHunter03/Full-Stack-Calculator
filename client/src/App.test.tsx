import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { calculateExpression } from './api/calculations'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Calculator shell', () => {
  it('shows the initial value and keypad', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Calculate clearly.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7' })).toHaveStyle({ gridColumn: '1 / span 1', gridRow: '1 / span 1' })
    expect(screen.getByRole('button', { name: '%' })).toHaveStyle({ gridColumn: '5 / span 1', gridRow: '1 / span 1' })
  })

  it('sends the display expression to the API and shows the result', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      const response = init?.method === 'GET'
        ? [{ id: 'new-result', value: 5, expression: '2 + 3', createdAt: '2026-09-01T12:00:00Z' }]
        : { value: 5 }
      return Promise.resolve(new Response(JSON.stringify(response), { status: 200 }))
    })
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))

    await waitFor(() => expect(screen.getByLabelText('Current value')).toHaveTextContent('5'))
    await screen.findByRole('listitem')
    expect(fetch).toHaveBeenCalledWith('http://localhost:5162/api/calculations', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ left: 2, right: 3, operator: '+' }),
    }))
  })

  it('shows an API error when the calculation request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('API could not complete')
  })

  it('shows the API message when dividing by zero', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(
      JSON.stringify({ error: 'Cannot divide by zero.' }),
      { status: 400 },
    ))
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '/' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot divide by zero.')
  })

  it('shows NaN when the API returns a non-numeric value', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      const response = init?.method === 'GET' ? [] : { value: 'not-a-number' }
      return Promise.resolve(new Response(JSON.stringify(response), { status: 200 }))
    })
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))

    expect(await screen.findByLabelText('Current value')).toHaveTextContent('NaN')
  })

  it('rejects numbers that are too large before sending them to the API', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    await expect(calculateExpression('9'.repeat(400), '+', '1')).rejects.toThrow('too large')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('appends an operator after displaying a calculated result', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      const response = init?.method === 'GET'
        ? []
        : { value: 5 }
      return Promise.resolve(new Response(JSON.stringify(response), { status: 200 }))
    })
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))

    await waitFor(() => expect(screen.getByLabelText('Current value')).toHaveTextContent('5'))
    fireEvent.click(screen.getByRole('button', { name: '*' }))

    expect(screen.getByLabelText('Current value')).toHaveTextContent('5*')
  })

  it('replaces a calculated result when a number is entered', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      const response = init?.method === 'GET'
        ? []
        : { value: 5 }
      return Promise.resolve(new Response(JSON.stringify(response), { status: 200 }))
    })
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))

    await waitFor(() => expect(screen.getByLabelText('Current value')).toHaveTextContent('5'))
    fireEvent.click(screen.getByRole('button', { name: '7' }))

    expect(screen.getByLabelText('Current value')).toHaveTextContent('7')
  })

  it('displays stored calculations newest first', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify([
      { id: 'older', value: 3, expression: '1 + 2', createdAt: '2026-09-01T10:00:00Z' },
      { id: 'newer', value: 5, expression: '2 + 3', createdAt: '2026-09-01T12:00:00Z' },
    ]), { status: 200 }))
    render(<App />)

    const entries = await screen.findAllByRole('listitem')
    expect(entries[0]).toHaveTextContent('5')
    expect(entries[1]).toHaveTextContent('3')
  })

  it('puts a selected stored result into the display', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify([
      { id: 'stored', value: 42, expression: '40 + 2', createdAt: '2026-09-01T12:00:00Z' },
    ]), { status: 200 }))
    render(<App />)

    fireEvent.click(await screen.findByText('40 + 2 = 42'))

    expect(screen.getByLabelText('Current value')).toHaveTextContent('42')
  })

  it('clears the display and all stored calculations with AC', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      const response = init?.method === 'DELETE' ? undefined : []
      return Promise.resolve(new Response(response === undefined ? null : JSON.stringify(response), { status: 200 }))
    })
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '7' }))
    fireEvent.click(screen.getByRole('button', { name: 'AC' }))

    await waitFor(() => expect(screen.getByLabelText('Current value')).toHaveTextContent('0'))
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5162/api/calculations', { method: 'DELETE' })
  })

  it('leaves the display unchanged when AC cannot clear the API history', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      const response = init?.method === 'DELETE' ? null : []
      return Promise.resolve(new Response(response === null ? null : JSON.stringify(response), {
        status: init?.method === 'DELETE' ? 500 : 200,
      }))
    })
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '7' }))
    fireEvent.click(screen.getByRole('button', { name: 'AC' }))

    await waitFor(() => expect(screen.getByLabelText('Current value')).toHaveTextContent('7'))
  })
})