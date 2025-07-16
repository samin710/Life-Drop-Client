import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaTint } from "react-icons/fa";
import useAxios from "../../Hooks/useAxios";

const SearchDonorsPage = () => {
  const axiosInstance = useAxios();

  const { register, handleSubmit, watch } = useForm();
  const selectedDistrict = watch("district");

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Load locations
  useEffect(() => {
    const fetchLocations = async () => {
      const dRes = await fetch("/districts.json");
      const uRes = await fetch("/upazilas.json");
      setDistricts(await dRes.json());
      setUpazilas(await uRes.json());
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const match = districts.find((d) => d.name === selectedDistrict);
    if (match) {
      setFilteredUpazilas(upazilas.filter((u) => u.district_id === match.id));
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrict, districts, upazilas]);

  // Submit handler
  const onSubmit = async (data) => {
    const query = new URLSearchParams({
      bloodGroup: data.bloodGroup,
      district: data.district,
      upazila: data.upazila,
    });
    try {
      const res = await axiosInstance.get(`/search-donors?${query.toString()}`);
      setDonors(res.data || []);
      setHasSearched(true);
    } catch (err) {
      console.error("Failed to fetch donors", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
      <h1 className="text-4xl font-bold text-center text-primary mb-6">
        Search Donors
      </h1>

      {/* Search Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-secondary p-6 rounded shadow-lg shadow-secondary"
      >
        {/* Blood Group */}
        <div>
          <label className="label">Blood Group</label>
          <select
            {...register("bloodGroup", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="label">District</label>
          <select
            {...register("district", { required: true })}
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

        {/* Upazila */}
        <div>
          <label className="label">Upazila</label>
          <select
            {...register("upazila", { required: true })}
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

        {/* Submit Button */}
        <div className="md:col-span-3 text-center mt-4">
          <button className="btn btn-primary px-10">Search</button>
        </div>
      </form>

      {/* Donor Results */}
      {hasSearched && (
        <div className="mt-10">
          {donors.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <div
                  key={donor._id}
                  className="border border-secondary p-4 rounded-lg shadow hover:shadow-lg hover:shadow-secondary transition"
                >
                  <div className="flex items-center justify-center">
                    {" "}
                    <img
                      src={donor.avatar}
                      alt=""
                      className="lg:w-28 lg:h-28 md:w-20 md:h-20 w-16"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-primary">
                      {donor.name}
                    </h3>
                    <span className="badge badge-primary">
                      {donor.bloodGroup}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>District:</strong> {donor.district}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Upazila:</strong> {donor.upazila}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Email:</strong> {donor.email || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No donors found for this location.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDonorsPage;
