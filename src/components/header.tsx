import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { logoutAction } from '../store/user-slice';
import { Logo } from './logo';
import { AppRoute } from '../api';

export function Header() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((state) => state.user.isAuth);

  const isActive = (path: string) => (location.pathname === path ? ' active' : '');

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <header className="header">
      <div className="container container--size-l">
        <Logo />
        <nav className="main-nav header__main-nav">
          <ul className="main-nav__list">
            <li className="main-nav__item">
              <Link className={`link${isActive('/')}`} to="/">Квесты</Link>
            </li>
            <li className="main-nav__item">
              <Link className={`link${isActive('/contacts')}`} to="/contacts">Контакты</Link>
            </li>
            {isAuth && (
              <li className="main-nav__item">
                <Link className={`link${isActive('/my-quests')}`} to="/my-quests">
                  Мои бронирования
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="header__side-nav">
          {isAuth ? (
            <button
              className="btn btn--accent header__side-item"
              onClick={handleLogout}
              type="button"
            >
              Выйти
            </button>
          ) : (
            <Link className="btn header__side-item header__login-btn" to={AppRoute.Auth}>
              Вход
            </Link>
          )}
          <a className="link header__side-item header__phone-link" href="tel:88003335599">
            8 (000) 111-11-11
          </a>
        </div>
      </div>
    </header>
  );
}

