export type ApiError = {
  message: string;
  status?: number;
};

export async function apiGet<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err: ApiError = {
      message:
        body?.message ||
        body?.error ||
        (res.status === 401
          ? 'Unauthorized'
          : 'Failed to fetch data'),
      status: res.status,
    };
    throw err;
  }

  return body as T;
}