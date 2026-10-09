export type QuestLevel = 'easy' | 'middle' | 'hard';
export type QuestType =
  | 'adventures'
  | 'horror'
  | 'mystic'
  | 'detective'
  | 'sci-fi';

export interface Quest {
  id: string;
  title: string;
  previewImg: string;
  previewImg2x: string;
  previewImgWebp: string;
  previewImgWebp2x: string;
  coverImg?: string;
  coverImgWebp?: string;
  level: QuestLevel;
  type: QuestType;
  peopleMinCount: number;
  peopleMaxCount: number;
  typeLabel: string;
  levelLabel: string;
  previewImgAlt: string;
  coverImgAlt: string;
  description: string;
}
