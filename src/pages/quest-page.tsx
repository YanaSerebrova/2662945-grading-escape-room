import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchQuestByIdAction } from '../store/quests-slice';

export default function QuestPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { quests, isLoading, error } = useAppSelector((state) => state.quests);

  const quest = quests.find((q) => q.id === id);

  useEffect(() => {
    if (id && !quest) {
      dispatch(fetchQuestByIdAction(id));
    }
  }, [id, quest, dispatch]);

  if (isLoading && !quest) {
    return (
      <div className="page">
        <Header />
        <main className="page-content">
          <div className="container">
            <p>Загрузка квеста...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !quest) {
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

  if (!quest) {
    return (
      <div className="page">
        <Header />
        <main className="page-content">
          <div className="container">
            <p>Квест не найден</p>
            <Link className="btn btn--accent" to="/">
              Вернуться в каталог
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header />
      <main className="page-content decorated-page quest-page">
        <div className="decorated-page__decor" aria-hidden="true">
          <picture>
            <source
              type="image/webp"
              srcSet={quest.coverImgWebp}
            />
            <img
              src={quest.coverImg}
              width="1366"
              height="768"
              alt=""
            />
          </picture>
        </div>

        <div className="container container--size-l">
          <div className="quest-page__content">
            <h1 className="title title--size-l title--uppercase quest-page__title">
              {quest.title}
            </h1>

            <p className="subtitle quest-page__subtitle">
              {quest.typeLabel}
            </p>

            <ul className="tags tags--size-l quest-page__tags">
              <li className="tags__item">
                <svg width="11" height="14" aria-hidden="true">
                  <use xlinkHref="#icon-person" />
                </svg>
                {quest.peopleMinCount}–{quest.peopleMaxCount} чел
              </li>
              <li className="tags__item">
                <svg width="14" height="14" aria-hidden="true">
                  <use xlinkHref="#icon-level" />
                </svg>
                {quest.levelLabel}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}

