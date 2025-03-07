import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "@/redux/Cart/cartSlice";
export const store = configureStore({
  reducer: {
    cart: cartSlice,
  },
});

export default store;
