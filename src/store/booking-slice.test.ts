import { describe, it, expect } from 'vitest';
import bookingReducer, {
  fetchBookingPlacesAction,
  createBookingAction,
  clearBookingState
} from './booking-slice';
import { BookingPlaceDto, BookingResponseDto } from '../types/booking';

const mockPlaces: BookingPlaceDto[] = [
  {
    id: 'place-1',
    location: { address: 'Невский проспект, 1', coords: [59.9343, 30.3351] },
    slots: { today: [{ time: '14:00', isAvailable: true }], tomorrow: [] },
  },
];

const mockBookingResponse: BookingResponseDto = {
  id: 'booking-1',
  date: 'today',
  time: '14:00',
  contactPerson: 'Иван',
  phone: '+7 (999) 999-99-99',
  withChildren: false,
  peopleCount: 3,
  placeId: 'place-1',
  location: { address: 'Невский проспект, 1', coords: [59.9343, 30.3351] },
  quest: {
    id: 'quest-1',
    title: 'Склеп',
    previewImg: '/img.jpg',
    previewImgWebp: '/img.webp',
    level: 'medium',
    type: 'horror',
    peopleMinMax: [2, 5],
  },
};

describe('Booking Slice', () => {
  it('should return initial state', () => {
    const state = bookingReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state.places).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.isSubmitting).toBe(false);
    expect(state.error).toBeNull();
    expect(state.submitError).toBeNull();
    expect(state.lastBooking).toBeNull();
  });

  it('should handle fetchBookingPlacesAction.pending', () => {
    const state = bookingReducer(
      { places: [], isLoading: false, isSubmitting: false, error: null, submitError: null, lastBooking: null },
      { type: fetchBookingPlacesAction.pending.type }
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchBookingPlacesAction.fulfilled', () => {
    const state = bookingReducer(
      { places: [], isLoading: true, isSubmitting: false, error: null, submitError: null, lastBooking: null },
      { type: fetchBookingPlacesAction.fulfilled.type, payload: mockPlaces }
    );
    expect(state.isLoading).toBe(false);
    expect(state.places).toEqual(mockPlaces);
  });

  it('should handle fetchBookingPlacesAction.rejected', () => {
    const state = bookingReducer(
      { places: [], isLoading: true, isSubmitting: false, error: null, submitError: null, lastBooking: null },
      { type: fetchBookingPlacesAction.rejected.type, payload: 'Network error' }
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should handle createBookingAction.pending', () => {
    const state = bookingReducer(
      { places: [], isLoading: false, isSubmitting: false, error: null, submitError: null, lastBooking: null },
      { type: createBookingAction.pending.type }
    );
    expect(state.isSubmitting).toBe(true);
    expect(state.submitError).toBeNull();
  });

  it('should handle createBookingAction.fulfilled', () => {
    const state = bookingReducer(
      { places: [], isLoading: false, isSubmitting: true, error: null, submitError: null, lastBooking: null },
      { type: createBookingAction.fulfilled.type, payload: mockBookingResponse }
    );
    expect(state.isSubmitting).toBe(false);
    expect(state.lastBooking).toEqual(mockBookingResponse);
  });

  it('should handle createBookingAction.rejected', () => {
    const state = bookingReducer(
      { places: [], isLoading: false, isSubmitting: true, error: null, submitError: null, lastBooking: null },
      { type: createBookingAction.rejected.type, payload: 'Booking failed' }
    );
    expect(state.isSubmitting).toBe(false);
    expect(state.submitError).toBe('Booking failed');
  });

  it('should handle clearBookingState', () => {
    const state = bookingReducer(
      { places: [], isLoading: false, isSubmitting: false, error: null, submitError: 'Error', lastBooking: mockBookingResponse },
      { type: clearBookingState.type }
    );
    expect(state.submitError).toBeNull();
    expect(state.lastBooking).toBeNull();
  });
});

