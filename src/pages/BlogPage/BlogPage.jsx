import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import { Search } from "lucide-react";
import { Link } from "react-router";

const BlogPage = () => {
  const axiosInstance = useAxios();
  const [searchText, setSearchText] = useState("");

  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["published-blogs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/blogs/status?status=published");
      return res.data;
    },
  });

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchText.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <span className="loading loading-spinner text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-primary py-10">
        Failed to load blogs. Please try again.
      </p>
    );
  }

  return (
    <div className=" py-10">
      <h1 className="text-4xl font-bold text-center mb-6 text-primary">
        Latest Blogs
      </h1>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-lg">
          <Search className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs..."
            className="input input-bordered w-full pl-10"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Blog Cards */}
      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white shadow-lg shadow-secondary rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {/* Optionally show part of content as a preview */}
                  {blog.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
                </p>
                <Link
                  to={`/blog-details/${blog._id}`}
                  className="text-sm text-primary hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
