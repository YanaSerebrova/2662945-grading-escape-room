import { useState } from 'react';
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

type Slot = {
  id: number;
  time: string;
  isAvailable: boolean;
};

type Place = {
  id: number;
  address: string;
  coordinates: [number, number];
  slots: Slot[];
};

type Booking = {
  id: number;
  questId: number;
  address: string;
  slotId: number;
  name: string;
  phone: string;
  personCount: number;
};

type BookingFormValues = {
  name: string;
  phone: string;
  personCount: number;
  agreement: boolean;
};

const places: Place[] = [
  {
    id: 1,
    address: 'Москва, улица Большая Дмитровка, дом 10',
    coordinates: [55.751244, 37.618423],
    slots: [
      { id: 1, time: '14:00', isAvailable: true },
      { id: 2, time: '15:30', isAvailable: true },
      { id: 3, time: '17:00', isAvailable: false },
      { id: 4, time: '19:30', isAvailable: true },
    ],
  },
  {
    id: 2,
    address: 'Москва, улица Тверская, дом 15',
    coordinates: [55.7652, 37.6053],
    slots: [
      { id: 5, time: '12:00', isAvailable: true },
      { id: 6, time: '16:00', isAvailable: false },
      { id: 7, time: '20:00', isAvailable: true },
    ],
  },
];

function MapPositionUpdater({
  position,
}: {
  position: [number, number];
}) {
  const map = useMap();
  map.setView(position);

  return null;
}

function createMarkerIcon(isSelected: boolean) {
  return L.divIcon({
    className: isSelected
      ? 'booking-marker booking-marker--active'
      : 'booking-marker',
    html: '<span></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [selectedPlaceId, setSelectedPlaceId] = useState(places[0].id);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const selectedPlace =
    places.find((place) => place.id === selectedPlaceId) || places[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>();

  const onSubmit = (data: BookingFormValues) => {
    if (!selectedSlotId) {
      // eslint-disable-next-line no-alert
      alert('Выберите время бронирования');
      return;
    }

    const bookings = JSON.parse(
      localStorage.getItem('bookings') || '[]',
    ) as Booking[];

    bookings.push({
      id: Date.now(),
      questId: Number(id),
      address: selectedPlace.address,
      slotId: selectedSlotId,
      name: data.name,
      phone: data.phone,
      personCount: Number(data.personCount),
    } as Booking);

    localStorage.setItem('bookings', JSON.stringify(bookings));

    navigate('/my-quests');
  };

  return (
    <div className="page">
      <Header
        isAuth
        onLogout={() => {
          // сделать потом вывод
        }}
      />

      <main className="page-content decorated-page">
        <div className="decorated-page__decor" aria-hidden="true">
          <picture>
            <source
              type="image/webp"
              srcSet="/img/content/maniac/maniac-bg-size-m.webp"
            />

            <img
              src="/img/content/maniac/maniac-bg-size-m.jpg"
              width="1366"
              height="1959"
              alt=""
            />
          </picture>
        </div>

        <div className="container container--size-s">
          <div className="page-content__title-wrapper">
            <h1 className="subtitle subtitle--size-l page-content__subtitle">
              Бронирование
            </h1>

            <p className="title title--size-m title--uppercase page-content__title">
              Выберите место и время
            </p>
          </div>

          <div className="page-content__item">
            <section className="booking-map">
              <div className="map">
                <MapContainer
                  center={selectedPlace.coordinates}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ width: '100%', height: '400px' }}
                >
                  <MapPositionUpdater
                    position={selectedPlace.coordinates}
                  />

                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {places.map((place) => (
                    <Marker
                      key={place.id}
                      position={place.coordinates}
                      icon={createMarkerIcon(
                        place.id === selectedPlaceId,
                      )}
                      eventHandlers={{
                        click: () => {
                          setSelectedPlaceId(place.id);
                          setSelectedSlotId(null);
                        },
                      }}
                    >
                      <Popup>{place.address}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <p className="booking-map__address">
                {selectedPlace.address}
              </p>
            </section>

            <form
              className="booking-form"
              onSubmit={(e) => void handleSubmit(onSubmit)(e)}
            >
              <fieldset className="booking-form__date-section">
                <legend className="booking-form__date-title">
                  Выберите время
                </legend>

                <div className="booking-form__date-inner-wrapper">
                  {selectedPlace.slots.map((slot) => (
                    <label
                      className={`custom-radio booking-form__date ${selectedSlotId === slot.id ? 'custom-radio--active' : ''
                        }`}
                      key={slot.id}
                    >
                      <input
                        type="radio"
                        name="slot"
                        value={slot.id}
                        disabled={!slot.isAvailable}
                        checked={selectedSlotId === slot.id}
                        onChange={() => setSelectedSlotId(slot.id)}
                      />
                      <span className="custom-radio__label">
                        {slot.time}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="booking-form__section">
                <legend className="visually-hidden">
                  Данные пользователя
                </legend>

                <div className="custom-input booking-form__input">
                  <label
                    className="custom-input__label"
                    htmlFor="name"
                  >
                    Имя
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Введите имя"
                    {...register('name', {
                      required: 'Введите имя',
                      minLength: {
                        value: 1,
                        message: 'Введите имя',
                      },
                      maxLength: {
                        value: 15,
                        message: 'Максимум 15 символов',
                      },
                      pattern: {
                        value: /^[А-Яа-яA-Za-zёЁ -]+$/,
                        message: 'Используйте только буквы',
                      },
                    })}
                  />

                  {errors.name && (
                    <span className="form-error">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div className="custom-input booking-form__input">
                  <label
                    className="custom-input__label"
                    htmlFor="phone"
                  >
                    Телефон
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="+7 (000) 000-00-00"
                    {...register('phone', {
                      required: 'Введите номер телефона',
                      pattern: {
                        value:
                          /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
                        message: 'Формат: +7 (000) 000-00-00',
                      },
                    })}
                  />

                  {errors.phone && (
                    <span className="form-error">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                <div className="custom-input booking-form__input">
                  <label
                    className="custom-input__label"
                    htmlFor="personCount"
                  >
                    Количество участников
                  </label>

                  <input
                    id="personCount"
                    type="number"
                    min={3}
                    max={6}
                    placeholder="Количество участников"
                    {...register('personCount', {
                      required: 'Укажите количество участников',
                      valueAsNumber: true,
                      min: {
                        value: 3,
                        message: 'Минимум 3 участника',
                      },
                      max: {
                        value: 6,
                        message: 'Максимум 6 участников',
                      },
                    })}
                  />

                  {errors.personCount && (
                    <span className="form-error">
                      {errors.personCount.message}
                    </span>
                  )}
                </div>

                <label className="custom-checkbox booking-form__checkbox booking-form__checkbox--agreement">
                  <input
                    type="checkbox"
                    {...register('agreement', {
                      required: 'Подтвердите согласие',
                    })}
                  />

                  <span className="custom-checkbox__icon">
                    <svg width="20" height="17" aria-hidden="true">
                      <use xlinkHref="#icon-tick" />
                    </svg>
                  </span>

                  <span className="custom-checkbox__label">
                    Я согласен с правилами бронирования
                  </span>
                </label>

                {errors.agreement && (
                  <span className="form-error">
                    {errors.agreement.message}
                  </span>
                )}
              </fieldset>

              <button
                className="btn btn--accent btn--cta booking-form__submit"
                type="submit"
              >
                Забронировать
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
