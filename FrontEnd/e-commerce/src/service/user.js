import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_AUTH;

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/customer/id/${userId}`);
    console.log(response);

    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch {
    return null;
  }
};

export const fetchUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/customer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateUserRole = async (userId, newRole, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/customer/${userId}/role?newRole=${newRole}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const deleteUser = async (userId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/api/customer/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
