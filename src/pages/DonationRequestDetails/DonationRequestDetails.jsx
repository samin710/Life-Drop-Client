import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Dialog } from "@headlessui/react";
import useAuth from "../../Hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAxios from "../../Hooks/useAxios";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const {
    data: request,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["donation-request", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-requests/${id}`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return axiosInstance.patch(`/donation-requests/${id}`, {
        status: "inprogress",
        donor: {
          name: user.displayName,
          email: user.email,
        },
      });
    },
    onSuccess: () => {
      Swal.fire("Success", "You have confirmed to donate", "success");
      queryClient.invalidateQueries({ queryKey: ["donation-request", id] });
      setIsOpen(false);
    },
    onError: () => {
      Swal.fire("Error", "Something went wrong", "error");
    },
  });

  const formatTime = (timeStr) =>
    new Date(`1970-01-01T${timeStr}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  if (isLoading)
    return (
      <div className="text-center py-20">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  if (isError)
    return <p className="text-center text-red-500">Failed to load request.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-primary hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <h2 className="text-2xl font-semibold text-red-600 mb-4">
        Donation Request Details
      </h2>

      <div className="space-y-3 text-gray-700">
        <p>
          <strong>Recipient Name:</strong> {request.recipientName}
        </p>
        <p>
          <strong>Blood Group:</strong> {request.bloodGroup}
        </p>
        <p>
          <strong>District:</strong> {request.recipientDistrict}
        </p>
        <p>
          <strong>Upazila:</strong> {request.recipientUpazila}
        </p>
        <p>
          <strong>Hospital Name:</strong> {request.hospitalName}
        </p>
        <p>
          <strong>Hospital Address:</strong> {request.fullAddress}
        </p>
        <p>
          <strong>Date:</strong> {request.donationDate}
        </p>
        <p>
          <strong>Time:</strong> {formatTime(request.donationTime)}
        </p>
        <p>
          <strong>Message:</strong> {request.requestMessage}
        </p>
        <p>
          <strong>Status:</strong> {request.status}
        </p>
      </div>

      {request.status === "pending" && (
        <div className="mt-6">
          <button onClick={() => setIsOpen(true)} className="btn btn-primary">
            Donate
          </button>
        </div>
      )}

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow">
            <Dialog.Title className="text-lg font-bold mb-4">
              Confirm Donation
            </Dialog.Title>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Donor Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={user.displayName}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Donor Email
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={user.email}
                  readOnly
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? "Submitting..." : "Confirm"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default DonationRequestDetails;
