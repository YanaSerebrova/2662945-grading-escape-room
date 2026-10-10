import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchApi } from '../api';
import { Reservation } from '../types/booking';

type ReservationsState = {
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ReservationsState = {
  reservations: [],
  isLoading: false,
  error: null,
};

// Получение списка бронирований
export const fetchReservationsAction = createAsyncThunk<Reservation[], void>(
  'reservations/fetch',
  async (_, { rejectWithValue }) => {
    try {
      // requireAuth: true автоматически добавит заголовок X-Token
      const data = await fetchApi<Reservation[]>('/reservation', { requireAuth: true });
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка сети');
    }
  }
);

// Удаление бронирования
export const deleteReservationAction = createAsyncThunk<void, string>(
  'reservations/delete',
  async (reservationId, { rejectWithValue, dispatch }) => {
    try {
      await fetchApi<void>(`/reservation/${reservationId}`, {
        method: 'DELETE',
        requireAuth: true,
      });
      // После успешного удаления обновляем список
      dispatch(fetchReservationsAction());
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка удаления');
    }
  }
);

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservationsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReservationsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservationsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteReservationAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReservationAction.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteReservationAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default reservationsSlice.reducer;
