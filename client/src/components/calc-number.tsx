import '../App.css'

type GridPlacement = { column: number; row: number }

function CalcNumber({ value, placement, onClick }: { value: string; placement: GridPlacement; onClick: (value: string) => void }) {

  return (
    <button type="button" style={{ gridColumn: placement.column, gridRow: placement.row }} onClick={() => onClick(value)}>
      {value}
    </button>
  )
}

export default CalcNumber