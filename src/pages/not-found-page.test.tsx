import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import NotFoundPage from './not-found-page';

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );

describe('NotFoundPage', () => {
  it('should render 404 heading', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
  });

  it('should render "Страница не найдена" text', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText(/Страница не найдена/i)).toBeInTheDocument();
  });

  it('should render a link to the main page', () => {
    renderWithProviders(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /Вернуться на главную/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});


