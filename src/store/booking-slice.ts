import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchApi } from '../api';
import { BookingPlaceDto, BookingRequestDto, BookingResponseDto } from '../types/booking';

type BookingState = {
  places: BookingPlaceDto[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  submitError: string | null;
  lastBooking: BookingResponseDto | null;
};

const initialState: BookingState = {
  places: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  submitError: null,
  lastBooking: null,
};

export const fetchBookingPlacesAction = createAsyncThunk<BookingPlaceDto[], string>(
  'booking/fetchPlaces',
  async (questId, { rejectWithValue }) => {
    try {
      const data = await fetchApi<BookingPlaceDto[]>(`/quest/${questId}/booking`);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка сети');
    }
  }
);

export const createBookingAction = createAsyncThunk<
  BookingResponseDto,
  { questId: string; data: BookingRequestDto },
  { rejectValue: string }
>(
  'booking/create',
  async ({ questId, data }, { rejectWithValue }) => {
    try {
      const response = await fetchApi<BookingResponseDto>(
        `/quest/${questId}/booking`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          requireAuth: true,
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка бронирования'
      );
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookingState: (state) => {
      state.submitError = null;
      state.lastBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingPlacesAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookingPlacesAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.places = action.payload;
      })
      .addCase(fetchBookingPlacesAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBookingAction.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(createBookingAction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.lastBooking = action.payload;
      })
      .addCase(createBookingAction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload as string;
      });
  },
});

export const { clearBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
