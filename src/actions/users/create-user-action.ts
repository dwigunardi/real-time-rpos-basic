'use client';

import { encrypt, decrypt, type EncryptedPayload } from '@/lib/crypto';
import type { ApiError } from '@/lib/api/fetcher';
import { CreateUserInput } from '@/types/user';

export async function createUserAction(payload: CreateUserInput): Promise<{ status: string }> {
  const cipher = encrypt(JSON.stringify(payload));

  const res = await fetch('/api/users/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cipher }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      body?.message ||
      body?.error ||
      (res.status === 401 ? 'Unauthorized' : 'Failed to create user');

    const err: ApiError = { message, status: res.status };
    throw err;
  }

  const cipherResp = body.cipher as EncryptedPayload;
  const plaintext = decrypt(cipherResp);
  const parsed = JSON.parse(plaintext) as { status: string };

  return parsed;
}