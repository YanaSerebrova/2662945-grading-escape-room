import { describe, it, expect, beforeEach } from 'vitest';
import userReducer, { loginAction, logoutAction } from './user-slice';

describe('User Slice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial state structure', () => {
    const state = userReducer(undefined, { type: 'UNKNOWN_ACTION' } as const);
    expect(state).toHaveProperty('token');
    expect(state).toHaveProperty('email');
    expect(state).toHaveProperty('isAuth');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should preserve state with token when action is unknown', () => {
    const state = userReducer(
      { token: 'test-token', email: 'test@test.ru', isAuth: true, isLoading: false, error: null },
      { type: 'UNKNOWN_ACTION' }
    );
    expect(state.token).toBe('test-token');
    expect(state.email).toBe('test@test.ru');
    expect(state.isAuth).toBe(true);
  });

  it('should handle loginAction.pending', () => {
    const state = userReducer(
      { token: null, email: null, isAuth: false, isLoading: false, error: null },
      { type: loginAction.pending.type }
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loginAction.fulfilled', () => {
    const payload = { email: 'user@mail.ru', token: 'abc-123' };
    const state = userReducer(
      { token: null, email: null, isAuth: false, isLoading: true, error: null },
      { type: loginAction.fulfilled.type, payload }
    );
    expect(state.isLoading).toBe(false);
    expect(state.isAuth).toBe(true);
    expect(state.token).toBe('abc-123');
    expect(state.email).toBe('user@mail.ru');
    expect(state.error).toBeNull();
  });

  it('should handle loginAction.rejected', () => {
    const state = userReducer(
      { token: null, email: null, isAuth: false, isLoading: true, error: null },
      { type: loginAction.rejected.type, payload: 'Неверный логин или пароль' }
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Неверный логин или пароль');
    expect(state.isAuth).toBe(false);
  });

  it('should handle logoutAction.fulfilled', () => {
    const state = userReducer(
      { token: 'abc-123', email: 'user@mail.ru', isAuth: true, isLoading: false, error: null },
      { type: logoutAction.fulfilled.type }
    );
    expect(state.isAuth).toBe(false);
    expect(state.token).toBeNull();
    expect(state.email).toBeNull();
  });
});
