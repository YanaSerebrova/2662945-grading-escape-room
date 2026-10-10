import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';
import { AppRoute } from '../api';

type PrivateRouteProps = {
  isAuth: boolean;
  children: ReactElement;
};

export function PrivateRoute({ isAuth, children }: PrivateRouteProps): ReactElement {
  const location = useLocation();
  return isAuth ? children : <Navigate to={AppRoute.Auth} state={{ from: location }} replace />;
}

