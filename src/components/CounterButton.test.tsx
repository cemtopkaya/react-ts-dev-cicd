import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CounterButton } from './CounterButton'

describe('CounterButton', () => {
  it('renders with initial count', () => {
    render(<CounterButton />)
    expect(screen.getByRole('button')).toHaveTextContent('count is 0')
  })

  it('increments count on click', () => {
    render(<CounterButton />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 1')
    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 2')
  })
})