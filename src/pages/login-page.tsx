import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = (data: LoginFormValues) => {
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('userEmail', data.email);

    navigate(from, { replace: true });
  };

  return (
    <div className="page">
      <Header isAuth={false} onLogout={() => {
        // TODO: добавить logout
      }}
      />

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
                void handleSubmit(onSubmit)(e);
              }}
            >
              <h1 className="title title--size-s login-form__title">
                Вход
              </h1>

              <div className="login-form__inputs">
                <div className="custom-input login-form__input">
                  <label
                    className="custom-input__label"
                    htmlFor="email"
                  >
                    Email — mail
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Введите email"
                    {...register('email', {
                      required: 'Введите email',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Введите корректный email',
                      },
                    })}
                  />

                  {errors.email && (
                    <span className="form-error">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="custom-input login-form__input">
                  <label
                    className="custom-input__label"
                    htmlFor="password"
                  >
                    Пароль
                  </label>

                  <input
                    id="password"
                    type="password"
                    placeholder="Введите пароль"
                    {...register('password', {
                      required: 'Введите пароль',
                      minLength: {
                        value: 3,
                        message: 'Минимум 3 символа',
                      },
                      maxLength: {
                        value: 15,
                        message: 'Максимум 15 символов',
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-zА-Яа-я])(?=.*\d).+$/,
                        message:
                          'Пароль должен содержать букву и цифру',
                      },
                    })}
                  />

                  {errors.password && (
                    <span className="form-error">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>

              <button
                className="btn btn--accent btn--general login-form__submit"
                type="submit"
              >
                Войти
              </button>

              <label className="custom-checkbox login-form__checkbox">
                <input
                  type="checkbox"
                  {...register('agreement', {
                    required: 'Подтвердите согласие',
                  })}
                />

                <span className="custom-checkbox__icon">
                  <svg width="20" height="17" aria-hidden="true">
                    <use xlinkHref="#icon-tick" />
                  </svg>
                </span>

                <span className="custom-checkbox__label">
                  Я согласен с{' '}
                  <Link className="link link--underlined" to="/">
                    правилами сервиса
                  </Link>
                </span>
              </label>

              {errors.agreement && (
                <span className="form-error">
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
