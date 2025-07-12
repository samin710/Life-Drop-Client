import React from "react";
import {
  HeartPulse,
  Users,
  ShieldCheck,
  Clock,
  Search,
  Medal,
} from "lucide-react";

const features = [
  {
    icon: <HeartPulse className="w-8 h-8 text-red-600" />,
    title: "Real-Time Donor Search",
    description:
      "Find suitable blood donors nearby instantly using our smart location-based search system.",
  },
  {
    icon: <Users className="w-8 h-8 text-red-600" />,
    title: "Verified Donor Network",
    description:
      "Connect only with verified donors who meet health and eligibility standards.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-red-600" />,
    title: "Privacy First",
    description:
      "Your personal information is protected with industry-standard security and sharing controls.",
  },
  {
    icon: <Clock className="w-8 h-8 text-red-600" />,
    title: "24/7 Availability",
    description:
      "Emergencies don’t wait — access donor requests and responders at any time of the day.",
  },
  {
    icon: <Search className="w-8 h-8 text-red-600" />,
    title: "Smart Matching System",
    description:
      "Automatically matches recipients with compatible donors based on blood type and location.",
  },
  {
    icon: <Medal className="w-8 h-8 text-red-600" />,
    title: "Recognition & Badges",
    description:
      "Donors earn badges and recognition for their contribution to saving lives.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Why Choose LifeDrop?
          </h2>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto">
            We’re committed to making blood donation easier, safer, and more
            impactful for everyone involved.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
