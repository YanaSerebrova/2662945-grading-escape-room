import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

type Booking = {
  id: number;
  questId: number;
  address: string;
  personCount: number;
};

type Quest = {
  id: number;
  title: string;
  image: string;
  level: string;
};

const quests: Quest[] = [
  {
    id: 1704,
    title: 'Маньяк',
    image: '/img/content/maniac/maniac-size-s.jpg',
    level: 'сложный',
  },
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const savedBookings = JSON.parse(
      localStorage.getItem('bookings') || '[]',
    ) as Booking[];

    setBookings(savedBookings);
  }, []);

  const handleCancel = (bookingId: number) => {
    const updatedBookings = bookings.filter(
      (booking) => booking.id !== bookingId,
    );

    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  return (
    <div className="page">
      <Header
        isAuth
        onLogout={() => {
          // сделать вывод
        }}
      />

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

          {bookings.length === 0 ? (
            <div className="empty-state">
              <p>У вас пока нет забронированных квестов.</p>

              <Link className="btn btn--accent" to="/">
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="cards-grid">
              {bookings.map((booking) => {
                const quest = quests.find(
                  (item) => item.id === booking.questId,
                );

                if (!quest) {
                  return null;
                }

                return (
                  <article
                    className="quest-card"
                    key={booking.id}
                  >
                    <div className="quest-card__img">
                      <img
                        src={quest.image}
                        width="344"
                        height="232"
                        alt={quest.title}
                      />
                    </div>

                    <div className="quest-card__content">
                      <div className="quest-card__info-wrapper">
                        <h2 className="quest-card__link">
                          {quest.title}
                        </h2>

                        <p className="quest-card__info">
                          {booking.address}
                        </p>
                      </div>

                      <ul className="tags quest-card__tags">
                        <li className="tags__item">
                          <svg
                            width="11"
                            height="14"
                            aria-hidden="true"
                          >
                            <use xlinkHref="#icon-person" />
                          </svg>
                          {booking.personCount}
                        </li>

                        <li className="tags__item">
                          <svg
                            width="14"
                            height="14"
                            aria-hidden="true"
                          >
                            <use xlinkHref="#icon-level" />
                          </svg>
                          {quest.level}
                        </li>
                      </ul>

                      <button
                        className="btn btn--accent btn--secondary quest-card__btn"
                        type="button"
                        onClick={() => handleCancel(booking.id)}
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
