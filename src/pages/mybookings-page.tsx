import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchReservationsAction, deleteReservationAction } from '../store/reservations-slice';

const LEVEL_MAP: Record<string, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

export default function MyBookingsPage() {
  const dispatch = useAppDispatch();
  const { reservations, isLoading, error } = useAppSelector((state) => state.reservations);

  useEffect(() => {
    dispatch(fetchReservationsAction());
  }, [dispatch]);

  const handleCancel = (reservationId: string) => {
    dispatch(deleteReservationAction(reservationId));
  };

  if (isLoading && reservations.length === 0) {
    return (
      <div className="page">
        <Header />
        <main className="page-content">
          <div className="container">
            <p>Загрузка бронирований...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Header />
        <main className="page-content">
          <div className="container">
            <p className="form-error" style={{ color: 'red' }}>Ошибка: {error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header />
      <main className="page-content decorated-page">
        <div className="decorated-page__decor" aria-hidden="true">
          <picture>
            <source
              type="image/webp"
              srcSet="/img/content/maniac/maniac-bg-size-m.webp"
            />
            <img
              src="/img/content/maniac/maniac-bg-size-m.jpg"
              width="1366"
              height="1959"
              alt=""
            />
          </picture>
        </div>
        <div className="container">
          <div className="page-content__title-wrapper">
            <h1 className="title title--size-m page-content__title">
              Мои бронирования
            </h1>
          </div>

          {reservations.length === 0 ? (
            <div className="empty-state">
              <p>У вас пока нет забронированных квестов.</p>
              <Link className="btn btn--accent" to="/">
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="cards-grid">
              {reservations.map((reservation) => {
                const displayLevel = LEVEL_MAP[reservation.questLevel] || reservation.questLevel;

                return (
                  <article
                    className="quest-card"
                    key={reservation.id}
                  >
                    <div className="quest-card__img">
                      <img
                        src={reservation.questPreviewImg}
                        width="344"
                        height="232"
                        alt={reservation.questTitle}
                      />
                    </div>

                    <div className="quest-card__content">
                      <div className="quest-card__info-wrapper">
                        <h2 className="quest-card__link">
                          {reservation.questTitle}
                        </h2>
                        <p className="quest-card__info">
                          {reservation.address}
                        </p>
                      </div>

                      <ul className="tags quest-card__tags">
                        <li className="tags__item">
                          <svg width="11" height="14" aria-hidden="true">
                            <use xlinkHref="#icon-person" />
                          </svg>
                          {reservation.peopleCount} чел
                        </li>
                        <li className="tags__item">
                          <svg width="14" height="14" aria-hidden="true">
                            <use xlinkHref="#icon-level" />
                          </svg>
                          {displayLevel}
                        </li>
                      </ul>

                      <button
                        className="btn btn--accent btn--secondary quest-card__btn"
                        type="button"
                        onClick={() => handleCancel(reservation.id)}
                      >
                        Отменить
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
