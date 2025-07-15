import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Droplet,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  ShieldOff,
  Users,
} from "lucide-react";
import useAxios from "../../../Hooks/useAxios";
import { FaDollarSign } from "react-icons/fa";

const StatisticsCards = () => {
  const axiosInstance = useAxios();

  const { data: stats = {} } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/stats");
      return res.data;
    },
  });

  const cardList = [
    {
      title: "Total Donation Requests",
      count: stats.totalRequests || 0,
      icon: <Droplet className="text-red-500 w-8 h-8" />,
      bg: "bg-red-100",
    },
    // {
    //   title: "Pending Requests",
    //   count: stats.pendingRequests || 0,
    //   icon: <Clock className="text-yellow-500 w-8 h-8" />,
    //   bg: "bg-yellow-100",
    // },
    // {
    //   title: "In-progress Requests",
    //   count: stats.inprogressRequests || 0,
    //   icon: <RefreshCw className="text-blue-500 w-8 h-8" />,
    //   bg: "bg-blue-100",
    // },
    // {
    //   title: "Done Requests",
    //   count: stats.doneRequests || 0,
    //   icon: <CheckCircle className="text-green-600 w-8 h-8" />,
    //   bg: "bg-green-100",
    // },
    // {
    //   title: "Canceled Requests",
    //   count: stats.canceledRequests || 0,
    //   icon: <XCircle className="text-gray-500 w-8 h-8" />,
    //   bg: "bg-gray-100",
    // },
    {
      title: "Active Users",
      count: stats.activeUsers + stats.blockedUsers || 0,
      icon: <Users className="text-emerald-500 w-8 h-8" />,
      bg: "bg-emerald-100",
    },
    // {
    //   title: "Blocked Users",
    //   count: stats.blockedUsers || 0,
    //   icon: <ShieldOff className="text-rose-500 w-8 h-8" />,
    //   bg: "bg-rose-100",
    // },

    {
      title: "Total Funds Raised",
      count: stats.totalFunding?.toFixed(2) || "0.00",
      icon: <FaDollarSign className="text-blue-600 w-8 h-8" />,
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {cardList.map((card, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl shadow-md flex items-center justify-between ${card.bg}`}
        >
          <div>
            <h4 className="text-2xl font-bold text-gray-800">{card.count}</h4>
            <p className="text-gray-600">{card.title}</p>
          </div>
          <div className="p-3 rounded-full bg-white shadow">{card.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;
