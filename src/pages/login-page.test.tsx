import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './login-page';

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../store/user-slice', () => ({
  loginAction: Object.assign(vi.fn(), {
    fulfilled: {
      match: vi.fn(() => true),
    },
  }),
}));

vi.mock('../store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn(() => ({
    isLoading: false,
    error: null,
    isAuth: false,
    token: null,
    email: null,
  })),
}));

const renderLoginPage = (from = '/protected') =>
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/login',
          state: { from: { pathname: from } },
        },
      ]}
    >
      <LoginPage />
    </MemoryRouter>
  );

const getEmailInput = () => screen.getByLabelText('E – mail');
const getPasswordInput = () => screen.getByLabelText('Пароль');
const getAgreementCheckbox = () => screen.getByRole('checkbox');
const getSubmitButton = () => screen.getByRole('button', { name: 'Войти' });

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockDispatch.mockResolvedValue({
      type: 'user/login/fulfilled',
      payload: {
        email: 'test@test.com',
        token: 'test-token',
      },
    });
  });

  it('should render login form elements', () => {
    renderLoginPage();

    expect(getEmailInput()).toBeInTheDocument();
    expect(getPasswordInput()).toBeInTheDocument();
    expect(getAgreementCheckbox()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it('should not dispatch loginAction for empty fields', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it('should not dispatch loginAction for invalid email', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(getEmailInput(), 'invalid-email');
    await user.type(getPasswordInput(), 'password1');
    await user.click(getAgreementCheckbox());
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it('should not dispatch loginAction for invalid password', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(getEmailInput(), 'test@test.com');
    await user.type(getPasswordInput(), 'ab');
    await user.click(getAgreementCheckbox());
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it('should not dispatch loginAction if agreement is not checked', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(getEmailInput(), 'test@test.com');
    await user.type(getPasswordInput(), 'password1');
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it('should dispatch loginAction and navigate on successful submit', async () => {
    renderLoginPage();

    const user = userEvent.setup();

    await user.type(getEmailInput(), 'test@test.com');
    await user.type(getPasswordInput(), 'password1');
    await user.click(getAgreementCheckbox());
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/protected', {
        replace: true,
      });
    });
  });
});

