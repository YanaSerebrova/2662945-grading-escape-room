import type {
  Quest,
  QuestDto,
  QuestLevel,
  QuestPreview,
  QuestPreviewDto,
  QuestType,
} from '../types/quest';

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

export const adaptQuestPreviewToClient = (
  quest: QuestPreviewDto
): QuestPreview => ({
  id: quest.id,
  title: quest.title,
  type: quest.type,
  typeLabel: QUEST_TYPE_MAP[quest.type],
  previewImg: quest.previewImg,
  previewImgWebp: quest.previewImgWebp,
  previewImgAlt: quest.title,
  level: quest.level,
  levelLabel: QUEST_LEVEL_MAP[quest.level],
  peopleMinCount: quest.peopleMinMax[0],
  peopleMaxCount: quest.peopleMinMax[1],
});

export const adaptQuestToClient = (quest: QuestDto): Quest => ({
  ...adaptQuestPreviewToClient(quest),
  description: quest.description,
  coverImg: quest.coverImg,
  coverImgWebp: quest.coverImgWebp,
  coverImgAlt: quest.title,
});


