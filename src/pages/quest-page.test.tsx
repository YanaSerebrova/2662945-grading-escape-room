import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import QuestPage from './quest-page';
import { Quest } from '../types/quest';

const mockDispatch = vi.fn();

const mockQuest: Quest = {
  id: '1',
  title: 'Маньяк',
  type: 'horror',
  typeLabel: 'Хоррор',
  description: 'Страшный квест',
  previewImg: 'preview.jpg',
  previewImgWebp: 'preview.webp',
  previewImgAlt: 'Маньяк',
  coverImg: 'cover.jpg',
  coverImgWebp: 'cover.webp',
  coverImgAlt: 'Маньяк',
  level: 'medium',
  levelLabel: 'Средний',
  peopleMinCount: 3,
  peopleMaxCount: 6,
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );

  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('../store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn(() => ({
    currentQuest: mockQuest,
    isQuestLoading: false,
    error: null,
  })),
}));

vi.mock('../store/quests-slice', () => ({
  fetchQuestByIdAction: Object.assign(vi.fn(), {
    pending: { type: 'quests/fetchQuestById/pending' },
    fulfilled: { type: 'quests/fetchQuestById/fulfilled' },
    rejected: { type: 'quests/fetchQuestById/rejected' },
  }),
}));

const renderQuestPage = () =>
  render(
    <MemoryRouter initialEntries={['/quest/1']}>
      <Routes>
        <Route path="/quest/:id" element={<QuestPage />} />
      </Routes>
    </MemoryRouter>
  );

describe('QuestPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch fetchQuestByIdAction on mount', async () => {
    renderQuestPage();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('should render quest details', () => {
    renderQuestPage();

    expect(screen.getByRole('heading', { name: 'Маньяк' })).toBeInTheDocument();
    expect(screen.getByText('Хоррор')).toBeInTheDocument();
    expect(screen.getByText('Средний')).toBeInTheDocument();
    expect(screen.getByText('Страшный квест')).toBeInTheDocument();
    expect(screen.getByText(/3\s*–\s*6\s*чел/)).toBeInTheDocument();
  });

  it('should render link to booking page', () => {
    renderQuestPage();

    const bookingLink = screen.getByRole('link', { name: /забронировать/i });

    expect(bookingLink).toBeInTheDocument();
    expect(bookingLink).toHaveAttribute('href', '/quest/1/booking');
  });
});

