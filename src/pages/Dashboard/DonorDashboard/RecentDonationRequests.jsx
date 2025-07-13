import React from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";
import { Link, useNavigate } from "react-router";

const RecentDonationRequests = ({ requests, refetch }) => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  // Handle Status Change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/donation-requests/${id}`, {
        status: newStatus,
      });
      Swal.fire("Updated", "Donation status updated", "success");
      refetch();
    } catch {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // Handle Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this donation request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/donation-requests/${id}`);
          Swal.fire(
            "Deleted!",
            "Your donation request has been deleted.",
            "success"
          );
          refetch();
        } catch {
          Swal.fire("Error", "Failed to delete", "error");
        }
      }
    });
  };

  // if (isLoading) return <Loading />;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-10">
      <h3 className="text-xl font-semibold text-red-600 mb-4">
        My Recent Donation Requests
      </h3>

      <div className="overflow-x-auto">
        <table className="table">
          <thead className="bg-gray-100">
            <tr>
              <th>Recipient Name</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Blood Group</th>
              <th>Status</th>
              <th>Donor Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No donation requests found.
                </td>
              </tr>
            ) : (
              requests.map((item) => (
                <tr key={item._id}>
                  <td>{item.recipientName}</td>
                  <td>
                    {item.recipientDistrict}, {item.recipientUpazila}
                  </td>
                  <td>{item.donationDate}</td>
                  <td>{item.donationTime}</td>
                  <td>{item.bloodGroup}</td>
                  <td className="capitalize">{item.status}</td>
                  <td>
                    {item.status === "inprogress" ? (
                      <>
                        <p>{item.donor.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.donor.email}
                        </p>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="space-x-1">
                    {item.status === "inprogress" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(item._id, "done")}
                          className="btn btn-xs btn-success"
                        >
                          Done
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(item._id, "canceled")
                          }
                          className="btn btn-xs btn-error"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() =>
                        navigate(`/dashboard/edit-request/${item._id}`)
                      }
                      className="btn btn-xs btn-warning"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-xs btn-outline btn-error"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/dashboard/request-details/${item._id}`)
                      }
                      className="btn btn-xs btn-info"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-right mt-4">
        <Link
          to="/dashboard/my-donation-requests"
          className="btn btn-sm btn-primary"
        >
          View My All Requests
        </Link>
      </div>
    </div>
  );
};

export default RecentDonationRequests;
