import React from "react";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="min-h-screen max-w-11/12 md:max-w-10/11 mx-auto">
      <h1>Root Layout</h1>
      <Outlet></Outlet>
    </div>
  );
};

export default RootLayout;
