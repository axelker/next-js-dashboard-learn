import { render, screen, fireEvent } from '@testing-library/react'
import Search from '@/components/ui/search'

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('?query=test'),
  usePathname: () => '/test',
  useRouter: () => ({
    replace: jest.fn(),
  }),
}))

// Mock useDebouncedCallback
jest.mock('use-debounce', () => ({
  useDebouncedCallback: (fn: Function) => fn,
}))

describe('Search', () => {
  it('renders with placeholder', () => {
    render(<Search placeholder="Search invoices..." />)
    expect(screen.getByPlaceholderText('Search invoices...')).toBeDefined()
  })

  it('displays initial search value from URL params', () => {
    render(<Search placeholder="Search..." />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('test')
  })

  it('updates search value on input change', () => {
    render(<Search placeholder="Search..." />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new search' } })
    expect(input).toHaveValue('new search')
  })
}) 