import { useState } from 'react';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { QuestCard } from '../components/quest-card';
import { Filter } from '../components/filter';
import { mockQuests } from '../mocks/quests';
import { QuestType, QuestLevel } from '../types/quest';

export default function CataloguePage() {
  const isAuth = false;
  const handleLogout = () => {
    // доделать логику Logout позже
  };

  const [selectedType, setSelectedType] = useState<QuestType | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<QuestLevel | 'any'>('any');

  const filteredQuests = mockQuests.filter((quest) => {
    const matchesType = selectedType === 'all' || quest.type === selectedType;
    const matchesLevel = selectedLevel === 'any' || quest.level === selectedLevel;
    return matchesType && matchesLevel;
  });

  return (
    <div className="page">
      <Header isAuth={isAuth} onLogout={handleLogout} />
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
            <div className="cards-grid">
              {filteredQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

