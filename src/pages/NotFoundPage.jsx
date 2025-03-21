import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 5000);

    // Optional: Create countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Cleanup function to clear timers if component unmounts
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
      <p className="text-lg text-gray-500 mt-2">
        Redirecting to home page in {countdown} seconds...
      </p>
    </div>
  );
};

export default NotFoundPage;
