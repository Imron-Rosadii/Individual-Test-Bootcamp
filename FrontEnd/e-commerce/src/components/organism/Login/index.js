import Button from "@/components/atoms/Button";
import InputForm from "@/components/molecule/InputForm";
import { useLogin } from "@/hooks/useLogin";
import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Login = () => {
  const { errorLogin, showPassword, setShowPassword, handleLogin } = useLogin();

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");

      if (token) {
        router.push("/");
      }
    }
  }, [router]);

  return (
    <>
      <form onSubmit={handleLogin}>
        <InputForm label="Username" name="username" type="text" placeholder="Masukan username" />
        <InputForm label="Password" name="password" type={showPassword ? "text" : "password"} placeholder="Masukan password" />
        <div className="flex items-center mt-2">
          <input type="checkbox" id="showPassword" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="mr-2" />
          <label htmlFor="showPassword" className="text-sm text-gray-600">
            Show Password
          </label>
        </div>
        <Button buttonClassname="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 hover:from-fuchsia-600 hover:via-pink-600 hover:to-purple-600 text-white w-full mt-4" type="submit">
          Login
        </Button>
        {errorLogin && <p className="text-red-500 text-center text-sm mt-4">{errorLogin}</p>}
      </form>
    </>
  );
};

export default Login;
