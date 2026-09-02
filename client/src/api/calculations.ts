import { API_URL } from '../vite.consts'

export type CalculationResult = {
  id: string
  value: number
  expression: string
  createdAt: string
}

export async function calculateExpression(left: string, operator: string, right: string): Promise<string | undefined> {
  if (!Number.isFinite(Number(left)) || !Number.isFinite(Number(right))) {
    throw new Error('The numbers are too large to calculate.')
  }

  const response = await fetch(`${API_URL}/api/calculations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ left: Number(left), right: Number(right), operator }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => undefined) as { error?: string } | undefined
    throw new Error(error?.error ?? 'The API could not complete the calculation.')
  }

  const result: CalculationResult = await response.json()
  if (typeof result.value !== 'number' || !Number.isFinite(result.value)) {
    return 'NaN'
  }

  return String(result.value)
}

export async function getAllCalculations(): Promise<CalculationResult[] | undefined> {
  const response = await fetch(`${API_URL}/api/calculations`, {
    method: 'GET',
  })

  if (!response.ok) return

  return await response.json()
}

export async function clearCalculation(id: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/api/calculations/${id}`, {
    method: 'DELETE',
  })

  return response.ok
}

export async function clearAllCalculations(): Promise<boolean> {
  const response = await fetch(`${API_URL}/api/calculations`, {
    method: 'DELETE',
  })

  return response.ok
}