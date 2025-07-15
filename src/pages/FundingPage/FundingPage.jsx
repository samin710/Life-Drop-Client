import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import Loading from "../../components/Loading/Loading";
import FundingForm from "./FundingForm";
import { Elements } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const stripePromise = loadStripe(import.meta.env.VITE_stripe_pk);

const FundingPage = () => {
  const axiosSecure = useAxiosSecure();
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;

  const queryClient = useQueryClient();

  const {
    data: fundings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fundings", page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/fundings?page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  const totalPages = fundings?.totalPages || 1;

  if (isLoading) return <Loading></Loading>;
  if (isError) {
    return (
      <p className="text-center text-red-500 py-10">
        Failed to load funding history. Please try again.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Funding</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Give Fund
        </button>
      </div>

      {showForm && (
        <Elements stripe={stripePromise}>
          <FundingForm
            closeForm={() => setShowForm(false)}
            queryClient={queryClient}
          />
        </Elements>
      )}

      <div className="overflow-x-auto mt-6 bg-white shadow rounded-lg">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>#</th>
              <th>Donor Name</th>
              <th>Donor Email</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {fundings.data?.map((fund, index) => (
              <tr key={fund._id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>{fund.name}</td>
                <td>{fund.email}</td>
                <td>${fund.amount.toFixed(2)}</td>
                <td>{fund.createdAt.split("T")[0]}</td>
                <td>{fund.transactionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        {[...Array(totalPages).keys()].map((i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`btn btn-sm ${
              page === i + 1 ? "btn-primary" : "btn-ghost"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FundingPage;
