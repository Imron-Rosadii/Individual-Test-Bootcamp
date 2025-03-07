import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getCurrentUser } from "@/service/auth";

export const useProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [modalType, setModalType] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [alertShown, setAlertShown] = useState(false); // Tambahkan state

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");

      if (!token && !alertShown) {
        // Cek apakah alert sudah ditampilkan
        alert("Anda harus login terlebih dahulu");
        setAlertShown(true); // Set agar alert tidak muncul lagi
        router.push("/login");
      } else if (token) {
        setIsAuthenticated(true);
        const sessionUser = getCurrentUser(token);
        setUser(sessionUser);
      }
    }
  }, [router, alertShown]); // Tambahkan alertShown sebagai dependency

  useEffect(() => {
    if (user) {
      fetchUserData(user);
    }
  }, [user]);

  const fetchUserData = async (user) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/customer/id/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setUserData(response.data);
      } else {
        console.error("User tidak ditemukan.");
      }
    } catch (error) {
      console.error("Gagal fetching data user:", error);
    }
  };

  return {
    userData,
    modalType,
    setModalType,
    inputValue,
    setInputValue,
    showModal,
    setShowModal,
    fetchUserData,
  };
};
