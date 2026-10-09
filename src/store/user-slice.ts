import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EmailKey, fetchApi, TokenKey } from '../api';

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
  token: localStorage.getItem(TokenKey) || null,
  email: localStorage.getItem(EmailKey) || null,
  isAuth: !!localStorage.getItem(TokenKey),
  isLoading: false,
  error: null,
};

export const loginAction = createAsyncThunk<
  LoginResponseDto,
  { email: string; password: string },
  { rejectValue: string }
>(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await fetchApi<LoginResponseDto>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem(TokenKey, data.token);
      localStorage.setItem(EmailKey, data.email);
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неверный логин или пароль',
      );
    }
  },
);

export const logoutAction = createAsyncThunk<
  void,
  void,
  { state: { user: UserState } }
>('user/logout', async (_, { getState }) => {
  const { token } = getState().user;
  if (token) {
    await fetchApi<void>('/logout', {
      method: 'DELETE',
      requireAuth: true,
    });
  }
  localStorage.removeItem(TokenKey);
  localStorage.removeItem(EmailKey);
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
