import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";

const AddBlogPage = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const editor = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState("");

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_upload_key
        }`,
        formData
      );

      setUploading(false);
      return res?.data?.data?.url;
    } catch (error) {
      setUploading(false);
      console.error("Image upload failed:", error);
      Swal.fire("Error", "Failed to upload image", "error");
      return null;
    }
  };

  const mutation = useMutation({
    mutationFn: async (newBlog) => {
      return axiosInstance.post("/blogs", newBlog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      Swal.fire("Success", "Blog created successfully!", "success");
      navigate("/dashboard/content-management");
    },
    onError: () => {
      Swal.fire("Error", "Failed to create blog", "error");
    },
  });

  const onSubmit = async (data) => {
    const { title, thumbnail } = data;

    if (!content) {
      return Swal.fire("Warning", "Content is required", "warning");
    }

    const imageUrl = await handleImageUpload(thumbnail[0]);

    if (!imageUrl) return;

    const blogData = {
      title,
      thumbnail: imageUrl,
      content,
      status: "draft",
      postedByEmail: user.email,
      postedByName: user.displayName,
      createdAt: new Date().toISOString(),
    };

    mutation.mutate(blogData);
  };

  return (
    <div className="p-6 bg-white shadow rounded-md mt-6">
      <h2 className="text-xl font-semibold mb-4 text-red-600">Add Blog</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter blog title"
            className="input input-bordered w-full"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">Title is required</p>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block font-medium mb-1">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            {...register("thumbnail", { required: true })}
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-sm">Thumbnail is required</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium mb-1">Content</label>
          <JoditEditor
            ref={editor}
            value={content}
            tabIndex={1}
            onBlur={(newContent) => setContent(newContent)}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={mutation.isLoading || uploading}
          >
            {mutation.isLoading || uploading ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogPage;
