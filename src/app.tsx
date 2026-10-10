import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store';
import { AppRoute } from './api';
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
        <Route path={AppRoute.Root} element={<CataloguePage />} />
        <Route path={AppRoute.Contacts} element={<ContactsPage />} />
        <Route
          path={AppRoute.Auth}
          element={isAuth ? <Navigate to={AppRoute.Root} replace /> : <LoginPage />}
        />
        <Route path={AppRoute.Quest} element={<QuestPage />} />
        <Route
          path={AppRoute.Booking}
          element={
            <PrivateRoute isAuth={isAuth}>
              <BookingPage />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.MyQuests}
          element={
            <PrivateRoute isAuth={isAuth}>
              <MyBookingsPage />
            </PrivateRoute>
          }
        />
        <Route path={AppRoute.NotFound} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
