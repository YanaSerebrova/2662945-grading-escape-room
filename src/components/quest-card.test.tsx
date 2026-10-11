import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QuestCard } from './quest-card';
import { Quest } from '../types/quest';

const mockQuest: Quest = {
  id: '1',
  title: 'Маньяк',
  type: 'horror',
  typeLabel: 'Ужасы',
  description: 'Описание квеста',
  previewImg: '/img/content/maniac/maniac-size-s.jpg',
  previewImgWebp: '/img/content/maniac/maniac-size-s.webp',
  previewImgAlt: 'Мужчина в маске в тёмном переходе.',
  coverImg: '/img/content/maniac/maniac-bg-size-m.jpg',
  coverImgWebp: '/img/content/maniac/maniac-bg-size-m.webp',
  coverImgAlt: 'Маньяк',
  level: 'medium',
  levelLabel: 'Средний',
  peopleMinCount: 3,
  peopleMaxCount: 6,
};

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe('QuestCard', () => {
  it('should render quest title', () => {
    renderWithRouter(<QuestCard quest={mockQuest} />);
    expect(screen.getByText('Маньяк')).toBeInTheDocument();
  });

  it('should render link to quest page with correct href', () => {
    renderWithRouter(<QuestCard quest={mockQuest} />);
    const link = screen.getByRole('link', { name: 'Маньяк' });
    expect(link).toHaveAttribute('href', '/quest/1');
  });

  it('should render preview image with correct src and alt', () => {
    renderWithRouter(<QuestCard quest={mockQuest} />);
    const img = screen.getByAltText('Мужчина в маске в тёмном переходе.');
    expect(img).toHaveAttribute('src', '/img/content/maniac/maniac-size-s.jpg');
  });

  it('should render people count tag', () => {
    renderWithRouter(<QuestCard quest={mockQuest} />);
    expect(screen.getByText(/3–6 чел/)).toBeInTheDocument();
  });

  it('should render level tag', () => {
    renderWithRouter(<QuestCard quest={mockQuest} />);
    expect(screen.getByText('Средний')).toBeInTheDocument();
  });
});

