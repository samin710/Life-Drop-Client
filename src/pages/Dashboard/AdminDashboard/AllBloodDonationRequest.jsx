import React, { useState } from "react";
import useAxios from "../../../Hooks/useAxios";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Loading from "../../../components/Loading/Loading";
import useUserRole from "../../../Hooks/useUserRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const statusOptions = ["all", "pending", "inprogress", "done", "canceled"];

const AllBloodDonationRequest = () => {
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { role, roleLoading } = useUserRole();

  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allDonationRequests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-requests");
      return res.data;
    },
  });

  // Filtered and paginated data
  const filteredData =
    filterStatus === "all"
      ? requests
      : requests.filter((item) => item.status === filterStatus);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-xl text-primary font-semibold mb-4">
        All Blood Donation Requests
      </h2>

      {/* Filter */}
      <div className="mb-4">
        <select
          className="select select-bordered"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status[0].toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-secondary rounded-md">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>Recipient</th>
              <th>Location</th>
              <th>Date </th>
              <th>Time</th>
              <th>Blood</th>
              <th>Status</th>
              <th>Donor Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No donation requests found.
                </td>
              </tr>
            ) : (
              currentData.map((item, index) => (
                <tr key={item._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                    {/* ✅ For large screens: show all buttons inline */}
                    <div className="hidden lg:flex flex-wrap gap-1">
                      {item.status === "inprogress" &&
                        !roleLoading &&
                        (role === "admin" || role === "volunteer") && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(item._id, "done")
                              }
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
                      {!roleLoading && role === "admin" && (
                        <>
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
                        </>
                      )}
                    </div>

                    {/* ✅ For smaller screens: show dropdown menu */}
                    <div
                      className={`dropdown dropdown-left lg:hidden ${
                        index >= currentData.length - 2
                          ? "dropdown-top"
                          : "dropdown-bottom"
                      }`}
                    >
                      {item.status === "inprogress" && (
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-xs btn-outline m-1"
                        >
                          Actions
                        </div>
                      )}

                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
                      >
                        {item.status === "inprogress" &&
                          !roleLoading &&
                          (role === "admin" || role === "volunteer") && (
                            <>
                              <li>
                                <button
                                  onClick={() =>
                                    handleStatusChange(item._id, "done")
                                  }
                                >
                                  ✅ Done
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() =>
                                    handleStatusChange(item._id, "canceled")
                                  }
                                >
                                  ❌ Cancel
                                </button>
                              </li>
                            </>
                          )}

                        {!roleLoading && role === "admin" && (
                          <>
                            <li>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/dashboard/edit-request/${item._id}`
                                  )
                                }
                              >
                                ✏️ Edit
                              </button>
                            </li>
                            <li>
                              <button onClick={() => handleDelete(item._id)}>
                                🗑️ Delete
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/dashboard/request-details/${item._id}`
                                  )
                                }
                              >
                                🔍 View
                              </button>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`btn btn-sm ${
              pageNum === currentPage ? "btn-primary" : "btn-ghost"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllBloodDonationRequest;
