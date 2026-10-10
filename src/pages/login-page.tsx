import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginAction } from '../store/user-slice';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

type LoginFormValues = {
  email: string;
  password: string;
  agreement: boolean;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const handleFormSubmit = async (data: LoginFormValues) => {
    const resultAction = await dispatch(
      loginAction({ email: data.email, password: data.password })
    );

    if (loginAction.fulfilled.match(resultAction)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="page">
      <Header />
      <main className="decorated-page login">
        <div className="decorated-page__decor" aria-hidden="true">
          <picture>
            <source
              type="image/webp"
              srcSet="/img/content/maniac/maniac-size-m.webp"
            />
            <img
              src="/img/content/maniac/maniac-size-m.jpg"
              width="1366"
              height="768"
              alt=""
            />
          </picture>
        </div>
        <div className="container container--size-l">
          <div className="login-form">
            <form
              className="login-form__inner-wrapper"
              onSubmit={(e) => {
                void handleSubmit(handleFormSubmit)(e);
              }}
            >
              <h1 className="title title--size-s login-form__title">Вход</h1>
              {error && (
                <p className="form-error" style={{ color: '#ff1553', marginBottom: '15px', textAlign: 'center' }}>
                  {error}
                </p>
              )}
              <div className="login-form__inputs">
                <div className="custom-input login-form__input">
                  <label className="custom-input__label" htmlFor="email">
                    E&nbsp;&ndash;&nbsp;mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Адрес электронной почты"
                    {...register('email', {
                      required: 'Введите email',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Введите корректный email',
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="form-error">{errors.email.message}</span>
                  )}
                </div>
                <div className="custom-input login-form__input">
                  <label className="custom-input__label" htmlFor="password">
                    Пароль
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Пароль"
                    {...register('password', {
                      required: 'Введите пароль',
                      minLength: { value: 3, message: 'Минимум 3 символа' },
                      maxLength: { value: 15, message: 'Максимум 15 символов' },
                      pattern: {
                        value: /^(?=.*[A-Za-zА-Яа-я])(?=.*\d).+$/,
                        message: 'Пароль должен содержать букву и цифру',
                      },
                    })}
                  />
                  {errors.password && (
                    <span className="form-error">{errors.password.message}</span>
                  )}
                </div>
              </div>
              <button
                className="btn btn--accent btn--general login-form__submit"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
              <label className="custom-checkbox login-form__checkbox">
                <input
                  type="checkbox"
                  id="id-order-agreement"
                  {...register('agreement', { required: 'Подтвердите согласие' })}
                />
                <span className="custom-checkbox__icon">
                  <svg width="20" height="17" aria-hidden="true">
                    <use xlinkHref="#icon-tick" />
                  </svg>
                </span>
                <span className="custom-checkbox__label">
                  Я согласен с{' '}
                  <Link className="link link--active-silver link--underlined" to="/">
                    правилами обработки персональных данных
                  </Link>{' '}
                  и пользовательским соглашением
                </span>
              </label>
              {errors.agreement && (
                <span className="form-error" style={{ display: 'block', marginTop: '5px' }}>
                  {errors.agreement.message}
                </span>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

