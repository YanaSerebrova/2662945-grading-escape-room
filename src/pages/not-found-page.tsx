import { Link } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

export default function NotFoundPage() {
  return (
    <div className="page">
      <Header />

      <main className="page-content">
        <section className="container container--size-l not-found">
          <h1 className="title title--size-l">404</h1>

          <p className="subtitle subtitle--size-s">
            Страница не найдена
          </p>

          <Link className="btn btn--accent" to="/">
            Вернуться на главную
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
