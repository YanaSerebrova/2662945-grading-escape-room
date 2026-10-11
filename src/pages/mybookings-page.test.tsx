import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MyBookingsPage from './mybookings-page';
import { Reservation } from '../types/booking';

const mockDispatch = vi.fn();

const mockReservations: Reservation[] = [
  {
    id: 'res-1',
    date: 'today',
    time: '14:00',
    contactPerson: 'Иван',
    phone: '+7 999 999-99-99',
    withChildren: false,
    peopleCount: 3,
    address: 'Набережная реки Мойки, 5',
    locationLat: 59.9343,
    locationLng: 30.3351,
    questId: 'quest-1',
    questTitle: 'Маньяк',
    questLevel: 'medium',
    questPreviewImg: 'img.jpg',
  },
];

vi.mock('../store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn(() => ({
    reservations: mockReservations,
    isLoading: false,
    error: null,
  })),
}));

vi.mock('../store/reservations-slice', () => ({
  fetchReservationsAction: Object.assign(vi.fn(), {
    pending: { type: 'reservations/fetch/pending' },
    fulfilled: { type: 'reservations/fetch/fulfilled' },
    rejected: { type: 'reservations/fetch/rejected' },
  }),
  deleteReservationAction: vi.fn(() => ({
    type: 'reservations/delete/fulfilled',
  })),
}));

const renderMyBookings = () =>
  render(
    <MemoryRouter>
      <MyBookingsPage />
    </MemoryRouter>
  );

describe('MyBookingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch fetchReservationsAction on mount', async () => {
    renderMyBookings();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('should render reservation', () => {
    renderMyBookings();

    expect(screen.getByText('Маньяк')).toBeInTheDocument();
    expect(screen.getByText('Набережная реки Мойки, 5')).toBeInTheDocument();
    expect(screen.getByText(/3\s*чел/)).toBeInTheDocument();
    expect(screen.getByText('Средний')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Отменить' })
    ).toBeInTheDocument();
  });

  it('should dispatch deleteReservationAction when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderMyBookings();

    const cancelButton = screen.getAllByRole('button')[0];

    await user.click(cancelButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
