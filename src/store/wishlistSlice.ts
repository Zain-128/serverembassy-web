import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type WishlistState = {
  items: string[]; // array of product IDs
  hydrated: boolean;
};

const initialState: WishlistState = {
  items: [],
  hydrated: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    hydrateWishlist(state, action: PayloadAction<string[]>) {
      state.items = action.payload;
      state.hydrated = true;
    },
    toggleWishlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.items.includes(id)) {
        state.items = state.items.filter((item) => item !== id);
      } else {
        state.items.push(id);
      }
    },
    addWishlist(state, action: PayloadAction<string>) {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },
    removeWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { hydrateWishlist, toggleWishlist, addWishlist, removeWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
