import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('shows the project introduction', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Invitation' })).toBeInTheDocument()
    expect(screen.getByText('Create and share beautiful birthday invitations')).toBeInTheDocument()
  })
})
