import '../App.css'

type GridPlacement = { column: number; row: number }

function CalcOperator({ operator, placement, onClick }: { operator: string; placement: GridPlacement; onClick: (operator: string) => void }) {

  return (
    <button className="operator" type="button" style={{ gridColumn: placement.column, gridRow: placement.row }} onClick={() => onClick(operator)}>
      {operator}
    </button>
  )
}

export default CalcOperator