import { describe, it, expect } from 'vitest';
import {
  adaptQuestPreviewToClient,
  adaptQuestToClient,
} from './quest-adapter';
import type { QuestDto, QuestPreviewDto } from '../types/quest';

describe('Quest Adapter', () => {
  it('should correctly adapt QuestPreviewDto (list view)', () => {
    const previewDto: QuestPreviewDto = {
      id: '1',
      title: 'Склеп',
      previewImg: '/img.jpg',
      previewImgWebp: '/img.webp',
      level: 'medium',
      type: 'horror',
      peopleMinMax: [2, 5],
    };

    const result = adaptQuestPreviewToClient(previewDto);

    expect(result.id).toBe('1');
    expect(result.title).toBe('Склеп');
    expect(result.typeLabel).toBe('Ужасы');
    expect(result.levelLabel).toBe('Средний');
    expect(result.peopleMinCount).toBe(2);
    expect(result.peopleMaxCount).toBe(5);
    expect(result.previewImgAlt).toBe('Склеп');
  });

  it('should correctly adapt QuestDto (detailed view)', () => {
    const detailDto: QuestDto = {
      id: '2',
      title: 'Ритуал',
      description: 'Описание квеста',
      previewImg: '/img.jpg',
      previewImgWebp: '/img.webp',
      coverImg: '/cover.jpg',
      coverImgWebp: '/cover.webp',
      level: 'easy',
      type: 'mystic',
      peopleMinMax: [3, 6],
    };

    const result = adaptQuestToClient(detailDto);

    expect(result.description).toBe('Описание квеста');
    expect(result.coverImg).toBe('/cover.jpg');
    expect(result.coverImgWebp).toBe('/cover.webp');
    expect(result.typeLabel).toBe('Мистика');
    expect(result.levelLabel).toBe('Лёгкий');
    expect(result.peopleMinCount).toBe(3);
    expect(result.peopleMaxCount).toBe(6);
  });
});
