import { Quest, QuestType, QuestLevel } from '../types/quest';

export type QuestPreviewDto = {
  id: string;
  title: string;
  previewImg: string;
  previewImgWebp: string;
  level: QuestLevel;
  type: QuestType;
  peopleMinMax: [number, number];
};

const QUEST_TYPE_MAP: Record<QuestType, string> = {
  adventures: 'Приключения',
  horror: 'Ужасы',
  mystic: 'Мистика',
  detective: 'Детектив',
  'sci-fi': 'Sci-fi',
};

const QUEST_LEVEL_MAP: Record<QuestLevel, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

export const adaptQuestToClient = (quest: QuestPreviewDto): Quest => ({
  id: quest.id,
  title: quest.title,
  type: quest.type,
  typeLabel: QUEST_TYPE_MAP[quest.type],
  description: '',
  previewImg: quest.previewImg,
  previewImgWebp: quest.previewImgWebp,
  previewImgAlt: quest.title,
  coverImg: '',
  coverImgWebp: '',
  coverImgAlt: quest.title,
  level: quest.level,
  levelLabel: QUEST_LEVEL_MAP[quest.level],
  peopleMinCount: quest.peopleMinMax[0],
  peopleMaxCount: quest.peopleMinMax[1],
});
