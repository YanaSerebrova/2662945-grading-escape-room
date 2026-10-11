import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BookingPage from './booking-page';
import { Quest } from '../types/quest';
import { BookingPlaceDto } from '../types/booking';

const mockNavigate = vi.fn();
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
  peopleMinCount: 2,
  peopleMaxCount: 6,
};

const mockPlaces: BookingPlaceDto[] = [
  {
    id: 'place-1',
    location: {
      address: 'Набережная реки Мойки, 5',
      coords: [59.9343, 30.3351],
    },
    slots: {
      today: [
        { time: '12:00', isAvailable: true },
        { time: '14:00', isAvailable: true },
      ],
      tomorrow: [
        { time: '12:00', isAvailable: false },
      ],
    },
  },
];

const fakeState = {
  user: {
    token: 'test-token',
    email: 'test@test.com',
    isAuth: true,
    isLoading: false,
    error: null,
  },
  booking: {
    places: mockPlaces,
    isLoading: false,
    isSubmitting: false,
    error: null,
    submitError: null,
    lastBooking: null,
  },
  quests: {
    quests: [],
    currentQuest: mockQuest,
    isLoading: false,
    isQuestLoading: false,
    error: null,
  },
};

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => null,
  Marker: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Popup: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useMap: () => ({
    setView: vi.fn(),
  }),
}));

vi.mock('leaflet', () => ({
  default: {
    divIcon: vi.fn(() => ({})),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );

  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector(fakeState),
}));

vi.mock('../store/booking-slice', () => ({
  fetchBookingPlacesAction: Object.assign(vi.fn(), {
    pending: { type: 'booking/fetchPlaces/pending' },
    fulfilled: { type: 'booking/fetchPlaces/fulfilled' },
    rejected: { type: 'booking/fetchPlaces/rejected' },
  }),
  createBookingAction: Object.assign(vi.fn(), {
    fulfilled: {
      match: vi.fn(() => true),
    },
  }),
}));

vi.mock('../store/quests-slice', () => ({
  fetchQuestByIdAction: Object.assign(vi.fn(), {
    pending: { type: 'quests/fetchQuestById/pending' },
    fulfilled: { type: 'quests/fetchQuestById/fulfilled' },
    rejected: { type: 'quests/fetchQuestById/rejected' },
  }),
}));

const renderBookingPage = () =>
  render(
    <MemoryRouter initialEntries={['/quest/1/booking']}>
      <Routes>
        <Route path="/quest/:id/booking" element={<BookingPage />} />
      </Routes>
    </MemoryRouter>
  );

const getNameInput = () => screen.getByLabelText('Ваше имя');
const getPhoneInput = () => screen.getByLabelText('Телефон');
const getPeopleInput = () => screen.getByLabelText('Количество участников');
const getChildrenCheckbox = () =>
  screen.getByRole('checkbox', { name: /со мной будут дети/i });
const getAgreementCheckbox = () =>
  screen.getByRole('checkbox', { name: /я согласен с правилами обработки персональных данных/i });
const getSubmitButton = () =>
  screen.getByRole('button', { name: 'Забронировать' });

describe('BookingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockDispatch.mockResolvedValue({
      type: 'booking/create/fulfilled',
      payload: {},
    });
  });

  it('should dispatch quest and booking places actions on mount', async () => {
    renderBookingPage();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(2);
    });
  });

  it('should render quest, map, place and available time slots', () => {
    renderBookingPage();

    expect(screen.getByText('Маньяк')).toBeInTheDocument();
    expect(screen.getByTestId('map-container')).toBeInTheDocument();

    expect(
      screen.getByText('Набережная реки Мойки, 5', { selector: '.booking-map__address' })
    ).toBeInTheDocument();

    expect(screen.getByDisplayValue('today|12:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('today|14:00')).toBeInTheDocument();
  });

  it('should disable unavailable time slot', () => {
    renderBookingPage();

    const unavailableSlot = screen.getByDisplayValue('tomorrow|12:00');
    expect(unavailableSlot).toBeDisabled();
  });

  it('should not dispatch createBookingAction without selected time', async () => {
    const user = userEvent.setup();
    renderBookingPage();

    await user.type(getNameInput(), 'Иван');
    await user.type(getPhoneInput(), '+7 999 999-99-99');
    await user.type(getPeopleInput(), '3');
    await user.click(getAgreementCheckbox());
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('should dispatch createBookingAction and navigate on successful submit', async () => {
    const user = userEvent.setup();
    renderBookingPage();

    await user.click(screen.getByDisplayValue('today|14:00'));
    await user.type(getNameInput(), 'Иван');

    await user.type(getPhoneInput(), '+7 (999) 999-99-99');

    await user.type(getPeopleInput(), '3');
    await user.click(getChildrenCheckbox());
    await user.click(getAgreementCheckbox());
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith('/my-quests');
    });
  });
});

