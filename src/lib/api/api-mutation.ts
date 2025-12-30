'use client';

import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiError } from './fetcher';

type ExtraOptions = {
  disableToast?: boolean;
  onUnauthorized?: () => void;
};

type UseApiMutationOptions<TData, TVariables> = UseMutationOptions<TData, ApiError, TVariables> & ExtraOptions;

export function useApiMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseApiMutationOptions<TData, TVariables>,
): UseMutationResult<TData, ApiError, TVariables> {
  const { disableToast, onUnauthorized, ...mutationOptions } = options || {};

  const result = useMutation<TData, ApiError, TVariables>({
    mutationFn,
    onError: (error) => {
      console.log("error => ", error)
      if (error.status === 401 && onUnauthorized) {
        onUnauthorized();
      }

      if (!disableToast) {
        toast.error('Operation failed', {
          description: error.message,
        });
      }
    },
    ...mutationOptions,
  });

  return result;
}