import Button from "@/components/atoms/Button";
import InputForm from "@/components/molecule/InputForm";
import React, { useRef } from "react";
import useRegister from "@/hooks/useRegister";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Register = () => {
  const { formData, error, showPassword, handleChange, handleSubmit, setShowPassword } = useRegister();
  const modalRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");

      if (token) {
        router.push("/");
      }
    }
  }, [router]);

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.style.display = "none";
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
        <InputForm label="Username" name="username" type="text" placeholder="Masukkan username" value={formData.username} onChange={handleChange} />
        <InputForm label="Email" name="email" type="email" placeholder="Masukkan email" value={formData.email} onChange={handleChange} />
        <InputForm label="Password" name="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" value={formData.password} onChange={handleChange} />
        <InputForm label="Konfirmasi Password" name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Masukkan ulang password" value={formData.confirmPassword} onChange={handleChange} />

        <div className="flex items-center mt-2">
          <input type="checkbox" id="showPassword" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="mr-2" />
          <label htmlFor="showPassword" className="text-sm text-gray-600">
            Show Password
          </label>
        </div>

        <Button buttonClassname="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 hover:from-fuchsia-600 hover:via-pink-600 hover:to-purple-600 text-white w-full mt-4" type="submit">
          Register
        </Button>

        {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}
      </form>

      {/* Modal Sukses */}
      <div ref={modalRef} className="fixed inset-0 hidden items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
          <h2 className="text-2xl font-semibold text-green-600">Registrasi Berhasil!</h2>
          <p className="mt-2 text-gray-600">Akun Anda telah berhasil dibuat.</p>
          <Button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
