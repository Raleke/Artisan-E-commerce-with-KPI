import { MdDashboard, MdNotifications, MdOutlinePerson } from "react-icons/md";
import { Route, Routes, useLocation } from "react-router";
import JobOffersPage from "./JobOffersPage";
import { Tab, Tabs } from "@heroui/react";
import Notifications from "./ArtisanApplicationStatusPage";
import ArtisanProfile from "./ArtisanProfilePage";
import GoBack from "../components/GoBack";

const ArtisanDashboardPage = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex w-full flex-col p-4 px-8 mt-8">
      <GoBack />
      <Routes>
        <Route path="/dashboard" element={<JobOffersPage mode="special" />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/profile" element={<ArtisanProfile />} />
      </Routes>
    </div>
  );
};
export default ArtisanDashboardPage;
