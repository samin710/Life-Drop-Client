import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar/Navbar";

const RootLayout = () => {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar></Navbar>
      </div>
      <div className="min-h-screen max-w-11/12 md:max-w-10/11 mx-auto">
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default RootLayout;
