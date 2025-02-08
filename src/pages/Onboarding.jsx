import React, { useState, useEffect } from "react";
import { FaUser, FaUserTie } from "react-icons/fa";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Spinner, Tab, Tabs } from "@heroui/react";
import EmployeeLogin from "./EmployerLoginPage";
import ArtisanLoginPage from "./ArtisanLoginPage.jsx";

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state
  const { pathname } = useLocation();

  const EmployerRedirect = () => {
    navigate("/employer");
  };
  const ArtitisanRedirect = () => {
    navigate("/artisan");
  };

  if (loading) {
    return <Spinner />; // Show loader while loading
  }

  return (
    <div className="flex w-full flex-col p-4 px-8 mt-8">
      <Tabs
        aria-label="Options"
        selectedKey={pathname}
        color="primary"
        variant="bordered"
      >
        <Tab
          key="/login/employer"
          href="/login/employer"
          title={
            <div className="flex items-center space-x-2">
              <FaUserTie className="text-2xl" />
              <span className="font-semibold text-center">Employer</span>
            </div>
          }
        />
        <Tab
          key="/login/artisian"
          href="/login/artisian"
          title={
            <div className="flex items-center space-x-2">
              <FaUser className="text-2xl" />
              <span className="font-semibold text-center">Artisan</span>
            </div>
          }
        />
      </Tabs>
      <Routes>
        <Route path="/employer" element={<EmployeeLogin />} />
        <Route path="/artisan" element={<ArtisanLoginPage />} />
      </Routes>
    </div>
  );
};

export default Onboarding;
