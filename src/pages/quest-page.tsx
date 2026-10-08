import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

type Quest = {
  id: number;
  title: string;
  theme: string;
  level: string;
  minPlayers: number;
  maxPlayers: number;
  description: string;
  image: string;
};

const quests: Quest[] = [
  {
    id: 1704,
    title: 'Маньяк',
    theme: 'Ужасы',
    level: 'сложный',
    minPlayers: 3,
    maxPlayers: 6,
    description:
      'Вы оказываетесь в старом доме, где много лет назад происходили загадочные события. Вам предстоит исследовать комнаты, искать подсказки и выбраться до того, как хозяин дома вернётся.',
    image: '/img/content/maniac/maniac-size-m.jpg',
  },
];

export default function QuestPage() {
  const { id } = useParams<{ id: string }>();

  const quest = quests.find((item) => item.id === Number(id));

  return (
    <div className="page">
      <Header isAuth={false} onLogout={() => undefined} />

      <main className="page-content decorated-page quest-page">
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
          {quest ? (
            <div className="quest-page__content">
              <h1 className="title title--size-l title--uppercase quest-page__title">
                {quest.title}
              </h1>

              <p className="subtitle quest-page__subtitle">
                {quest.theme}
              </p>

              <ul className="tags tags--size-l quest-page__tags">
                <li className="tags__item">
                  <svg width="11" height="14" aria-hidden="true">
                    <use xlinkHref="#icon-person" />
                  </svg>
                  {quest.minPlayers}–{quest.maxPlayers}
                </li>

                <li className="tags__item">
                  <svg width="14" height="14" aria-hidden="true">
                    <use xlinkHref="#icon-level" />
                  </svg>
                  {quest.level}
                </li>
              </ul>

              <p className="quest-page__description">
                {quest.description}
              </p>

              <Link
                className="btn btn--accent btn--cta quest-page__btn"
                to={`/quest/${quest.id}/booking`}
              >
                Забронировать
              </Link>
            </div>
          ) : (
            <div className="quest-page__content">
              <h1 className="title title--size-l">
                Квест не найден
              </h1>

              <Link className="btn btn--accent" to="/">
                Вернуться в каталог
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
