import React from "react";
import { Search, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router";
import bannerBG from "../../assets/banner.jpeg";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative text-white py-20 overflow-hidden rounded-xl shadow-lg mt-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerBG})` }}
    >
      /* Background decorative shapes */
      <div className="absolute inset-0 opacity-10 bg-[url('/blood-drop-bg.svg')] bg-no-repeat bg-center bg-cover"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow">
          Donate Blood, Save Lives
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Become a hero today. Your one drop of blood could mean a second chance
          for someone.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* Join as Donor Button */}

          <button
            onClick={() => navigate("/signUp")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-semibold rounded-full shadow hover:bg-red-50 transition-all cursor-pointer"
          >
            <HeartHandshake className="w-5 h-5" />
            Join as a Donor
          </button>

          {/* Search Donors Button */}
          <button
            onClick={() => navigate("/search-page")}
            className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white font-semibold rounded-full hover:bg-white hover:text-red-600 transition-all cursor-pointer"
          >
            <Search className="w-5 h-5" />
            Search Donors
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
