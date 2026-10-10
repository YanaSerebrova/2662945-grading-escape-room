import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL, AUTH_TOKEN_KEY, AUTH_EMAIL_KEY } from '../constants/api';

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
  token: localStorage.getItem(AUTH_TOKEN_KEY) || null,
  email: localStorage.getItem(AUTH_EMAIL_KEY) || null,
  isAuth: !!localStorage.getItem(AUTH_TOKEN_KEY),
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
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_EMAIL_KEY, data.email);

    return data;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Ошибка сети');
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
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
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
      .addCase(loginAction.fulfilled, (state, action: PayloadAction<{ email: string; token: string }>) => {
        state.isLoading = false;
        state.isAuth = true;
        state.token = action.payload.token;
        state.email = action.payload.email;
      })
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
