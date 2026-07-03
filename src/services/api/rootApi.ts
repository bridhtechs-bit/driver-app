import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const rootApi = createApi({
  reducerPath: 'rootApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Auth', 'Driver', 'Delivery'],
  endpoints: () => ({}),
});
