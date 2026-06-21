import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/services/api/baseApi';

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Auth', 'Driver', 'Delivery'],
  endpoints: () => ({}),
});
