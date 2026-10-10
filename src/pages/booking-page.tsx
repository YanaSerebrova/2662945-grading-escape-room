import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchBookingPlacesAction, createBookingAction } from '../store/booking-slice';
import { BookingRequestDto } from '../types/booking';

type BookingFormValues = {
  name: string;
  phone: string;
  personCount: number;
  withChildren: boolean;
  agreement: boolean;
};

function MapPositionUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function createMarkerIcon(isSelected: boolean) {
  return L.divIcon({
    className: isSelected ? 'booking-marker booking-marker--active' : 'booking-marker',
    html: '<span></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { places, isLoading, error } = useAppSelector((state) => state.booking);
  const quests = useAppSelector((state) => state.quests.quests);

  const quest = quests.find((q) => q.id === id);

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedDate] = useState<'today' | 'tomorrow'>('today');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>();

  useEffect(() => {
    if (id) {
      dispatch(fetchBookingPlacesAction(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (places.length > 0 && !selectedPlaceId) {
      setSelectedPlaceId(places[0].id);
    }
  }, [places, selectedPlaceId]);

  const selectedPlace = places.find((place) => place.id === selectedPlaceId);
  const slots = selectedPlace?.slots[selectedDate] || [];

  const onSubmit = async (data: BookingFormValues) => {
    if (!selectedPlaceId || !selectedTime || !quest) {
      return;
    }

    const bookingData: BookingRequestDto = {
      date: selectedDate,
      time: selectedTime,
      contactPerson: data.name,
      phone: data.phone,
      withChildren: data.withChildren,
      peopleCount: data.personCount,
      placeId: selectedPlaceId,
    };

    if (!id) {
      return;
    }
    const result = await dispatch(createBookingAction({ questId: id, data: bookingData }));
    if (createBookingAction.fulfilled.match(result)) {
      navigate('/my-quests');
    }
  };

  if (isLoading) {
    return (
      <div className="page">
        <Header />
        <main className="page-content">
          <div className="container">
            <p>Загрузка...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Header />
        <main className="page-content">
          <div className="container">
            <p className="form-error" style={{ color: 'red' }}>Ошибка: {error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="page">
        <Header />
        <main className="page-content">
          <div className="container">
            <p>Квест не найден</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header />
      <main className="page-content decorated-page">
        <div className="decorated-page__decor" aria-hidden="true">
          <picture>
            <source type="image/webp" srcSet={quest.coverImgWebp} />
            <img src={quest.coverImg} width="1366" height="1959" alt="" />
          </picture>
        </div>
        <div className="container container--size-s">
          <div className="page-content__title-wrapper">
            <h1 className="subtitle subtitle--size-l page-content__subtitle">
              Бронирование
            </h1>
            <p className="title title--size-m title--uppercase page-content__title">
              {quest.title}
            </p>
          </div>
          <div className="page-content__item">
            <section className="booking-map">
              <div className="map">
                <MapContainer
                  center={selectedPlace?.location.coords || [55.751244, 37.618423]}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ width: '100%', height: '400px' }}
                >
                  <MapPositionUpdater position={selectedPlace?.location.coords || [55.751244, 37.618423]} />
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {places.map((place) => (
                    <Marker
                      key={place.id}
                      position={place.location.coords}
                      icon={createMarkerIcon(place.id === selectedPlaceId)}
                      eventHandlers={{
                        click: () => {
                          setSelectedPlaceId(place.id);
                          setSelectedTime(null);
                        },
                      }}
                    >
                      <Popup>{place.location.address}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <p className="booking-map__address">{selectedPlace?.location.address}</p>
            </section>
            <form className="booking-form" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
              <fieldset className="booking-form__section">
                <legend className="visually-hidden">Выбор даты и времени</legend>
                <fieldset className="booking-form__date-section">
                  <legend className="booking-form__date-title">Сегодня</legend>
                  <div className="booking-form__date-inner-wrapper">
                    {slots.map((slot) => (
                      <label
                        key={slot.time}
                        className={`custom-radio booking-form__date ${selectedTime === slot.time ? 'custom-radio--active' : ''}`}
                      >
                        <input
                          type="radio"
                          name="time"
                          value={slot.time}
                          disabled={!slot.isAvailable}
                          checked={selectedTime === slot.time}
                          onChange={() => setSelectedTime(slot.time)}
                        />
                        <span className="custom-radio__label">{slot.time}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </fieldset>
              <fieldset className="booking-form__section">
                <legend className="visually-hidden">Контактная информация</legend>
                <div className="custom-input booking-form__input">
                  <label className="custom-input__label" htmlFor="name">Ваше имя</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Имя"
                    {...register('name', {
                      required: 'Введите имя',
                      minLength: { value: 1, message: 'Введите имя' },
                      maxLength: { value: 15, message: 'Максимум 15 символов' },
                      pattern: { value: /^[А-Яа-яA-Za-zёЁ -]+$/, message: 'Используйте только буквы' },
                    })}
                  />
                  {errors.name && <span className="form-error">{errors.name.message}</span>}
                </div>
                <div className="custom-input booking-form__input">
                  <label className="custom-input__label" htmlFor="phone">Контактный телефон</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+7 (000) 000-00-00"
                    {...register('phone', {
                      required: 'Введите номер телефона',
                      pattern: { value: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, message: 'Формат: +7 (000) 000-00-00' },
                    })}
                  />
                  {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                </div>
                <div className="custom-input booking-form__input">
                  <label className="custom-input__label" htmlFor="personCount">Количество участников</label>
                  <input
                    id="personCount"
                    type="number"
                    min={quest.peopleMinCount}
                    max={quest.peopleMaxCount}
                    placeholder="Количество участников"
                    {...register('personCount', {
                      required: 'Укажите количество участников',
                      valueAsNumber: true,
                      min: { value: quest.peopleMinCount, message: `Минимум ${quest.peopleMinCount} участника` },
                      max: { value: quest.peopleMaxCount, message: `Максимум ${quest.peopleMaxCount} участников` },
                    })}
                  />
                  {errors.personCount && <span className="form-error">{errors.personCount.message}</span>}
                </div>
                <label className="custom-checkbox booking-form__checkbox booking-form__checkbox--children">
                  <input type="checkbox" {...register('withChildren')} />
                  <span className="custom-checkbox__icon">
                    <svg width="20" height="17" aria-hidden="true">
                      <use xlinkHref="#icon-tick" />
                    </svg>
                  </span>
                  <span className="custom-checkbox__label">Со мной будут дети</span>
                </label>
              </fieldset>
              <button className="btn btn--accent btn--cta booking-form__submit" type="submit">
                Забронировать
              </button>
              <label className="custom-checkbox booking-form__checkbox booking-form__checkbox--agreement">
                <input
                  type="checkbox"
                  {...register('agreement', { required: 'Подтвердите согласие' })}
                />
                <span className="custom-checkbox__icon">
                  <svg width="20" height="17" aria-hidden="true">
                    <use xlinkHref="#icon-tick" />
                  </svg>
                </span>
                <span className="custom-checkbox__label">
                  Я согласен с правилами обработки персональных данных и пользовательским соглашением
                </span>
              </label>
              {errors.agreement && <span className="form-error">{errors.agreement.message}</span>}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

