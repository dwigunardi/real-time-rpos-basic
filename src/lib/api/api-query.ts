'use client';

import { useEffect } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
  type QueryKey,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiError } from './fetcher';

type BaseOptions<TData> = Omit<
  UseQueryOptions<TData, ApiError, TData, QueryKey>,
  'queryKey' | 'queryFn'
>;

type ExtraOptions = {
  /** matikan toast otomatis jika mau handle sendiri */
  disableToast?: boolean;
  /** dipanggil kalau unauthorized (401) */
  onUnauthorized?: () => void;
};

type UseApiQueryOptions<TData> = BaseOptions<TData> & ExtraOptions;

export function useApiQuery<TData>(
  key: QueryKey,
  queryFn: () => Promise<TData>,
  options?: UseApiQueryOptions<TData>,
): UseQueryResult<TData, ApiError> {
  const { disableToast, onUnauthorized, ...queryOptions } = options || {};

  const result = useQuery<TData, ApiError>({
    queryKey: key,
    queryFn,
    ...queryOptions,
  });

  const { isError, error } = result;

  useEffect(() => {
    if (!isError || !error) return;

    // unauthorized handler khusus
    if (error.status === 401 && onUnauthorized) {
      onUnauthorized();
    }

    if (!disableToast) {
      toast.error('Failed to fetch data', {
        description: error.message,
      });
    }
  }, [isError, error, disableToast, onUnauthorized]);

  return result;
}