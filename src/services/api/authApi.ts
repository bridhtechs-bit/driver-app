import { rootApi } from "./rootApi";

import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ProfileResponse,
} from "@/types/auth";

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        data: {
          ...body,
          role: "customer",
        },
      }),
      invalidatesTags: ["Auth"],
    }),

    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/auth/me",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
} = authApi;