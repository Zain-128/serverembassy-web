import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";
import { getApiUrl } from "@/lib/api/config";
import { setCredentials, setCustomer, logout, type CustomerProfile } from "./authSlice";

type AuthResponse = { token: string; user: CustomerProfile };

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${getApiUrl()}/api/auth`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithLogout: BaseQueryFn<string | FetchArgs> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && (args as FetchArgs).url !== "/customer/login") {
    api.dispatch(logout());
  }
  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["Auth", "CustomerOrders"],
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, Partial<CustomerProfile> & { password: string }>({
      query: (body) => ({ url: "/register", method: "POST", body }),
      transformResponse: (res: AuthResponse) => res,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ token: data.token, customer: data.user }));
      },
    }),
    customerLogin: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/customer/login", method: "POST", body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ token: data.token, customer: data.user }));
      },
    }),
    getMe: builder.query<CustomerProfile, void>({
      query: () => "/customer/me",
      transformResponse: (res: CustomerProfile) => res,
      providesTags: ["Auth"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCustomer(data));
        } catch {
          /* token invalid — session handled on 401 logout below */
        }
      },
    }),
    logout: builder.mutation<void, void>({
      queryFn: () => ({ data: undefined as void }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(logout());
      },
    }),
  }),
});

export const { useRegisterMutation, useCustomerLoginMutation, useGetMeQuery, useLogoutMutation } =
  authApi;
