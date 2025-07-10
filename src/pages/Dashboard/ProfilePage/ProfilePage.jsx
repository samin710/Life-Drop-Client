import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../components/Loading/Loading";
import useAxios from "../../../Hooks/useAxios";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm();

  const selectedDistrict = watch("district");

  // Load district & upazila
  useEffect(() => {
    const loadLocation = async () => {
      const districtRes = await fetch("/districts.json");
      const upazilaRes = await fetch("/upazilas.json");
      const dData = await districtRes.json();
      const uData = await upazilaRes.json();
      setDistricts(dData);
      setUpazilas(uData);
    };
    loadLocation();
  }, []);

  useEffect(() => {
    const match = districts.find((d) => d.name === selectedDistrict);
    if (match) {
      setFilteredUpazilas(upazilas.filter((u) => u.district_id === match.id));
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrict, districts, upazilas]);

  // Fetch profile data
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/email?email=${user.email}`);
      reset(res.data);
      return res.data;
    },
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const { _id, ...sanitizedData } = updatedData;
      return await axiosInstance.patch(
        `/users?email=${user.email}`,
        sanitizedData
      );
    },
    onSuccess: () => {
      Swal.fire("Updated", "Profile updated successfully", "success");
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: ["profile", user.email] });
    },
    onError: () => {
      Swal.fire("Error", "Profile update failed", "error");
    },
  });

  const onSubmit = (data) => {
    if (isDirty) {
      mutation.mutate(data);
    }
  };

  if (isLoading || loading) return <Loading />;
  if (isError)
    return <div className="text-center mt-10">Failed to load profile.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {profile ? (
        <>
          {" "}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">My Profile</h2>
            {editMode ? (
              <button
                onClick={handleSubmit(onSubmit)}
                className="btn btn-sm btn-success"
                disabled={mutation.isLoading || !isDirty}
              >
                {mutation.isLoading ? "Saving..." : "Save"}
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="btn btn-sm btn-primary"
              >
                Edit
              </button>
            )}
          </div>
          <form
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Avatar */}
            <div className="lg:col-span-2 flex justify-center">
              <img
                src={profile?.avatar}
                alt="avatar"
                className="lg:w-28 lg:h-28 md:w-20 md:h-20 w-16 rounded-full border-2 border-primary"
              />
            </div>

            {/* Name */}
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                {...register("name")}
                className="input input-bordered w-full"
                disabled={!editMode}
              />
            </div>
            {/* Email (not editable) */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email")}
                className="input input-bordered w-full bg-base-200"
                disabled
              />
            </div>
            {/* District */}
            <div>
              <label className="label">District</label>
              <select
                {...register("district")}
                className="select select-bordered w-full"
                disabled={!editMode}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Upazila */}
            <div>
              <label className="label">Upazila</label>
              <select
                {...register("upazila")}
                className="select select-bordered w-full"
                disabled={!editMode}
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Blood Group */}
            <div>
              <label className="label">Blood Group</label>
              <select
                {...register("bloodGroup")}
                className="select select-bordered w-full"
                disabled={!editMode}
              >
                <option value="">Select</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  )
                )}
              </select>
            </div>
          </form>
        </>
      ) : (
        <h1>Not found</h1>
      )}
    </div>
  );
};

export default ProfilePage;
