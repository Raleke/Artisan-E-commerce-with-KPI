import { useState } from "react";
import { FaUser, FaUserTie } from "react-icons/fa";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { Spinner, Tab, Tabs } from "@heroui/react";
import EmployerSignupPage from "./EmployerSignupPage.jsx";
import ArtisanSignup from "./ArtisanSignupPage.jsx";
const SignupOnbaording = () => {
  const navigate = useNavigate();
  const { loading, setLoading } = useState(false);

  const { pathname } = useLocation();

  if (loading) {
    return <Spinner />; // Show loader while loading
  }

  return (
    <div className="flex w-full min-h-screen flex-col p-4 px-8 mt-8">
      <Tabs
        aria-label="Options"
        selectedKey={pathname}
        color="primary"
        variant="bordered"
      >
        <Tab
          key="/signup/employer"
          href="/signup/employer"
          title={
            <div className="flex items-center space-x-2">
              <FaUserTie className="text-2xl" />
              <span className="font-semibold text-center">Employer</span>
            </div>
          }
        />
        <Tab
          key="/signup/artisian"
          href="/signup/artisian"
          title={
            <div className="flex items-center space-x-2">
              <FaUser className="text-2xl" />
              <span className="font-semibold text-center">Artisan</span>
            </div>
          }
        />
      </Tabs>
      <Routes>
        <Route path="/employer" element={<EmployerSignupPage />} />
        <Route path="/artisian" element={<ArtisanSignup />} />
      </Routes>
    </div>
  );
};

export default SignupOnbaording;
