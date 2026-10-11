import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PrivateRoute } from './private-route';
import { AppRoute } from '../api';

describe('PrivateRoute', () => {
  it('should render children when isAuth is true', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute isAuth>
                <div>Secret Content</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('should redirect to login when isAuth is false', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path={AppRoute.Auth} element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <PrivateRoute isAuth={false}>
                <div>Secret Content</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('should preserve the attempted URL in location state', () => {
    let capturedState: unknown = null;
    const StateCapture = () => {
      const location = useLocation();
      capturedState = location.state;
      return null;
    };

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path={AppRoute.Auth} element={<StateCapture />} />
          <Route
            path="/protected"
            element={
              <PrivateRoute isAuth={false}>
                <div>Secret</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(capturedState).toHaveProperty('from.pathname', '/protected');
  });
});
