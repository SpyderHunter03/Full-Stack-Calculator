import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  calculateExpression,
  clearAllCalculations,
  clearCalculation,
  getAllCalculations,
} from './calculations'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('calculation API', () => {
  it('returns NaN when the API returns a non-numeric value', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ value: 'invalid' }), { status: 200 }),
    )

    await expect(calculateExpression('2', '+', '3')).resolves.toBe('NaN')
  })

  it('throws when the calculation request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))

    await expect(calculateExpression('2', '+', '3')).rejects.toThrow('API could not complete')
  })

  it('does not request numbers that cannot be represented', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(calculateExpression('9'.repeat(400), '+', '1')).rejects.toThrow('too large')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns stored calculations from GET', async () => {
    const calculations = [{ id: 'one', value: 5, expression: '2 + 3', createdAt: '2026-09-02T12:00:00Z' }]
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(calculations), { status: 200 }),
    )

    await expect(getAllCalculations()).resolves.toEqual(calculations)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5162/api/calculations', { method: 'GET' })
  })

  it('returns whether deleting one calculation succeeded', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))

    await expect(clearCalculation('calculation-id')).resolves.toBe(true)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5162/api/calculations/calculation-id', { method: 'DELETE' })
  })

  it('returns false when deleting one calculation fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 404 }))

    await expect(clearCalculation('missing-id')).resolves.toBe(false)
  })

  it('returns whether clearing all calculations succeeded', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))

    await expect(clearAllCalculations()).resolves.toBe(true)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5162/api/calculations', { method: 'DELETE' })
  })

  it('returns false when clearing all calculations fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))

    await expect(clearAllCalculations()).resolves.toBe(false)
  })
})