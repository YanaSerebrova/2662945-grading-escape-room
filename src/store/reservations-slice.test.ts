import { describe, it, expect } from 'vitest';
import reservationsReducer, {
  fetchReservationsAction,
  deleteReservationAction,
} from './reservations-slice';
import { Reservation } from '../types/booking';

const mockReservations: Reservation[] = [
  {
    id: 'res-1',
    date: 'today',
    time: '14:00',
    contactPerson: 'Иван',
    phone: '+7 (999) 999-99-99',
    withChildren: false,
    peopleCount: 3,
    address: 'Невский проспект, 1',
    locationLat: 59.9343,
    locationLng: 30.3351,
    questId: 'quest-1',
    questTitle: 'Склеп',
    questLevel: 'medium',
    questPreviewImg: '/img.jpg',
  },
];

describe('Reservations Slice', () => {
  it('should return initial state', () => {
    const state = reservationsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state.reservations).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchReservationsAction.pending', () => {
    const state = reservationsReducer(
      { reservations: [], isLoading: false, error: null },
      { type: fetchReservationsAction.pending.type }
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchReservationsAction.fulfilled', () => {
    const state = reservationsReducer(
      { reservations: [], isLoading: true, error: null },
      { type: fetchReservationsAction.fulfilled.type, payload: mockReservations }
    );
    expect(state.isLoading).toBe(false);
    expect(state.reservations).toEqual(mockReservations);
    expect(state.reservations).toHaveLength(1);
    expect(state.reservations[0].questTitle).toBe('Склеп');
  });

  it('should handle fetchReservationsAction.rejected', () => {
    const state = reservationsReducer(
      { reservations: [], isLoading: true, error: null },
      { type: fetchReservationsAction.rejected.type, payload: 'Network error' }
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should handle deleteReservationAction.pending', () => {
    const state = reservationsReducer(
      { reservations: mockReservations, isLoading: false, error: null },
      { type: deleteReservationAction.pending.type }
    );
    expect(state.isLoading).toBe(true);
  });

  it('should handle deleteReservationAction.fulfilled', () => {
    const state = reservationsReducer(
      { reservations: mockReservations, isLoading: true, error: null },
      { type: deleteReservationAction.fulfilled.type }
    );
    expect(state.isLoading).toBe(false);
  });

  it('should handle deleteReservationAction.rejected', () => {
    const state = reservationsReducer(
      { reservations: mockReservations, isLoading: true, error: null },
      { type: deleteReservationAction.rejected.type, payload: 'Delete failed' }
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Delete failed');
  });
});

