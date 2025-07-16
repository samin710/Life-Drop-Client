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
import MyDonationRequests from "../pages/Dashboard/DonorDashboard/MyDonationRequests";
import EditRequestPage from "../pages/Dashboard/DonorDashboard/EditRequestPage";
import AllUsersPage from "../pages/Dashboard/AdminDashboard/AllUsersPage";
import AllBloodDonationRequest from "../pages/Dashboard/AdminDashboard/AllBloodDonationRequest";
import ContentManagement from "../pages/Dashboard/AdminDashboard/ContentManagement";
import AddBlogPage from "../pages/Dashboard/AdminDashboard/AddBlogPage";
import EditBlogPage from "../pages/Dashboard/AdminDashboard/EditBlogPage";
import SearchDonorsPage from "../pages/SearchDonorsPage/SearchDonorsPage";
import DonationRequestsPage from "../pages/DonationRequestsPage/DonationRequestsPage";
import DonationRequestDetails from "../pages/DonationRequestDetails/DonationRequestDetails";
import BlogPage from "../pages/BlogPage/BlogPage";
import BlogDetails from "../pages/BlogDetails/BlogDetails";
import FundingPage from "../pages/FundingPage/FundingPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "search-page",
        Component: SearchDonorsPage,
      },
      {
        path: "donation-request",
        Component: DonationRequestsPage,
      },
      {
        path: "donation-requests/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails></DonationRequestDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "blogs",
        Component: BlogPage,
      },
      {
        path: "blog-details/:id",
        Component: BlogDetails,
      },
      {
        path: "funding-page",
        element: (
          <PrivateRoute>
            <FundingPage></FundingPage>
          </PrivateRoute>
        ),
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
      {
        path: "my-donation-requests",
        Component: MyDonationRequests,
      },
      {
        path: "edit-request/:id",
        Component: EditRequestPage,
      },
      {
        path: "all-users",
        Component: AllUsersPage,
      },
      {
        path: "all-blood-donation-request",
        Component: AllBloodDonationRequest,
      },
      {
        path: "content-management",
        Component: ContentManagement,
      },
      {
        path: "content-management/add-blog",
        Component: AddBlogPage,
      },
      {
        path: "edit-blog/:id",
        Component: EditBlogPage,
      },
      {
        path: "request-details/:id",
        Component: DonationRequestDetails,
      },
    ],
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);
