import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders Vite and React logos with correct links', () => {
    render(<App />)
    const viteLogo = screen.getByAltText('Vite logo')
    const reactLogo = screen.getByAltText('React logo')
    expect(viteLogo).toBeInTheDocument()
    expect(reactLogo).toBeInTheDocument()
    expect(viteLogo.closest('a')).toHaveAttribute('href', 'https://vite.dev')
    expect(reactLogo.closest('a')).toHaveAttribute('href', 'https://react.dev')
  })

  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Vite \+ React/i })).toBeInTheDocument()
  })

  it('renders the CounterButton component', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /count is/i })).toBeInTheDocument()
  })

  it('renders the edit instruction', () => {
    render(<App />)
    expect(screen.getByText((content, element) => 
      element !== null && element.textContent === 'Edit src/App.tsx and save to test HMR'
    )).toBeInTheDocument()
  })

  it('renders the docs instruction', () => {
    render(<App />)
    expect(screen.getByText(/Click on the Vite and React logos to learn more/i)).toBeInTheDocument()
  })
})