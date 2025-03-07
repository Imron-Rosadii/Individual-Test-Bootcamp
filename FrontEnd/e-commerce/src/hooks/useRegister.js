import { useState } from "react";
import { registerUser } from "@/service/auth";
import { useRouter } from "next/router";

const useRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Fungsi menangani perubahan input
  const handleChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  // Fungsi validasi form
  const validateForm = () => {
    if (!formData.username || formData.username.length < 4) {
      return "Username minimal 4 karakter";
    }
    if (!formData.email.includes("@")) {
      return "Email tidak valid";
    }
    if (!formData.password || formData.password.length < 8) {
      return "Password minimal 8 karakter";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Password dan Konfirmasi Password harus sama";
    }
    return null;
  };

  // Fungsi untuk mengirim data ke server
  const submitForm = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await registerUser(formData);

      if (result?.error) {
        setError(result.error); // Tampilkan error di UI
        return; // Jangan lanjutkan ke alert sukses
      }

      alert("Registrasi berhasil!");
      router.push("/login");
    } catch (err) {
      console.error("❌ Error dari server:", err);
      setError("Terjadi kesalahan saat registrasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi utama handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    await submitForm();
  };

  return {
    formData,
    error,
    loading,
    showPassword,
    handleChange,
    handleSubmit,
    setShowPassword,
  };
};

export default useRegister;
