import Link from "next/link";
import React from "react";

const AuthLayout = ({ title, desc, children, type = "register" }) => {
  return (
    <>
      <div className="rounded-lg  w-full h-full flex items-center justify-center ">
        <div className="w-full  max-w-lg border rounded-lg p-8 bg-white">
          <h1 className="text-3xl font-bold mb-2 text-center text-fuchsia-500 ">{title}</h1>
          <p className="font-medium text-center text-slate-500 mb-4">{desc} </p>
          {children}

          {type === "register" ? (
            <p className="text-sm text-center mt-2">
              Dont have an account?{" "}
              <Link className="text-fuchsia-500 hover:text-fuchsia-700" href="/login">
                Login
              </Link>
            </p>
          ) : (
            <p className="text-sm text-center mt-2">
              Already have an account?{" "}
              <Link className="text-fuchsia-500 hover:text-fuchsia-700" href="/register">
                Register
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
