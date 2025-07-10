import React from "react";
import useAuth from "../../../Hooks/useAuth";
import RecentDonationRequests from "./RecentDonationRequests";
import useAxios from "../../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading/Loading";
import useUserRole from "../../../Hooks/useUserRole";
import StatisticsCards from "../AdminDashboard/StatisticsCards";

const DonorDashboard = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const { role, roleLoading } = useUserRole();

  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["recent-donation-requests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/donation-requests/limit?requesterEmail=${user.email}&limit=3`
      );
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 md:p-10">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg p-6 md:p-10 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome, {user?.displayName || "Donor"}! {role}
        </h1>
        <p className="text-lg mt-2">
          Thank you for being a hero! Explore your dashboard to manage your
          profile, donation activity, and more.
        </p>
      </div>

      {requests.length > 0 && !roleLoading && role === "donor" && (
        <RecentDonationRequests requests={requests} refetch={refetch} />
      )}
      {!roleLoading && role === "admin" && <StatisticsCards></StatisticsCards>}
    </div>
  );
};

export default DonorDashboard;
