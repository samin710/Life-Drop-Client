import React from "react";
import useAuth from "../../../Hooks/useAuth";
import RecentDonationRequests from "./RecentDonationRequests";
import useAxios from "../../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading/Loading";

const DonorDashboard = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();

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
          Welcome, {user?.displayName || "Donor"}!
        </h1>
        <p className="text-lg mt-2">
          Thank you for being a hero! Explore your dashboard to manage your
          profile, donation activity, and more.
        </p>
      </div>

      {requests.length > 0 && <RecentDonationRequests requests={requests} refetch={refetch} />}

      {/* Placeholder for future components */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Example Cards - Replace these later */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Upcoming Donations
          </h2>
          <p className="text-gray-600">
            You don’t have any upcoming donations. Stay tuned!
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Donation History
          </h2>
          <p className="text-gray-600">
            Check your previous blood donations and records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
