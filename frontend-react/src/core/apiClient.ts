import { environment } from './env';

const ACCESS_TOKEN_KEY = 'sysmicon_access_token';
const REFRESH_TOKEN_KEY = 'sysmicon_refresh_token';
const USER_KEY = 'sysmicon_user';

export interface SubscribeObserver<T> {
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
}

export class ApiObservable<T> {
  constructor(private executor: () => Promise<T>) {}

  toPromise(): Promise<T> {
    return this.executor();
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.executor().then(onfulfilled, onrejected);
  }

  subscribe(observerOrNext?: SubscribeObserver<T> | ((value: T) => void)): { unsubscribe: () => void } {
    let cancelled = false;
    const obs: SubscribeObserver<T> =
      typeof observerOrNext === 'function' ? { next: observerOrNext } : observerOrNext || {};

    this.executor()
      .then((res) => {
        if (!cancelled) {
          obs.next?.(res);
          obs.complete?.();
        }
      })
      .catch((err) => {
        if (!cancelled) {
          obs.error?.(err);
        }
      });

    return {
      unsubscribe: () => {
        cancelled = true;
      },
    };
  }

  pipe(...operators: Array<(obs: ApiObservable<any>) => ApiObservable<any>>): ApiObservable<any> {
    return operators.reduce((acc, op) => op(acc), this as ApiObservable<any>);
  }
}

export function tap<T>(fn: (val: T) => void) {
  return (source: ApiObservable<T>): ApiObservable<T> =>
    new ApiObservable<T>(async () => {
      const res = await source.toPromise();
      fn(res);
      return res;
    });
}

let isRefreshing = false;
let refreshWaiters: Array<(token: string | null) => void> = [];

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshWaiters.push(resolve);
    });
  }

  isRefreshing = true;
  try {
    const resp = await fetch(`${environment.apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data = await resp.json();
    if (resp.ok && data?.success && data?.data?.access_token) {
      const newToken = data.data.access_token;
      localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
      refreshWaiters.forEach((w) => w(newToken));
      refreshWaiters = [];
      isRefreshing = false;
      return newToken;
    }
    throw new Error('Refresh failed');
  } catch {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    refreshWaiters.forEach((w) => w(null));
    refreshWaiters = [];
    isRefreshing = false;
    window.dispatchEvent(new CustomEvent('sysmicon-auth-logout'));
    return null;
  }
}

async function rawRequest<T>(
  method: string,
  url: string,
  body?: any,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  let fullUrl = url.startsWith('http') || url.startsWith('/') && !url.startsWith(environment.apiUrl)
    ? url
    : url;

  if (params) {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) usp.set(k, String(v));
    });
    const qs = usp.toString();
    if (qs) fullUrl += (fullUrl.includes('?') ? '&' : '?') + qs;
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  const makeHeaders = (t: string | null): HeadersInit => {
    const h: Record<string, string> = {};
    if (!isFormData && body !== undefined) {
      h['Content-Type'] = 'application/json';
    }
    if (t) {
      h['Authorization'] = `Bearer ${t}`;
    }
    return h;
  };

  let response = await fetch(fullUrl, {
    method,
    headers: makeHeaders(token),
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && localStorage.getItem(REFRESH_TOKEN_KEY) && !fullUrl.includes('/auth/login') && !fullUrl.includes('/auth/refresh')) {
    const newToken = await tryRefreshToken();
    if (newToken) {
      response = await fetch(fullUrl, {
        method,
        headers: makeHeaders(newToken),
        body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      });
    }
  }

  let parsed: any = null;
  const text = await response.text();
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!response.ok) {
    const err: any = new Error(parsed?.error || parsed?.message || `HTTP Error ${response.status}`);
    err.status = response.status;
    err.error = parsed;
    throw err;
  }

  return parsed as T;
}

export const httpClient = {
  get<T = any>(url: string, options?: { params?: Record<string, any> }): ApiObservable<T> {
    return new ApiObservable<T>(() => rawRequest<T>('GET', url, undefined, options?.params));
  },
  post<T = any>(url: string, body?: any): ApiObservable<T> {
    return new ApiObservable<T>(() => rawRequest<T>('POST', url, body));
  },
  put<T = any>(url: string, body?: any): ApiObservable<T> {
    return new ApiObservable<T>(() => rawRequest<T>('PUT', url, body));
  },
  patch<T = any>(url: string, body?: any): ApiObservable<T> {
    return new ApiObservable<T>(() => rawRequest<T>('PATCH', url, body));
  },
  delete<T = any>(url: string): ApiObservable<T> {
    return new ApiObservable<T>(() => rawRequest<T>('DELETE', url));
  },
};
