export type QuestLevel = 'easy' | 'medium' | 'hard';
export type QuestType = 'adventures' | 'horror' | 'mystic' | 'detective' | 'sci-fi';

export interface QuestPreview {
  id: string;
  title: string;
  type: QuestType;
  typeLabel: string;
  previewImg: string;
  previewImgWebp: string;
  previewImgAlt: string;
  level: QuestLevel;
  levelLabel: string;
  peopleMinCount: number;
  peopleMaxCount: number;
}

export interface Quest extends QuestPreview {
  description: string;
  coverImg: string;
  coverImgWebp: string;
  coverImgAlt: string;
}

export type QuestPreviewDto = {
  id: string;
  title: string;
  previewImg: string;
  previewImgWebp: string;
  level: QuestLevel;
  type: QuestType;
  peopleMinMax: [number, number];
};

export type QuestDto = QuestPreviewDto & {
  description: string;
  coverImg: string;
  coverImgWebp: string;
};
