import React from "react";
import { useNavigate } from "react-router";
import { FaTint } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";
import useAxios from "../../Hooks/useAxios";
import { MapPin, Hospital, CalendarDays, Clock } from "lucide-react";

const DonationRequestsPage = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    data: requests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["donation-requests", "pending"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/donation-requests/status?status=pending"
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load donation requests.
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-center text-primary mb-8">
        Pending Blood Donation Requests
      </h1>

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="border border-secondary rounded-lg p-4 shadow-md shadow-secondary hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-2 text-primary font-semibold">
                <FaTint />
                <span>{req.bloodGroup}</span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-400 mb-1">
                {req.recipientName}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                {req.recipientUpazila}, {req.recipientDistrict}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                <Hospital className="w-4 h-4 text-primary" />
                {req.hospitalName}, {req.fullAddress}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                <CalendarDays className="w-4 h-4 text-primary" />
                {req.donationDate}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-1">
                <Clock className="w-4 h-4 text-primary" />
                {new Date(`1970-01-01T${req.donationTime}`).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              </p>

              <div className="text-right">
                <button
                  className="btn btn-sm btn-outline btn-primary"
                  onClick={() => navigate(`/donation-requests/${req._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No pending donation requests found.
        </p>
      )}
    </div>
  );
};

export default DonationRequestsPage;
