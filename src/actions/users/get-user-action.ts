import { decrypt, type EncryptedPayload } from '@/lib/crypto';
import type { ApiError } from '@/lib/api/fetcher';
import { PaginatedParams } from '@/types/api-params/paginated-param';
import { UsersListResponse } from '@/types/api-response/users-response';

export async function fetchUsers({ limit, page, q }: PaginatedParams) : Promise<UsersListResponse> {
  let url = '/api/users';
  if (page && limit) {
    url += `?page=${page}&limit=${limit}`;
  }

  if (!page || !limit) {
    url += `?page=1&limit=10`;
  }

  if (q) {
    const search = q ?? '';
    url += `&q=${encodeURIComponent(search)}`;
  }

  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      body?.error ||
      (res.status === 401 ? 'Unauthorized' : 'Failed to fetch users');

    const err: ApiError = {
      message,
      status: res.status,
    };
    throw err;
  }

  // // body: { cipher: { salt, iv, ciphertext } }
  const cipher = body.cipher as EncryptedPayload;
  const plaintext = decrypt(cipher);
  const parsed = JSON.parse(plaintext) as UsersListResponse;

  return parsed;
}