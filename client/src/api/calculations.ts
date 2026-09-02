import { API_URL } from '../vite.consts'

export async function calculateExpression(left: string, operator: string, right: string): Promise<string | undefined> {
  const response = await fetch(`${API_URL}/api/calculations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ left: Number(left), right: Number(right), operator }),
  })

  if (!response.ok) return

  const result: { value: number } = await response.json()
  return String(result.value)
}