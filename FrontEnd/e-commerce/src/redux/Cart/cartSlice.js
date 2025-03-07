import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      if (!product || !product.id) return;

      const existingProductIndex = state.data.findIndex((item) => item.id === product.id);

      if (existingProductIndex !== -1) {
        // Jika produk sudah ada, buat array baru dengan qty yang diperbarui
        state.data = state.data.map((item, index) => (index === existingProductIndex ? { ...item, qty: item.qty + 1 } : item));
      } else {
        // Jika produk belum ada, tambahkan ke array
        state.data = [...state.data, { ...product, qty: 1 }];
      }
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.data = state.data.map((item) => (item.id === productId ? { ...item, qty: item.qty - 1 } : item)).filter((item) => item.qty > 0); // Hapus produk jika qty = 0
    },

    setCartData: (state, action) => {
      state.data = action.payload;
    },
    clearCart: (state) => {
      state.data = [];
    },
  },
});

export const { addToCart, removeFromCart, setCartData, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
