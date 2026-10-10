import { useEffect, useState } from 'react';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { QuestCard } from '../components/quest-card';
import { Filter } from '../components/filter';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchQuestsAction } from '../store/quests-slice';
import { QuestType, QuestLevel } from '../types/quest';

export default function CataloguePage() {
  const dispatch = useAppDispatch();
  const { quests, isLoading, error } = useAppSelector((state) => state.quests);

  const [selectedType, setSelectedType] = useState<QuestType | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<QuestLevel | 'any'>('any');

  useEffect(() => {
    dispatch(fetchQuestsAction());
  }, [dispatch]);

  const filteredQuests = quests.filter((quest) => {
    const matchesType = selectedType === 'all' || quest.type === selectedType;
    const matchesLevel = selectedLevel === 'any' || quest.level === selectedLevel;
    return matchesType && matchesLevel;
  });

  if (isLoading) {
    return (
      <div className="page">
        <Header />
        <main className="page-content">
          <div className="container">
            <p>Загрузка квестов...</p>
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
      <main className="page-content">
        <div className="container">
          <div className="page-content__title-wrapper">
            <h1 className="subtitle page-content__subtitle">
              квесты в Санкт-Петербурге
            </h1>
            <h2 className="title title--size-m page-content__title">
              Выберите тематику
            </h2>
          </div>
          <div className="page-content__item">
            <Filter
              selectedType={selectedType}
              selectedLevel={selectedLevel}
              onTypeChange={setSelectedType}
              onLevelChange={setSelectedLevel}
            />
            <h2 className="title visually-hidden">Выберите квест</h2>

            {filteredQuests.length === 0 ? (
              <p>По выбранным фильтрам квесты не найдены.</p>
            ) : (
              <div className="cards-grid">
                {filteredQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


