import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MoreHorizontal,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import useAxios from "../../../Hooks/useAxios";
import Loading from "../../../components/Loading/Loading";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AllUsersPage = () => {
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    data: allUsers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ email, action }) => {
      let updateData = {};

      if (action === "block") {
        updateData = { status: "blocked" };
      } else if (action === "unblock") {
        updateData = { status: "active" };
      } else {
        updateData = { role: action };
      }

      return axiosInstance.patch(`/users?email=${email}`, updateData);
    },
    onSuccess: (_data, variables) => {
      const { action } = variables;

      let message = "";
      switch (action) {
        case "block":
          message = "User has been blocked successfully.";
          break;
        case "unblock":
          message = "User has been unblocked successfully.";
          break;
        case "volunteer":
          message = "User is now a Volunteer.";
          break;
        case "admin":
          message = "User is now an Admin.";
          break;
        case "donor":
          message = "User is now a Donor.";
          break;
        default:
          message = "User updated successfully.";
      }

      Swal.fire("Success", message, "success");
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: () => {
      Swal.fire("Error", "Failed to update user.", "error");
    },
  });

  const handleAction = (email, action) => {
    mutation.mutate({ email, action });
  };

  const filteredUsers =
    statusFilter === "all"
      ? allUsers
      : allUsers.filter((user) => user.status === statusFilter);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const users = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-500">Failed to load users.</div>;

  return (
    <div className="p-6 bg-white shadow rounded-md mt-6">
      <h2 className="text-xl font-semibold mb-4 text-red-600">All Users</h2>

      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          {["all", "active", "blocked"].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setStatusFilter(filter);
                setCurrentPage(1);
              }}
              className={`btn btn-sm ${
                statusFilter === filter ? "btn-primary" : "btn-outline"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border"
                    />
                  </td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td className="capitalize">{user.role}</td>
                  <td className="capitalize">{user.status}</td>
                  <td>
                    <div className="dropdown dropdown-left">
                      <button tabIndex={0} className="btn btn-sm btn-ghost">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        {user.status === "active" ? (
                          <li>
                            <button
                              onClick={() => handleAction(user.email, "block")}
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Block
                            </button>
                          </li>
                        ) : (
                          <li>
                            <button
                              onClick={() =>
                                handleAction(user.email, "unblock")
                              }
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Unblock
                            </button>
                          </li>
                        )}

                        {user.role !== "volunteer" && (
                          <li>
                            <button
                              onClick={() =>
                                handleAction(user.email, "volunteer")
                              }
                            >
                              <Users className="w-4 h-4 mr-2" />
                              Make Volunteer
                            </button>
                          </li>
                        )}

                        {user.role !== "admin" && (
                          <li>
                            <button
                              onClick={() => handleAction(user.email, "admin")}
                            >
                              <ShieldCheck className="w-4 h-4 mr-2" />
                              Make Admin
                            </button>
                          </li>
                        )}

                        {user.role !== "donor" && (
                          <li>
                            <button
                              onClick={() => handleAction(user.email, "donor")}
                            >
                              <ShieldCheck className="w-4 h-4 mr-2" />
                              Make Donor
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          className="btn btn-sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-2 py-1 border rounded">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-sm"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsersPage;
