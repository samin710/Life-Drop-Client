import React from "react";
import useAxios from "../../Hooks/useAxios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ContactUs = () => {
  const axiosInstance = useAxios();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const contactInfo = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    try {
      await axiosInstance.post("/contacts", contactInfo);
      Swal.fire("Success!", "Your message has been sent!", "success");
      reset();
    } catch (error) {
      console.error("Contact error:", error);
      Swal.fire("Error!", "Failed to send message", "error");
    }
  };

  return (
    <section className="py-16 bg-white" id="contact">
      <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        {/* Contact Info */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-6">
            Have questions, suggestions, or want to contribute? We’re here to
            help. Fill out the form or reach out directly.
          </p>
          <div className="text-lg font-medium text-gray-800">
            📞 Hotline:{" "}
            <a
              href="tel:+8801234567890"
              className="text-red-600 hover:underline"
            >
              +880 123 456 7890
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-50 p-6 rounded-xl shadow-md space-y-4"
        >
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Message</label>
            <textarea
              rows="4"
              className="textarea textarea-bordered w-full"
              {...register("message", { required: "Message is required" })}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
