import {
  MdDashboard,
  MdNotifications,
  MdOutlineCreate,
  MdOutlinePerson,
} from "react-icons/md";
import { Route, Routes, useLocation } from "react-router";
import JobOffersPage from "./JobOffersPage";
import { Tab, Tabs } from "@heroui/react";
import GoBack from "../components/GoBack";
import EmployerCreateJobPage from "./EmployerCreateJobPage";
import EmployerJobApplicantsPage from "./EmployerJobApplicantsPage";
import EmployerProfile from "./EmployerProfilePage";

const EmployerDashboardPage = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex w-full flex-col p-4 px-8 mt-8">
      <GoBack />
      <Tabs
        aria-label="Options"
        selectedKey={pathname}
        color="primary"
        variant="bordered"
      >
        <Tab
          key="/employer/dashboard"
          href="/employer/dashboard"
          title={
            <div className="flex items-center space-x-2">
              <MdDashboard className="text-2xl" />
              <span className="font-semibold text-center">Dashboard</span>
            </div>
          }
        />
        <Tab
          key="/employer/profile"
          href="/employer/profile"
          title={
            <div className="flex items-center space-x-2">
              <MdOutlinePerson className="text-2xl" />
              <span className="font-semibold text-center">Profile</span>
            </div>
          }
        />
        <Tab
          key="/employer/create-job"
          href="/employer/create-job"
          title={
            <div className="flex items-center space-x-2">
              <MdOutlineCreate className="text-2xl" />
              <span className="font-semibold text-center">Create Job</span>
            </div>
          }
        />
      </Tabs>
      <Routes>
        <Route path="/dashboard" element={<JobOffersPage mode="special" />} />

        <Route path="/profile" element={<EmployerProfile />} />

        <Route path="/create-job" element={<EmployerCreateJobPage />} />
      </Routes>
    </div>
  );
};
export default EmployerDashboardPage;
