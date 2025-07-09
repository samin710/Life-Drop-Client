import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";
import Loading from "../../../components/Loading/Loading";

const CreateDonationRequest = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosInstance = useAxios();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const selectedDistrict = watch("recipientDistrict");

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

  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    axiosInstance.get(`/users?email=${user.email}`).then((res) => {
      setUserInfo(res.data);
    });
  }, [axiosInstance, user.email]);

  const onSubmit = async (formData) => {
    try {
      // Check if user is active
      if (!userInfo || userInfo.status === "blocked") {
        return Swal.fire(
          "Access Denied",
          "You are blocked from making requests.",
          "error"
        );
      }

      const donationData = {
        ...formData,
        requesterName: user.displayName,
        requesterEmail: user.email,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await axiosInstance.post("/donation-requests", donationData);

      Swal.fire(
        "Request Created",
        "Donation request submitted successfully!",
        "success"
      );
      reset();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to create donation request", "error");
    }
  };

  if (authLoading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-red-600 mb-6">
        Create Donation Request
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Requester Info */}
        <div>
          <label className="label">Requester Name</label>
          <input
            type="text"
            className="input input-bordered w-full bg-base-200"
            value={user.displayName}
            readOnly
          />
        </div>

        <div>
          <label className="label">Requester Email</label>
          <input
            type="email"
            className="input input-bordered w-full bg-base-200"
            value={user.email}
            readOnly
          />
        </div>

        {/* Recipient Info */}
        <div>
          <label className="label">Recipient Name</label>
          <input
            type="text"
            {...register("recipientName", { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter recipient name"
          />
        </div>

        <div>
          <label className="label">Recipient District</label>
          <select
            {...register("recipientDistrict", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Recipient Upazila</label>
          <select
            {...register("recipientUpazila", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select Upazila</option>
            {filteredUpazilas.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label">Hospital Name</label>
          <input
            type="text"
            {...register("hospitalName", { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter hospital name"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Full Address</label>
          <input
            type="text"
            {...register("fullAddress", { required: true })}
            className="input input-bordered w-full"
            placeholder="Example: Zahir Raihan Rd, Dhaka"
          />
        </div>

        <div>
          <label className="label">Blood Group</label>
          <select
            {...register("bloodGroup", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Donation Date</label>
          <input
            type="date"
            {...register("donationDate", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Donation Time</label>
          <input
            type="time"
            {...register("donationTime", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Request Message</label>
          <textarea
            {...register("requestMessage", { required: true })}
            className="textarea textarea-bordered w-full"
            rows={4}
            placeholder="Explain why blood is needed in detail..."
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Requesting..." : "Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
