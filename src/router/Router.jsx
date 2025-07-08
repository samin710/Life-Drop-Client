import { createBrowserRouter } from "react-router";
import RootLayout from "../LayOuts/RootLayout";
import AuthLayout from "../LayOuts/AuthLayout";
import SignUp from "../pages/Authentication/SignUp/SignUp";
import Home from "../pages/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "signUp",
        Component: SignUp,
      },
    ],
  },
]);
