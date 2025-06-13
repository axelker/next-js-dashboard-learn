import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormInput } from '@/components/ui/form-input'

describe('FormInput', () => {
  it('renders with label and input', () => {
    render(<FormInput label="Email" id="email" />)
    expect(screen.getByLabelText('Email')).toBeDefined()
    expect(screen.getByRole('textbox')).toBeDefined()
  })

  it('displays error messages', () => {
    const errors = ['Invalid email', 'Email is required']
    render(<FormInput label="Email" id="email" error={errors} />)
    
    errors.forEach(error => {
      expect(screen.getByText(error)).toBeDefined()
    })
  })

  it('handles user input', async () => {
    render(<FormInput label="Email" id="email" />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test@example.com')
    expect(input).toHaveValue('test@example.com')
  })

  it('renders with icon', () => {
    const icon = <span data-testid="test-icon">🔍</span>
    render(<FormInput label="Search" id="search" icon={icon} />)
    expect(screen.getByTestId('test-icon')).toBeDefined()
  })

  it('applies custom className', () => {
    render(<FormInput label="Email" id="email" className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })
}) 