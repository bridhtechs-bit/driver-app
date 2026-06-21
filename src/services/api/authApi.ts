import { rootApi } from '@/services/api/rootApi';

export const authApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;
