import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page before authentication', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
});
