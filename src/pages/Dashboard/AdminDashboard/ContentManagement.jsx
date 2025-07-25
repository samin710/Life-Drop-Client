import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, UploadCloud, FileDown, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import useAxios from "../../../Hooks/useAxios";
import Loading from "../../../components/Loading/Loading";
import useUserRole from "../../../Hooks/useUserRole";
import Swal from "sweetalert2";

const ContentManagement = () => {
  const { role } = useUserRole();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/blogs");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, action }) => {
      if (action === "delete") {
        return axiosInstance.delete(`/blogs/${id}`);
      } else {
        return axiosInstance.patch(`/blogs/${id}`, {
          status: action === "publish" ? "published" : "draft",
        });
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      if (variables.action === "delete") {
        Swal.fire("Deleted!", "Blog has been deleted.", "success");
      } else if (variables.action === "publish") {
        Swal.fire("Published!", "Blog is now published.", "success");
      } else if (variables.action === "unpublish") {
        Swal.fire("Unpublished!", "Blog is now in draft status.", "info");
      }
    },
  });

  const handleAction = (id, action) => {
    if (
      (action === "delete" || action === "publish" || action === "unpublish") &&
      role !== "admin"
    ) {
      return;
    }
    mutation.mutate({ id, action });
  };

  const filteredBlogs =
    statusFilter === "all"
      ? blogs
      : blogs.filter((blog) => blog.status === statusFilter);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-500">Failed to load blogs.</div>;

  return (
    <div className="p-6 shadow-md rounded-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-red-600">
          Content Management
        </h2>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => navigate("/dashboard/content-management/add-blog")}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Blog
        </button>
      </div>

      <div className="mb-4">
        <select
          className="select select-sm select-bordered"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {currentBlogs.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No blogs found for the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="border border-secondary shadow-md shadow-secondary rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold mb-1">{blog.title}</h3>
                <img src={blog.thumbnail} alt="" className="w-8 h-8" />
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                  Status: {blog.status}
                </p>
                <div
                  className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300 mb-2"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="space-x-2">
                  {blog.status === "draft" && role === "admin" && (
                    <button
                      onClick={() => handleAction(blog._id, "publish")}
                      className="btn btn-xs btn-success"
                    >
                      <UploadCloud className="w-4 h-4 mr-1" /> Publish
                    </button>
                  )}
                  {blog.status === "published" && role === "admin" && (
                    <button
                      onClick={() => handleAction(blog._id, "unpublish")}
                      className="btn btn-xs btn-warning"
                    >
                      <FileDown className="w-4 h-4 mr-1" /> Unpublish
                    </button>
                  )}
                  {role === "admin" && (
                    <button
                      onClick={() => handleAction(blog._id, "delete")}
                      className="btn btn-xs btn-outline btn-error"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/dashboard/edit-blog/${blog._id}`)}
                    className="btn btn-xs btn-outline btn-primary"
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end mt-6 space-x-2">
        <button
          className="btn btn-sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-3 py-1 border rounded">
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

export default ContentManagement;
