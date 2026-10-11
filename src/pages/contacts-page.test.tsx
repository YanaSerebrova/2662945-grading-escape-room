import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import ContactsPage from './contacts-page';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="map-container" {...props}>
      {children}
    </div>
  ),
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
}));

const renderWithProviders = (ui: React.ReactElement) => (
  render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  )
);

describe('ContactsPage', () => {
  it('should render the page title "Контакты"', () => {
    renderWithProviders(<ContactsPage />);
    expect(screen.getByRole('heading', { name: /контакты/i })).toBeInTheDocument();
  });

  it('should render the correct address', () => {
    renderWithProviders(<ContactsPage />);
    expect(screen.getByText(/Санкт-Петербург/i)).toBeInTheDocument();
    expect(screen.getByText(/Карповки/i)).toBeInTheDocument();
  });

  it('should render the map container', () => {
    renderWithProviders(<ContactsPage />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });
});

