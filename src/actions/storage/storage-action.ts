'use client';

import type { ApiError } from '@/lib/api/fetcher';

export type UploadResult = {
  status: 'success' | 'error';
  data: { url: string; path: string };
};

export async function uploadFile(params: {
  bucket: string;
  path: string;
  file: File;
  prevPath?: string;
}): Promise<UploadResult> {
    /** request body */
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('bucket', params.bucket);
  formData.append('path', params.path);
  if (params.prevPath) {
    formData.append('prevPath', params.prevPath);
  }

  const res = await fetch('/api/storage/upload', {
    method: 'POST',
    body: formData,
  });

  /** response body */
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      body?.message ||
      body?.error ||
      (res.status === 401 ? 'Unauthorized' : 'Failed to upload file');

    const err: ApiError = { message, status: res.status };
    throw err;
  }
/** response */
  return body as UploadResult;
}