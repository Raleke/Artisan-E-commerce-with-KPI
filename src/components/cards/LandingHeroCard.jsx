import React, { useEffect, useState } from "react";
import AOS from "aos";
import { Button, Link } from "@heroui/react";
import ImageCarousel from "./ImagesCarousel";
export default function LandingHeroCard() {
  const professions = [
    "Tailors",
    "Nurses",
    "Hair Stylist",
    "Receptionist",
    "Chefs",
    "Construction Workers",
  ];
  const serviceImages = [
    {
      src: "https://artisanoga.com/artisans/tailors.png",
      alt: "tailors",
      title: "Professional Tailors",
    },
    {
      src: "https://artisanoga.com/artisans/nurses.png",
      alt: "nurses",
      title: "Healthcare Professionals",
    },
    {
      src: "https://artisanoga.com/artisans/chefs.png",
      alt: "chefs",
      title: "Professional Chefs",
    },
  ];
  // State to track the current profession index
  const [currentProfessionIndex, setCurrentProfessionIndex] = useState(0);

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: false, // Allow animations to repeat
    });
  }, []);

  // Use useEffect to cycle through professions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProfessionIndex((prevIndex) =>
        prevIndex === professions.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000); // Change profession every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [professions.length]);
  return (
    <div className="pt-32 bg-zinc-100">
      <div className="lg:max-w-7xl md:max-w-5xl max-w-3xl w-full px-4 mx-auto">
        <div className="flex md:flex-row flex-col-reverse items-center justify-between">
          <div className="flex flex-col md:w-7/12 pb-4 mt-4">
            <div className="flex justify-center" data-aos="fade-up">
              <div className="text-3xl font-bold mr-2">Hire </div>
              <div
                key={currentProfessionIndex} // Force re-render for AOS animation
                className="text-3xl font-bold text-primary-500"
                data-aos="fade-down"
              >
                {professions[currentProfessionIndex]}
              </div>
            </div>
            <div className="md:mb-6 justify-center mb-0 flex ">
              <div className="text-2xl font-bold text-center">
                Find the right talent for your business
              </div>
            </div>
            <div className="font-normal text-lg mb-12">
              <div className="text-center">
                Access a pool of skilled professionals in your area
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button href="#" color="primary">
                Hire Now
              </Button>
              <Button href="#" color="primary">
                Find A Job
              </Button>
            </div>
          </div>
          <div className="w-auto md:w-5/12">
            <ImageCarousel
              images={serviceImages}
              autoplayDelay={5000} // Optional: customize delay
              height="h-72" // Optional: customize height
              showTitles={true} // Optional: show/hide titles
              containerClasses="w-full max-w-3xl mx-auto" // Optional: custom container classes
            />
          </div>
        </div>
      </div>
    </div>
  );
}
