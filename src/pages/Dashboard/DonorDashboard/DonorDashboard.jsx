import React from "react";
import useAuth from "../../../Hooks/useAuth";
import RecentDonationRequests from "./RecentDonationRequests";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading/Loading";
import useUserRole from "../../../Hooks/useUserRole";
import StatisticsCards from "../AdminDashboard/StatisticsCards";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import dashBannerBG from "../../../assets/dashboaard_banner.png";
import AdminDashboardDonationChart from "../AdminDashboard/AdminDashboardDonationChart";
import AdminDashboardBloodGroupChart from "../AdminDashboard/AdminDashboardBloodGroupChart";

const DonorDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { role, roleLoading } = useUserRole();

  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["recent-donation-requests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests/limit?requesterEmail=${user.email}&limit=3`
      );
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      {/* Welcome Section */}
      <div
        className="bg-cover bg-center text-white rounded-xl shadow-lg p-6 md:p-10 mb-8 h-90"
        style={{ backgroundImage: `url(${dashBannerBG})` }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome, {user?.displayName || "Donor"}!{" "}
          <span className="capitalize">{role}</span>
        </h1>
        <p className="text-lg mt-2 max-w-xl">
          Thank you for being a hero! Explore your dashboard to manage your
          profile, donation activity, and more.
        </p>
      </div>

      {requests.length > 0 && !roleLoading && role === "donor" && (
        <RecentDonationRequests requests={requests} refetch={refetch} />
      )}
      {!roleLoading && (role === "admin" || role === "volunteer") && (
        <StatisticsCards></StatisticsCards>
      )}
      {!roleLoading && role === "admin" && (
        <>
          {" "}
          <AdminDashboardDonationChart></AdminDashboardDonationChart>
          <AdminDashboardBloodGroupChart></AdminDashboardBloodGroupChart>
        </>
      )}
    </div>
  );
};

export default DonorDashboard;
