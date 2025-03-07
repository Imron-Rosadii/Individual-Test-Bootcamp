import { useState } from "react";
import { login } from "@/service/auth";
import { useRouter } from "next/router";

export const useLogin = () => {
  const [errorLogin, setErrorLogin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorLogin(null);

    const payload = {
      username: event.target.username.value.trim(),
      password: event.target.password.value.trim(),
    };

    if (!payload.username || !payload.password) {
      setErrorLogin("Username dan password tidak boleh kosong.");
      return;
    }

    try {
      const res = await login(payload);

      if (res.status === true && res.token) {
        localStorage.setItem("token", res.token);
        sessionStorage.setItem("token", res.token);
        router.push("/");
      } else {
        setErrorLogin(res.message || "Login gagal, coba lagi.");
      }
    } catch (error) {
      setErrorLogin(error.response?.data?.message || "Terjadi kesalahan pada server.");
    }
  };

  return { errorLogin, showPassword, setShowPassword, handleLogin };
};
