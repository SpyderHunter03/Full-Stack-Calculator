import { useState } from 'react'
import './App.css'
import { calculateExpression, clearAllCalculations } from './api/calculations'
import CalcNumber from './components/calc-number'
import CalcOperator from './components/calc-operator'
import CalculationHistory from './components/calculation-history'

function App() {
  const [display, setDisplay] = useState('0')
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)
  const [justCalculated, setJustCalculated] = useState(false)

  const appendDigit = (digit: string) => {
    if (justCalculated) {
      setDisplay(digit)
      setJustCalculated(false)
      return
    }
    setDisplay((current) => current === '0' ? digit : current + digit)
  }

  const appendOperator = (operator: string) => {
    if (justCalculated) {
      setJustCalculated(false)
    }
    setDisplay((current) => current === '0' ? operator : current + operator)
  }

  const calculate = async () => {
    //Match: #.# (+ \ - * %) #.#
    const expression = display.match(/^(-?\d+(?:\.\d+)?)([+\-*/%])(-?\d+(?:\.\d+)?)$/)
    if (!expression) return
  
    const [, left, operator, right] = expression
    const calculatedValue = await calculateExpression(left, operator, right)
    if (calculatedValue !== undefined) {
      setDisplay(calculatedValue)
      setHistoryRefreshKey((current) => current + 1)
      setJustCalculated(true)
    }
  }

  const clearDisplay = () => {
    setDisplay('0')
  }

  const clearHistory = async () => {
    const cleared = await clearAllCalculations()
    if (cleared) {
      setDisplay('0')
      setHistoryRefreshKey((current) => current + 1)
    }
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
          <CalcOperator operator="/"  placement={{ column: 4, row: 1 }} onClick={appendOperator} />
          <CalcOperator operator="%"  placement={{ column: 5, row: 1 }} onClick={appendOperator} />
          <CalcNumber   value="4"     placement={{ column: 1, row: 2 }} onClick={appendDigit} />
          <CalcNumber   value="5"     placement={{ column: 2, row: 2 }} onClick={appendDigit} />
          <CalcNumber   value="6"     placement={{ column: 3, row: 2 }} onClick={appendDigit} />
          <CalcOperator operator="*"  placement={{ column: 4, row: 2 }} onClick={appendOperator} />
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
      <CalculationHistory refreshKey={historyRefreshKey} onSelect={(value: any) => setDisplay((disp) => disp + String(value))} />
    </main>
  )
}

export default App
