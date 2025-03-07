import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const addToCartAPI = async (product, token) => {
  if (!product || typeof product !== "object") {
    throw new Error("Produk tidak valid");
  }

  const payload = {
    productId: product.id,
    quantity: product.qty ?? 1,
  };

  try {
    const response = await axios.post(`${BASE_URL}/cart`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal menambahkan produk ke keranjang.");
  }
};

export const deleteFromCartAPI = async (productId, token) => {
  if (!productId) {
    throw new Error("Produk ID tidak valid");
  }

  try {
    const response = await axios.delete(`${BASE_URL}/cart/id/${encodeURIComponent(productId)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Tidak dapat menghapus produk dari keranjang.");
  }
};

export const checkoutCartToAPI = async (userData, token) => {
  if (!userData || typeof userData !== "object") {
    throw new Error("Data pengguna tidak valid");
  }

  try {
    const response = await axios.post(`${BASE_URL}/orders/checkout`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal melakukan checkout.");
  }
};
