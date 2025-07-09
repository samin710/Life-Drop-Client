import React from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-screen max-w-11/12 md:max-w-10/11 mx-auto">
      <Outlet></Outlet>
    </div>
  );
};

export default AuthLayout;
