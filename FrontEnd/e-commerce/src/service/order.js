import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

export const fetchOrders = async (token, status = "") => {
  try {
    const response = await axios.get(`${API_URL}?status=${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${orderId}/update-status`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const fetchOrderDetail = async (orderId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Mengembalikan detail order
  } catch (error) {
    console.error("Error fetching order detail:", error);
    return null;
  }
};
