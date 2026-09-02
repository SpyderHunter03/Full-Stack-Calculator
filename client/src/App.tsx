import { useState } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')

  const appendDigit = (digit: string) => {
    setDisplay((current) => current === '0' ? digit : current + digit)
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
          {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((key) => (
            <button key={key} type="button" className={['/', '*', '-', '+', '='].includes(key) ? 'operator' : ''} onClick={() => appendDigit(key)}>
              {key}
            </button>
          ))}
        </div>
      </section>
      <p className="status" role="status"><span /> API scaffold connected to an in-memory store</p>
    </main>
  )
}

export default App
