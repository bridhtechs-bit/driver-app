import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import axiosClient from './axiosClient';

export type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: unknown;
  params?: unknown;
};

export const axiosBaseQuery: BaseQueryFn<AxiosBaseQueryArgs, unknown, { status: number; data: unknown }> = async (
  { url, method = 'GET', data, params }
) => {
  try {
    const result = await axiosClient({ url, method, data, params });
    return { data: result.data };
  } catch (axiosError) {
    const error = axiosError as AxiosError;
    return {
      error: {
        status: error.response?.status ?? 500,
        data: error.response?.data ?? error.message,
      },
    };
  }
};
