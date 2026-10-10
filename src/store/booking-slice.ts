import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchApi } from '../api';
import { BookingPlaceDto, BookingRequestDto, BookingResponseDto } from '../types/booking';

type BookingState = {
  places: BookingPlaceDto[];
  isLoading: boolean;
  error: string | null;
};

const initialState: BookingState = {
  places: [],
  isLoading: false,
  error: null,
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

export const createBookingAction = createAsyncThunk<BookingResponseDto, { questId: string; data: BookingRequestDto }>(
  'booking/create',
  async ({ questId, data }, { rejectWithValue }) => {
    try {
      const response = await fetchApi<BookingResponseDto>(`/quest/${questId}/booking`, {
        method: 'POST',
        body: JSON.stringify(data),
        requireAuth: true,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка бронирования');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
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
      });
  },
});

export default bookingSlice.reducer;
