import React from "react";
import { Button } from "@heroui/react";
import { FaArrowUp } from "react-icons/fa";

export default function FooterCard() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-primary-200 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">About Us</h2>
            <p className="text-gray-400">
              We are a company dedicated to connecting employers with top
              talent. Our platform makes it easy to find and hire the best
              candidates for your job openings.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <ul className="text-gray-400">
              <li className="mb-2">
                <a href="#home" className="hover:text-white">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#about" className="hover:text-white">
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="#services" className="hover:text-white">
                  Services
                </a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-400">Email: info@company.com</p>
            <p className="text-gray-400">Phone: +123 456 7890</p>
            <Button auto flat isIconOnly color="primary" onClick={scrollToTop}>
              <FaArrowUp />
            </Button>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-8">
          &copy; 2025 Artisan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
