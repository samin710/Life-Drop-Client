import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router";
import useAxios from "../../../Hooks/useAxios";
import Loading from "../../../components/Loading/Loading";
import { Pencil } from "lucide-react";

const EditBlogPage = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editor = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const fileInputRef = useRef(null);

  // Fetch existing blog data
  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/blogs/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (blog) {
      reset(blog);
      setContent(blog.content);
      setThumbnailPreview(blog.thumbnail);
    }
  }, [blog, reset]);

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosInstance.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_upload_key
        }`,
        formData
      );
      setUploading(false);
      return res?.data?.data?.url;
    } catch {
      setUploading(false);
      Swal.fire("Error", "Failed to upload image", "error");
      return null;
    }
  };

  const mutation = useMutation({
    mutationFn: async (updatedBlog) => {
      return axiosInstance.patch(`/blogs/${id}`, updatedBlog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      Swal.fire("Updated", "Blog updated successfully", "success");
      navigate("/dashboard/content-management");
    },
    onError: () => {
      Swal.fire("Error", "Failed to update blog", "error");
    },
  });

  const onSubmit = async (data) => {
    const { title } = data;

    if (!content) {
      return Swal.fire("Warning", "Content is required", "warning");
    }

    let thumbnailUrl = blog.thumbnail;

    if (fileInputRef.current.files[0]) {
      const uploaded = await handleImageUpload(fileInputRef.current.files[0]);
      if (!uploaded) return;
      thumbnailUrl = uploaded;
    }

    const updatedBlog = {
      title,
      content,
      thumbnail: thumbnailUrl,
    };

    mutation.mutate(updatedBlog);
  };

  if (isLoading) return <Loading></Loading>;

  return (
    <div className="p-6 bg-white shadow rounded-md mt-6">
      <h2 className="text-xl font-semibold mb-4 text-red-600">Edit Blog</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
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

          {thumbnailPreview && (
            <div className="relative w-fit">
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="w-40 rounded border"
              />

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("thumbnail")}
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setThumbnailPreview(URL.createObjectURL(file));
                  }
                }}
              />

              {/* Edit button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium mb-1">Content</label>
          <JoditEditor
            key={content}
            ref={editor}
            value={content}
            tabIndex={1}
            onBlur={(newContent) => setContent(newContent)}
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={mutation.isLoading || uploading}
          >
            {mutation.isLoading || uploading ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage;
