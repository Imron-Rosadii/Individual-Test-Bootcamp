import Login from "@/components/organism/Login";
import AuthLayout from "@/components/templates/AuthLayout";
import React from "react";

const LoginPage = () => {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-[#5cee80]">
        <AuthLayout title={"Login"} desc={"Hi, Please Login to your account"} type="login">
          <Login />
        </AuthLayout>
      </div>
    </>
  );
};

export default LoginPage;
