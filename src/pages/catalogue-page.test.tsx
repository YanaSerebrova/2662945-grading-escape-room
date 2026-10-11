import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CataloguePage from './catalogue-page';
import { Quest } from '../types/quest';

const mockDispatch = vi.fn();

const mockQuests: Quest[] = [
  {
    id: '1',
    title: 'Маньяк',
    type: 'horror',
    typeLabel: 'Хоррор',
    description: 'Описание',
    previewImg: 'img-1.jpg',
    previewImgWebp: 'img-1.webp',
    previewImgAlt: 'Маньяк',
    coverImg: 'cover-1.jpg',
    coverImgWebp: 'cover-1.webp',
    coverImgAlt: 'Маньяк',
    level: 'medium',
    levelLabel: 'Средний',
    peopleMinCount: 3,
    peopleMaxCount: 6,
  },
  {
    id: '2',
    title: 'Ритуал',
    type: 'mystic',
    typeLabel: 'Мистика',
    description: 'Описание',
    previewImg: 'img-2.jpg',
    previewImgWebp: 'img-2.webp',
    previewImgAlt: 'Ритуал',
    coverImg: 'cover-2.jpg',
    coverImgWebp: 'cover-2.webp',
    coverImgAlt: 'Ритуал',
    level: 'easy',
    levelLabel: 'Лёгкий',
    peopleMinCount: 2,
    peopleMaxCount: 5,
  },
];

vi.mock('../store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn(() => ({
    quests: mockQuests,
    isLoading: false,
    error: null,
  })),
}));

vi.mock('../store/quests-slice', () => ({
  fetchQuestsAction: Object.assign(vi.fn(), {
    pending: { type: 'quests/fetchQuests/pending' },
    fulfilled: { type: 'quests/fetchQuests/fulfilled' },
    rejected: { type: 'quests/fetchQuests/rejected' },
  }),
}));

const renderCatalogue = () =>
  render(
    <MemoryRouter>
      <CataloguePage />
    </MemoryRouter>
  );

describe('CataloguePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch fetchQuestsAction on mount', async () => {
    renderCatalogue();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('should render all quests', () => {
    renderCatalogue();

    expect(screen.getByText('Маньяк')).toBeInTheDocument();
    expect(screen.getByText('Ритуал')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Маньяк' })).toHaveAttribute(
      'href',
      '/quest/1'
    );

    expect(screen.getByRole('link', { name: 'Ритуал' })).toHaveAttribute(
      'href',
      '/quest/2'
    );
  });

  it('should filter quests by type', async () => {
    const user = userEvent.setup();
    renderCatalogue();

    const horrorRadio = screen.getByLabelText('Ужасы');
    await user.click(horrorRadio);

    expect(screen.getByText('Маньяк')).toBeInTheDocument();
    expect(screen.queryByText('Ритуал')).not.toBeInTheDocument();
  });

  it('should filter quests by level', async () => {
    const user = userEvent.setup();
    renderCatalogue();

    const easyRadio = screen.getByLabelText('Лёгкий');
    await user.click(easyRadio);

    expect(screen.getByText('Ритуал')).toBeInTheDocument();
    expect(screen.queryByText('Маньяк')).not.toBeInTheDocument();
  });
});
