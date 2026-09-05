import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const TOKEN_KEY = "se-customer-token";

export type CustomerProfile = {
  id: string;
  email: string;
  fullName: string;
  company?: string;
  phone?: string;
  taxExempt: string;
  netTermsEnabled: boolean;
};

type AuthState = {
  token: string | null;
  customer: CustomerProfile | null;
  hydrated: boolean;
};

function readToken(): string | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  token: readToken(),
  customer: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; customer: CustomerProfile }>) {
      state.token = action.payload.token;
      state.customer = action.payload.customer;
      state.hydrated = true;
      try {
        localStorage.setItem(TOKEN_KEY, action.payload.token);
      } catch {
        /* ignore */
      }
    },
    setCustomer(state, action: PayloadAction<CustomerProfile>) {
      state.customer = action.payload;
    },
    markHydrated(state) {
      state.hydrated = true;
    },
    logout(state) {
      state.token = null;
      state.customer = null;
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        /* ignore */
      }
    },
  },
});

export const { setCredentials, setCustomer, markHydrated, logout } = authSlice.actions;
export default authSlice.reducer;
