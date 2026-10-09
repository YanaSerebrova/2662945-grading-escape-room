import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../constants/api';

type LoginResponseDto = {
  email: string;
  token: string;
};

type UserState = {
  token: string | null;
  email: string | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  token: localStorage.getItem('escape-room-token') || null,
  email: localStorage.getItem('escape-room-email') || null,
  isAuth: !!localStorage.getItem('escape-room-token'),
  isLoading: false,
  error: null,
};

export const loginAction = createAsyncThunk<
  LoginResponseDto,
  { email: string; password: string },
  { rejectValue: string }
>('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Неверный логин или пароль');
    }

    const data = (await response.json()) as LoginResponseDto;
    localStorage.setItem('escape-room-token', data.token);
    localStorage.setItem('escape-room-email', data.email);

    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка сети',
    );
  }
});

export const logoutAction = createAsyncThunk<
  void,
  void,
  { state: { user: UserState } }
>('user/logout', async (_, { getState }) => {
  const { token } = getState().user;
  if (token) {
    await fetch(`${API_URL}/logout`, {
      method: 'DELETE',
      headers: { 'X-Token': token },
    });
  }
  localStorage.removeItem('escape-room-token');
  localStorage.removeItem('escape-room-email');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginAction.fulfilled,
        (state, action: PayloadAction<LoginResponseDto>) => {
          state.isLoading = false;
          state.isAuth = true;
          state.token = action.payload.token;
          state.email = action.payload.email;
        },
      )
      .addCase(loginAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.isAuth = false;
        state.token = null;
        state.email = null;
      });
  },
});

export default userSlice.reducer;
