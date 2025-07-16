import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router";
import useAxios from "../../../Hooks/useAxios";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  // const [avatarURL, setAvatarURL] = useState("");
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const selectedDistrict = watch("district");

  const { createUser, updateUserProfile } = useAuth();
  const axiosInstance = useAxios();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  useEffect(() => {
    // Load districts and upazilas from public folder
    const loadData = async () => {
      const districtRes = await fetch("/districts.json");
      const upazilaRes = await fetch("/upazilas.json");
      const districtData = await districtRes.json();
      const upazilaData = await upazilaRes.json();
      setDistricts(districtData);
      setUpazilas(upazilaData);
    };
    loadData();
  }, []);

  useEffect(() => {
    const selected = districts.find((d) => d.name === selectedDistrict);
    if (selected) {
      const filtered = upazilas.filter((u) => u.district_id === selected.id);
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrict, districts, upazilas]);

  const onSubmit = async (data) => {
    setLoading(true);

    // ✅ Upload avatar inside submit
    const image = data.avatar[0];
    const formData = new FormData();
    formData.append("image", image);

    let imageUrl = "";

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_upload_key
        }`,
        formData
      );
      imageUrl = res.data.data.url;
    } catch (err) {
      console.error("Image upload failed:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload avatar image.",
      });
      setLoading(false);
      return;
    }

    // ✅ Proceed with user creation
    try {
      await createUser(data.email, data.password);

      const userInfo = {
        name: data.name,
        email: data.email,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila,
        role: "donor",
        status: "active",
        avatar: imageUrl,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };
      await axiosInstance.post("/users", userInfo);

      await updateUserProfile({
        displayName: data.name,
        photoURL: imageUrl,
      }).then(() => {
        navigate(from);
      });

      Swal.fire({
        title: "Account Created!",
        text: "You have successfully signed up.",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-xl p-8 space-y-6 rounded-xl shadow-md shadow-secondary border border-secondary">
        <h2 className="text-2xl font-bold text-center text-primary">
          SignUp to LifeDrop
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="input input-bordered w-full"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}

          <input
            type="file"
            className="file-input file-input-bordered w-full"
            {...register("avatar", { required: "Avatar is required" })}
          />
          {errors.avatar && (
            <p className="text-sm text-red-500">{errors.avatar.message}</p>
          )}

          <select
            className="select select-bordered w-full"
            {...register("bloodGroup", { required: "Blood group is required" })}
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          {errors.bloodGroup && (
            <p className="text-sm text-red-500">{errors.bloodGroup.message}</p>
          )}

          {/* District Dropdown */}
          <select
            className="select select-bordered w-full"
            {...register("district", { required: "District is required" })}
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-sm text-red-500">{errors.district.message}</p>
          )}

          {/* Upazila Dropdown */}
          <select
            className="select select-bordered w-full"
            {...register("upazila", { required: "Upazila is required" })}
            // disabled={!filteredUpazilas.length}
          >
            <option value="">Select Upazila</option>
            {filteredUpazilas.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
          {errors.upazila && (
            <p className="text-sm text-red-500">{errors.upazila.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters required" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                message:
                  "Password must contain at least 1 uppercase and 1 lowercase letter",
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full"
            {...register("confirm_password", {
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirm_password && (
            <p className="text-sm text-red-500">
              {errors.confirm_password.message}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link
              to="/signIn"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Go to Sign In
            </Link>
          </p>
          <p className="text-sm text-center">
            Do not want to create an account now?{" "}
            <Link
              to="/"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Go to Home
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
