import { Header } from '../components/header';
import { Footer } from '../components/footer';

export default function Catalogue() {
  const isAuth = false;
  const handleLogout = () => {
    // доделать логику Logout
  };

  return (
    <div className="page">
      <Header isAuth={isAuth} onLogout={handleLogout} />
      <main className="page-content">
        <h1>Каталог</h1>
      </main>
      <Footer />
    </div>
  );
}
