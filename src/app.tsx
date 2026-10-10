import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store';
import CataloguePage from './pages/catalogue-page';
import QuestPage from './pages/quest-page';
import ContactsPage from './pages/contacts-page';
import LoginPage from './pages/login-page';
import BookingPage from './pages/booking-page';
import MyBookingsPage from './pages/mybookings-page';
import NotFoundPage from './pages/not-found-page';
import { PrivateRoute } from './components/private-route';

function App() {
  const isAuth = useAppSelector((state) => state.user.isAuth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CataloguePage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route
          path="/auth"
          element={isAuth ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route path="/quest/:id" element={<QuestPage />} />
        <Route
          path="/quest/:id/booking"
          element={
            <PrivateRoute isAuth={isAuth}>
              <BookingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-quests"
          element={
            <PrivateRoute isAuth={isAuth}>
              <MyBookingsPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
