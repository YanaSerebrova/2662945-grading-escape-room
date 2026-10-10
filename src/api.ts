import { API_URL } from './constants/api';

export const AppRoute = {
  Root: '/',
  Contacts: '/contacts',
  Auth: '/login',
  Quest: '/quest/:id',
  Booking: '/quest/:id/booking',
  MyQuests: '/my-quests',
  NotFound: '*',
} as const;

export const TokenKey = 'escape-room-token';
export const EmailKey = 'escape-room-email';

const getToken = (): string | null => localStorage.getItem(TokenKey);

type FetchApiOptions = RequestInit & {
  requireAuth?: boolean;
};

export async function fetchApi<T>(
  endpoint: string,
  options: FetchApiOptions = {},
): Promise<T> {
  const { requireAuth = false, headers: customHeaders, ...rest } = options;

  const headers = new Headers(customHeaders);

  if (requireAuth) {
    const token = getToken();
    if (!token) {
      throw new Error('Требуется авторизация');
    }
    headers.set('X-Token', token);
  }

  if (!headers.has('Content-Type') && rest.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `Ошибка запроса: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return (await response.json()) as T;
}
