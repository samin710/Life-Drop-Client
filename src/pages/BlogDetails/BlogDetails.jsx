import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import useAxios from "../../Hooks/useAxios";
import Loading from "../../components/Loading/Loading";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/blogs/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-500">Blog not found.</p>;

  return (
    <div className="py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-sm text-primary hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {/* Blog Thumbnail */}
      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full h-60 object-cover rounded-lg mb-6"
      />

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 text-primary">{blog.title}</h1>

      {/* Blog Content */}
      <div
        className="prose max-w-none text-gray-700 lg:pb-5 md:pb-3 pb-2"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <p>Posted by: {blog.postedByName}</p>
      <p>Email: {blog.postedByEmail}</p>
      <p >
        Posted on: {new Date(blog.createdAt).toISOString().split("T")[0]}
      </p>
    </div>
  );
};

export default BlogDetails;
