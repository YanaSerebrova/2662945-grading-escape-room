import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Filter } from './filter';

describe('Filter', () => {
  const mockOnTypeChange = vi.fn();
  const mockOnLevelChange = vi.fn();

  const renderFilter = (props = {}) => render(
    <Filter
      selectedType="all"
      selectedLevel="any"
      onTypeChange={mockOnTypeChange}
      onLevelChange={mockOnLevelChange}
      {...props}
    />
  );

  it('should render all type options correctly', () => {
    renderFilter();
    expect(screen.getByLabelText('Все квесты')).toBeInTheDocument();
    expect(screen.getByLabelText('Ужасы')).toBeInTheDocument();
    expect(screen.getByLabelText('Мистика')).toBeInTheDocument();
  });

  it('should render all level options correctly', () => {
    renderFilter();
    expect(screen.getByLabelText('Любой')).toBeInTheDocument();
    expect(screen.getByLabelText('Лёгкий')).toBeInTheDocument();
    expect(screen.getByLabelText('Средний')).toBeInTheDocument();
    expect(screen.getByLabelText('Сложный')).toBeInTheDocument();
  });

  it('should call onTypeChange with correct value when type is clicked', async () => {
    renderFilter();
    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Ужасы'));
    expect(mockOnTypeChange).toHaveBeenCalledWith('horror');
  });

  it('should call onLevelChange with correct value when level is clicked', async () => {
    renderFilter();
    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Сложный'));
    expect(mockOnLevelChange).toHaveBeenCalledWith('hard');
  });

  it('should mark the correct inputs as checked based on props', () => {
    renderFilter({ selectedType: 'horror', selectedLevel: 'medium' });

    expect(screen.getByLabelText('Ужасы')).toBeChecked();
    expect(screen.getByLabelText('Средний')).toBeChecked();
  });
});


