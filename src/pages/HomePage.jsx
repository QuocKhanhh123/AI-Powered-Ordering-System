import React from "react";
import HeroSection from "@/components/hero-section";
import FeaturedProducts from "@/components/featured-products";
import PopularProducts from "@/components/popular-products";
import WhyChooseUs from "@/components/why-choose-us";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="animate-fade-in">
          <HeroSection />
        </div>
        <div className="animate-fade-in-up">
          <FeaturedProducts />
        </div>
        <div className="animate-fade-in-up">
          <PopularProducts />
        </div>
        <div className="animate-fade-in-up">
          <WhyChooseUs />
        </div>
      </main>
    </div>
  );
};

export default Home;
