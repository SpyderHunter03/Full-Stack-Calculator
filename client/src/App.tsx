import { useState } from 'react'
import './App.css'
import { calculateExpression } from './api/calculations'
import CalcNumber from './components/calc-number'
import CalcOperator from './components/calc-operator'

function App() {
  const [display, setDisplay] = useState('0')

  const appendDigit = (digit: string) => {
    setDisplay((current) => current === '0' ? digit : current + digit)
  }

  const calculate = async () => {
    const expression = display.match(/^(-?\d+(?:\.\d+)?)([+\-*/%])(-?\d+(?:\.\d+)?)$/)
    if (!expression) return
  
    const [, left, operator, right] = expression
    const calculatedValue = await calculateExpression(left, operator, right)
    if (calculatedValue !== undefined) {
      setDisplay(calculatedValue)
    }
  }

  const clearDisplay = () => {
    setDisplay('0')
  }

  return (
    <main className="app-shell">
      <header>
        <p className="eyebrow">FULL STACK CALCULATOR</p>
        <h1>Calculate clearly.</h1>
        <p className="subtitle">A test-driven workspace for everyday arithmetic.</p>
      </header>
      <section className="calculator" aria-label="Calculator">
        <output className="display" aria-label="Current value">{display}</output>
        <div className="keypad">
          <CalcNumber   value="7"     placement={{ column: 1, row: 1 }} onClick={appendDigit} />
          <CalcNumber   value="8"     placement={{ column: 2, row: 1 }} onClick={appendDigit} />
          <CalcNumber   value="9"     placement={{ column: 3, row: 1 }} onClick={appendDigit} />
          <CalcOperator operator="/"  placement={{ column: 4, row: 1 }} onClick={appendDigit} />
          <CalcOperator operator="%"  placement={{ column: 5, row: 1 }} onClick={appendDigit} />
          <CalcNumber   value="4"     placement={{ column: 1, row: 2 }} onClick={appendDigit} />
          <CalcNumber   value="5"     placement={{ column: 2, row: 2 }} onClick={appendDigit} />
          <CalcNumber   value="6"     placement={{ column: 3, row: 2 }} onClick={appendDigit} />
          <CalcOperator operator="*"  placement={{ column: 4, row: 2 }} onClick={appendDigit} />
          <CalcOperator operator="C"  placement={{ column: 5, row: 2 }} onClick={clearDisplay} />
          <CalcNumber   value="1"     placement={{ column: 1, row: 3 }} onClick={appendDigit} />
          <CalcNumber   value="2"     placement={{ column: 2, row: 3 }} onClick={appendDigit} />
          <CalcNumber   value="3"     placement={{ column: 3, row: 3 }} onClick={appendDigit} />
          <CalcOperator operator="-"  placement={{ column: 4, row: 3 }} onClick={appendDigit} />
          <CalcOperator operator="AC"  placement={{ column: 5, row: 3 }} onClick={appendDigit} />
          <CalcNumber   value="0"     placement={{ column: 1, row: 4 }} onClick={appendDigit} />
          <CalcNumber   value="."     placement={{ column: 2, row: 4 }} onClick={appendDigit} />
          <CalcOperator operator="+"  placement={{ column: 3, row: 4 }} onClick={appendDigit} />
          <CalcOperator operator="="  placement={{ column: 4, row: 4, columnSpan: 2 }} onClick={calculate} />
        </div>
      </section>
    </main>
  )
}

export default App
