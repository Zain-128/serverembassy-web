import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartLine = {
  productId: string;
  qty: number;
};

type CartState = {
  items: CartLine[];
  hydrated: boolean;
};

const initialState: CartState = {
  items: [],
  hydrated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartLine[]>) {
      state.items = action.payload;
      state.hydrated = true;
    },
    addItem(state, action: PayloadAction<{ productId: string; qty?: number }>) {
      const qty = action.payload.qty ?? 1;
      const found = state.items.find((line) => line.productId === action.payload.productId);
      if (found) found.qty += qty;
      else state.items.push({ productId: action.payload.productId, qty });
    },
    setItemQty(state, action: PayloadAction<{ productId: string; qty: number }>) {
      if (action.payload.qty <= 0) {
        state.items = state.items.filter((line) => line.productId !== action.payload.productId);
        return;
      }
      const found = state.items.find((line) => line.productId === action.payload.productId);
      if (found) found.qty = action.payload.qty;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((line) => line.productId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { hydrateCart, addItem, setItemQty, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
