
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './logo';

type HeaderProps = {
  isAuth: boolean;
  onLogout: () => void;
};

export function Header({ isAuth, onLogout }: HeaderProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? ' active' : '';

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
              onClick={onLogout}
              type="button"
            >
              Выйти
            </button>
          ) : (
            <Link className="btn header__side-item header__login-btn" to="/auth">
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
