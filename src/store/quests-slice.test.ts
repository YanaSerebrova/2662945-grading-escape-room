import { describe, it, expect } from 'vitest';
import questsReducer, { fetchQuestsAction, fetchQuestByIdAction } from './quests-slice';
import { Quest } from '../types/quest';

const mockQuest: Quest = {
  id: '1',
  title: 'Тестовый квест',
  type: 'horror',
  typeLabel: 'Ужасы',
  description: 'Описание квеста',
  previewImg: '/preview.jpg',
  previewImgWebp: '/preview.webp',
  previewImgAlt: 'Тестовый квест',
  coverImg: '/cover.jpg',
  coverImgWebp: '/cover.webp',
  coverImgAlt: 'Тестовый квест',
  level: 'medium',
  levelLabel: 'Средний',
  peopleMinCount: 2,
  peopleMaxCount: 5,
};

describe('Quests Slice', () => {
  it('should return initial state', () => {
    const state = questsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state.quests).toEqual([]);
    expect(state.currentQuest).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isQuestLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchQuestsAction.pending', () => {
    const state = questsReducer(
      { quests: [], currentQuest: null, isLoading: false, isQuestLoading: false, error: null },
      { type: fetchQuestsAction.pending.type }
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchQuestsAction.fulfilled', () => {
    const state = questsReducer(
      { quests: [], currentQuest: null, isLoading: true, isQuestLoading: false, error: null },
      { type: fetchQuestsAction.fulfilled.type, payload: [mockQuest] }
    );
    expect(state.isLoading).toBe(false);
    expect(state.quests).toHaveLength(1);
    expect(state.quests[0].title).toBe('Тестовый квест');
  });

  it('should handle fetchQuestsAction.rejected', () => {
    const state = questsReducer(
      { quests: [], currentQuest: null, isLoading: true, isQuestLoading: false, error: null },
      { type: fetchQuestsAction.rejected.type, payload: 'Network error' }
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should handle fetchQuestByIdAction.pending', () => {
    const state = questsReducer(
      { quests: [], currentQuest: null, isLoading: false, isQuestLoading: false, error: null },
      { type: fetchQuestByIdAction.pending.type }
    );
    expect(state.isQuestLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchQuestByIdAction.fulfilled', () => {
    const state = questsReducer(
      { quests: [], currentQuest: null, isLoading: false, isQuestLoading: true, error: null },
      { type: fetchQuestByIdAction.fulfilled.type, payload: mockQuest }
    );
    expect(state.isQuestLoading).toBe(false);
    expect(state.currentQuest).toEqual(mockQuest);
  });

  it('should handle fetchQuestByIdAction.rejected', () => {
    const state = questsReducer(
      { quests: [], currentQuest: null, isLoading: false, isQuestLoading: true, error: null },
      { type: fetchQuestByIdAction.rejected.type, payload: 'Not found' }
    );
    expect(state.isQuestLoading).toBe(false);
    expect(state.error).toBe('Not found');
  });
});

