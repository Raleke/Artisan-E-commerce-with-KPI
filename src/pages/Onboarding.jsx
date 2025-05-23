import React, { useState, useEffect } from "react";
import { FaUser, FaUserTie } from "react-icons/fa";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { Spinner, Tab, Tabs } from "@heroui/react";
import EmployeeLogin from "./EmployerLoginPage.jsx";
import ArtisanLoginPage from "./ArtisanLoginPage.jsx";
import CustomerLoginPage from "./CustomerLoginPage.jsx";

const Onboarding = () => {
  const [loading, setLoading] = useState(false); // Add loading state
  const { pathname } = useLocation();

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
        <Tab
          key="/login/customer"
          href="/login/customer"
          title={
            <div className="flex items-center space-x-2">
              <FaUserTie className="text-2xl" />
              <span className="font-semibold text-center">Customer</span>
            </div>
          }
        />
      </Tabs>
      <Routes>
        <Route path="/employer" element={<EmployeeLogin />} />
        <Route path="/artisian" element={<ArtisanLoginPage />} />
        <Route path="/customer" element={<CustomerLoginPage />} />
      </Routes>
    </div>
  );
};

export default Onboarding;
