import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

const companyPosition: [number, number] = [55.751244, 37.618423];

export default function ContactsPage() {
  return (
    <div className="page">
      <Header />

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

        <div className="container">
          <div className="page-content__title-wrapper page-content__title-wrapper--underlined">
            <p className="subtitle page-content__subtitle">
              Escape Room
            </p>

            <h1 className="title title--size-m page-content__title">
              Контакты
            </h1>
          </div>

          <div className="contacts">
            <dl className="contacts__list">
              <div className="contacts__item">
                <dt className="contacts__dt">Адрес</dt>

                <dd className="contacts__dd">
                  <address className="contacts__address">
                    Москва, улица Большая Дмитровка, дом 10
                  </address>
                </dd>
              </div>

              <div className="contacts__item">
                <dt className="contacts__dt">Часы работы</dt>

                <dd className="contacts__dd">
                  Ежедневно с 10:00 до 22:00
                </dd>
              </div>

              <div className="contacts__item">
                <dt className="contacts__dt">Телефон</dt>

                <dd className="contacts__dd">
                  <a
                    className="link"
                    href="tel:88003335599"
                  >
                    8 (000) 111-11-11
                  </a>
                </dd>
              </div>

              <div className="contacts__item">
                <dt className="contacts__dt">E-mail</dt>

                <dd className="contacts__dd">
                  <a
                    className="link"
                    href="mailto:info@escape-room.ru"
                  >
                    info@escape-room.ru
                  </a>
                </dd>
              </div>
            </dl>

            <div className="contacts__map">
              <div className="map">
                <MapContainer
                  center={companyPosition}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ width: '100%', height: '400px' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker position={companyPosition}>
                    <Popup>
                      Escape Room
                      <br />
                      Большая Дмитровка, 10
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

