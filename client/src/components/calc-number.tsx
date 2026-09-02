import '../App.css'

export type GridPlacement = { column: number; row: number }

type CalcNumberProps = {
  value: string
  placement: GridPlacement
  onClick: (value: string) => void,
  className?: string
}

function CalcNumber({ value, placement, onClick, className }: CalcNumberProps) {

  return (
    <button type="button" style={{ gridColumn: placement.column, gridRow: placement.row }} onClick={() => onClick(value)} className={className}>
      {value}
    </button>
  )
}

export default CalcNumber