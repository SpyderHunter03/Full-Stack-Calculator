import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Calculator shell', () => {
  it('shows the initial value and keypad', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Calculate clearly.' })).toBeInTheDocument()
    expect(screen.getByText(/API scaffold connected/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
  })
})