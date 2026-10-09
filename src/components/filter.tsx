import { QuestType, QuestLevel } from '../types/quest';

type FilterProps = {
  selectedType: QuestType | 'all';
  selectedLevel: QuestLevel | 'any';
  onTypeChange: (type: QuestType | 'all') => void;
  onLevelChange: (level: QuestLevel | 'any') => void;
};

const QUEST_TYPES = [
  { value: 'all', label: 'Все квесты', icon: 'icon-all-quests' },
  { value: 'adventures', label: 'Приключения', icon: 'icon-adventure' },
  { value: 'horror', label: 'Ужасы', icon: 'icon-horror' },
  { value: 'mystic', label: 'Мистика', icon: 'icon-mystic' },
  { value: 'detective', label: 'Детектив', icon: 'icon-detective' },
  { value: 'sci-fi', label: 'Sci-fi', icon: 'icon-sci-fi' },
] as const;

const QUEST_LEVELS = [
  { value: 'any', label: 'Любой' },
  { value: 'easy', label: 'Лёгкий' },
  { value: 'middle', label: 'Средний' },
  { value: 'hard', label: 'Сложный' },
] as const;

export function Filter({
  selectedType,
  selectedLevel,
  onTypeChange,
  onLevelChange,
}: FilterProps) {
  return (
    <form className="filter" action="#" method="get">
      <fieldset className="filter__section">
        <legend className="visually-hidden">Тематика</legend>
        <ul className="filter__list">
          {QUEST_TYPES.map((type) => (
            <li className="filter__item" key={type.value}>
              <input
                type="radio"
                name="type"
                id={`type-${type.value}`}
                checked={selectedType === type.value}
                onChange={() => onTypeChange(type.value)}
              />
              <label className="filter__label" htmlFor={`type-${type.value}`}>
                <svg className="filter__icon" width="26" height="30" aria-hidden="true">
                  <use xlinkHref={`#${type.icon}`}></use>
                </svg>
                <span className="filter__label-text">{type.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="filter__section">
        <legend className="visually-hidden">Уровень сложности</legend>
        <ul className="filter__list">
          {QUEST_LEVELS.map((level) => (
            <li className="filter__item" key={level.value}>
              <input
                type="radio"
                name="level"
                id={`level-${level.value}`}
                checked={selectedLevel === level.value}
                onChange={() => onLevelChange(level.value)}
              />
              <label className="filter__label" htmlFor={`level-${level.value}`}>
                <span className="filter__label-text">{level.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </form>
  );
}
