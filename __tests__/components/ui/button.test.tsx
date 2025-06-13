import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeDefined()
    expect(button).toHaveClass('bg-blue-500')
  })

  it('renders with different variants', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button', { name: "Delete" })
    expect(button).toHaveClass('bg-destructive')
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    const button = screen.getByRole('button', { name: "Click me"})
    await userEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button', { name: "Disabled"})
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:bg-gray-300')
  })
}) 