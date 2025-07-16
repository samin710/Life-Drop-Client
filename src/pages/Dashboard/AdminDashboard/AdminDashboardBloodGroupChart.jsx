// AdminDashboardBloodGroupChart.jsx
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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AdminDashboardBloodGroupChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data: donationData = [], isLoading } = useQuery({
    queryKey: ["donation-requests"],
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

  // Group by date and blood group
  const grouped = {};
  donationData.forEach((req) => {
    const date = formatDateLabel(req.createdAt);
    if (!grouped[date]) grouped[date] = {};
    const group = req.bloodGroup;
    grouped[date][group] = (grouped[date][group] || 0) + 1;
  });

  const chartData = Object.entries(grouped).map(([date, groups]) => {
    const row = { date };
    bloodGroups.forEach((bg) => {
      row[bg] = groups[bg] || 0;
    });
    return row;
  });
  
  if (isLoading) return <Loading />;

  return (
    <div className="shadow shadow-secondary rounded-lg p-6 mt-8">
      <h2 className="text-xl text-primary font-semibold mb-4">
        Blood Group Distribution Over Time
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {bloodGroups.map((group, idx) => (
            <Bar
              key={group}
              dataKey={group}
              stackId="a"
              fill={COLORS[idx % COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const COLORS = [
  "#f43f5e", // A+
  "#f97316", // A-
  "#10b981", // B+
  "#3b82f6", // B-
  "#8b5cf6", // AB+
  "#ec4899", // AB-
  "#06b6d4", // O+
  "#64748b", // O-
];

export default AdminDashboardBloodGroupChart;
