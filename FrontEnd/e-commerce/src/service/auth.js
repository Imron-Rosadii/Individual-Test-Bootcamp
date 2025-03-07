import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_AUTH;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/customer/register`, userData, {
      validateStatus: (status) => status < 500,
    });

    if (response.status === 409) {
      return { error: "Username sudah digunakan. Silakan coba yang lain." };
    }

    return response.data;
  } catch {
    throw new Error("Gagal menghubungi server. Periksa koneksi internet Anda.");
  }
};

export const login = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/api/customer/login`, payload, {
      validateStatus: (status) => status < 500,
    });

    if (response.status === 200 && response.data.data) {
      const token = response.data.data;
      localStorage.setItem("token", token);
      return { status: true, token };
    } else if (response.status === 404) {
      return { status: false, message: "User tidak ditemukan" };
    } else if (response.status === 401) {
      return { status: false, message: "Password salah" };
    }

    return { status: false, message: response.data.data || "Login gagal, coba lagi." };
  } catch {
    return { status: false, message: "Terjadi kesalahan pada server." };
  }
};

export function getCurrentUser(token) {
  return jwtDecode(token).sub;
}

export const logoutUser = () => {
  localStorage.removeItem("token");
};
