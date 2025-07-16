// AdminDashboardDonationChart.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";

// Blood groups and their colors (adjust as needed)
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const STATUS_COLORS = {
  pending: "#facc15", // yellow
  inprogress: "#3b82f6", // blue
  done: "#10b981", // green
  canceled: "#9ca3af", // gray
};

const AdminDashboardDonationChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data: donationData = [], isLoading } = useQuery({
    queryKey: ["donation-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-requests");
      return res.data;
    },
  });

  const formatDateLabel = (isoDateStr) => {
    const date = new Date(isoDateStr);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  // Group by date + status (optional: also filter by status)
  const grouped = {};

  donationData.forEach((req) => {
    const date = formatDateLabel(req.createdAt);
    const key = `${date}`;

    if (!grouped[key]) grouped[key] = {};

    const status = req.status;
    if (!grouped[key][status]) grouped[key][status] = 0;

    grouped[key][status] += 1;
  });

  const chartData = Object.entries(grouped).map(([date, statusCounts]) => {
    return {
      date,
      ...statusCounts,
    };
  });

  if (isLoading) return <Loading />;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl text-primary font-semibold mb-4">
        Donation Requests Over Time
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {Object.keys(STATUS_COLORS).map((status) => (
            <Bar
              key={status}
              dataKey={status}
              stackId="status"
              fill={STATUS_COLORS[status]}
              name={status.charAt(0).toUpperCase() + status.slice(1)}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminDashboardDonationChart;
