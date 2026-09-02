import '../App.css'
import type { GridPlacement } from './calc-number';
import CalcNumber from './calc-number';

type CalcOperatorProps = {
  operator: string;
  placement: GridPlacement;
  onClick: (operator: string) => void;
}

function CalcOperator({ operator, placement, onClick }: CalcOperatorProps) {

  return (
    <CalcNumber
      value={operator}
      placement={placement}
      onClick={onClick}
      className="operator"
    />
  )
}

export default CalcOperator