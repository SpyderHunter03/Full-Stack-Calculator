import '../App.css'

export type GridPlacement = {
  column: number;
  row: number,
  columnSpan?: number,
  rowSpan?: number
}

type CalcNumberProps = {
  value: string
  placement: GridPlacement
  onClick: (value: string) => void,
  className?: string
}

function CalcNumber({ value, placement, onClick, className }: CalcNumberProps) {
  const { column, row, columnSpan = 1, rowSpan = 1 } = placement

  return (
    <button
      type="button"
      style={{
        gridColumn: `${column} / span ${columnSpan}`,
        gridRow: `${row} / span ${rowSpan}`,
      }}
      onClick={() => onClick(value)}
      className={className}
    >
      {value}
    </button>
  )
}

export default CalcNumber