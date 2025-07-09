import { createBrowserRouter } from "react-router";
import RootLayout from "../LayOuts/RootLayout";
import AuthLayout from "../LayOuts/AuthLayout";
import SignUp from "../pages/Authentication/SignUp/SignUp";
import Home from "../pages/Home/Home";
import SignIn from "../pages/Authentication/SignIn/SignIn";
import DashboardLayout from "../LayOuts/DashboardLayout";
import ProfilePage from "../pages/Dashboard/ProfilePage/ProfilePage";
import PrivateRoute from "../routes/PrivateRoute";
import DonorDashboard from "../pages/Dashboard/DonorDashboard/DonorDashboard";
import CreateDonationRequest from "../pages/Dashboard/DonorDashboard/CreateDonationRequest";

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
      {
        path: "signIn",
        Component: SignIn,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DonorDashboard,
      },
      {
        path: "profile",
        Component: ProfilePage,
      },
      {
        path: "create-donation-request",
        Component: CreateDonationRequest,
      },
    ],
  },
]);
