import Register from "@/components/organism/Register";
import AuthLayout from "@/components/templates/AuthLayout";
import React from "react";

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#5cee80] pt-10 py-10">
      <AuthLayout title={"Register"} desc={"Hi, Please Register to your account"} type="register">
        <Register />
      </AuthLayout>
    </div>
  );
};

export default RegisterPage;
