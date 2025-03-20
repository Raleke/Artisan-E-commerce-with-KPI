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
import EmployerProfile from "./EmployerProfilePage";
import EmployerDashboard from "./EmployerDashboardExtraPage";
import UpdatedArtisanProfile from "./EmployerArtisanEmployPage";
import EmployerJobApplicantsPage from "./EmployerJobApplicantsPage";
import EmployerReviewsPage from "./EmployerReviewsPage";

const EmployerDashboardPage = () => {
  const { pathname } = useLocation();

  return (
    <div className="container flex flex-col p-4 px-8 mt-8">
      <GoBack />
      <Routes>
        <Route path="/dashboard" element={<EmployerDashboard />} />

        <Route path="/profile" element={<EmployerProfile />} />

        <Route path="/create-job" element={<EmployerCreateJobPage />} />
        <Route path="/reviews" element={<EmployerReviewsPage />} />

        <Route
          path="/jobs/:jobId/applications"
          element={<EmployerJobApplicantsPage />}
        />

        {/* <Route path="/job/:id/applicants" element={<EmployerJobApplicantsPage />} /> */}
        <Route
          path="/job/:jobId/:artisanId"
          element={<UpdatedArtisanProfile />}
        />
      </Routes>
    </div>
  );
};
export default EmployerDashboardPage;
