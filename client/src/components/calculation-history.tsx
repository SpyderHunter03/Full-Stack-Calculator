import { useEffect, useState } from 'react'
import { getAllCalculations, clearCalculation, type CalculationResult } from '../api/calculations'

type CalculationHistoryProps = {
  refreshKey: number
  onSelect: (value: number) => void
}

function CalculationHistory({ refreshKey, onSelect }: CalculationHistoryProps) {
  const [calculations, setCalculations] = useState<CalculationResult[]>([])

  useEffect(() => {
    let isCurrent = true

    const loadCalculations = async () => {
      let results: CalculationResult[] | undefined
      try {
        results = await getAllCalculations()
      } catch {
        return
      }

      if (!isCurrent || results === undefined) return

      setCalculations([...results].sort((left, right) =>
        Date.parse(right.createdAt) - Date.parse(left.createdAt),
      ))
    }

    void loadCalculations()

    return () => {
      isCurrent = false
    }
  }, [refreshKey])

  const deleteActivityItem = async (id: string) => {
    const cleared = await clearCalculation(id)
    if (cleared) {
      setCalculations((current) => current.filter((calculation) => calculation.id !== id))
    }
  }
  return (
    <section className="calculation-history" aria-labelledby="history-heading">
      <div className="history-heading">
        <p className="eyebrow">RECENT ACTIVITY</p>
        <h2 id="history-heading">Calculation history</h2>
      </div>
      {calculations.length === 0 ? (
        <p className="history-empty">No calculations yet.</p>
      ) : (
        <ol>
          {calculations.map((calculation) => (
            <li
              key={calculation.id}
              className="history-item"
              tabIndex={0}
              onClick={() => onSelect(calculation.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect(calculation.value)
              }}
            >
              <strong>{calculation.expression} = {calculation.value}</strong>
              <span className="history-meta">
                <time dateTime={calculation.createdAt}>
                  {new Date(calculation.createdAt).toLocaleString()}
                </time>
                <button
                  className="history-delete"
                  type="button"
                  aria-label={`Delete calculation ${calculation.value}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    void deleteActivityItem(calculation.id)
                  }}
                >
                  X
                </button>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default CalculationHistory