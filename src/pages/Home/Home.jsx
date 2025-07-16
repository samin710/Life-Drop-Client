import React from "react";
import Banner from "./Banner";
import FeaturesSection from "./FeaturesSection";
import ContactUs from "./ContactUs";
import useAuth from "../../Hooks/useAuth";
import Loading from "../../components/Loading/Loading";

const Home = () => {
  const { loading } = useAuth();
  if (loading) return <Loading></Loading>;
  return (
    <div>
      <Banner></Banner>
      <FeaturesSection></FeaturesSection>
      <ContactUs></ContactUs>
    </div>
  );
};

export default Home;
