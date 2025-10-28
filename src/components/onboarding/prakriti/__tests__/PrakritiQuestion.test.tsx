import { render, screen, fireEvent } from '@testing-library/react'
import { PrakritiQuestion } from '../PrakritiQuestion'

describe('PrakritiQuestion', () => {
  const mockProps = {
    id: 'test-question',
    label: 'Test question label',
    value: 0,
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders question label correctly', () => {
    render(<PrakritiQuestion {...mockProps} />)
    expect(screen.getByText('Test question label')).toBeInTheDocument()
  })

  it('displays current intensity label', () => {
    render(<PrakritiQuestion {...mockProps} value={3} />)
    expect(screen.getByText('Moderately')).toBeInTheDocument()
  })

  it('calls onChange when slider value changes', () => {
    render(<PrakritiQuestion {...mockProps} />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '4' } })
    expect(mockProps.onChange).toHaveBeenCalledWith(4)
  })

  it('shows intensity labels for different values', () => {
    const { rerender } = render(<PrakritiQuestion {...mockProps} value={0} />)
    expect(screen.getByText('Not at all')).toBeInTheDocument()

    rerender(<PrakritiQuestion {...mockProps} value={6} />)
    expect(screen.getByText('Completely')).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(<PrakritiQuestion {...mockProps} disabled={true} />)
    const slider = screen.getByRole('slider')
    expect(slider).toBeDisabled()
  })

  it('shows scale numbers 0-6', () => {
    render(<PrakritiQuestion {...mockProps} />)
    for (let i = 0; i <= 6; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument()
    }
  })
})
