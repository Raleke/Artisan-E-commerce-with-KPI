import { MdDashboard, MdNotifications, MdOutlinePerson } from "react-icons/md";
import { Route, Routes, useLocation } from "react-router";
import JobOffersPage from "./JobOffersPage";
import { Tab, Tabs } from "@heroui/react";
import Notifications from "./ArtisanApplicationStatusPage";
import ArtisanProfile from "./ArtisanProfilePage";

const ArtisanDashboardPage = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex w-full flex-col p-4 px-8 mt-8">
      <Tabs
        aria-label="Options"
        selectedKey={pathname}
        color="primary"
        variant="bordered"
      >
        <Tab
          key="/artisan/dashboard"
          href="/artisan/dashboard"
          title={
            <div className="flex items-center space-x-2">
              <MdDashboard className="text-2xl" />
              <span className="font-semibold text-center">Dashboard</span>
            </div>
          }
        />
        <Tab
          key="/artisan/profile"
          href="/artisan/profile"
          title={
            <div className="flex items-center space-x-2">
              <MdOutlinePerson className="text-2xl" />
              <span className="font-semibold text-center">Profile</span>
            </div>
          }
        />
        <Tab
          key="/artisan/notification"
          href="/artisan/notification"
          title={
            <div className="flex items-center space-x-2">
              <MdNotifications className="text-2xl" />
              <span className="font-semibold text-center">Notification</span>
            </div>
          }
        />
      </Tabs>
      <Routes>
        <Route path="/dashboard" element={<JobOffersPage />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/profile" element={<ArtisanProfile />} />
      </Routes>
    </div>
  );
};
export default ArtisanDashboardPage;
