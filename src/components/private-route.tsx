import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

type PrivateRouteProps = {
  isAuth: boolean;
  children: ReactNode;
};

export function PrivateRoute({ isAuth, children }: PrivateRouteProps) {
  const location = useLocation();
  return isAuth ? children : <Navigate to="/auth" state={{ from: location }} replace />;
}
