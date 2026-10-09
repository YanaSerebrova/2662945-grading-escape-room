export type QuestLevel = 'easy' | 'medium' | 'hard';
export type QuestType = 'adventures' | 'horror' | 'mystic' | 'detective' | 'sci-fi';

export interface Quest {
  id: string;
  title: string;
  type: QuestType;
  typeLabel: string;
  description: string;
  previewImg: string;
  previewImgWebp: string;
  previewImg2x?: string;
  previewImgWebp2x?: string;
  previewImgAlt: string;
  coverImg: string;
  coverImgWebp: string;
  coverImg2x?: string;
  coverImgWebp2x?: string;
  coverImgAlt: string;
  level: QuestLevel;
  levelLabel: string;
  peopleMinCount: number;
  peopleMaxCount: number;
}


