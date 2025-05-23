import { Route, Routes, useLocation } from "react-router";
import GoBack from "../components/GoBack";
import ArtisanDetailsPage from "./CustomerSummarypage";
import CustomerArtisanPage from "./CustomerArtisanPage";
import CustomerReviewsPage from "./CustomerReviewPage";

const CustomerDashboardPage = () => {
  return (
    <div className="flex w-full flex-col p-4 px-8 mt-8">
      <GoBack />
      <Routes>
        <Route path="/dashboard" element={<ArtisanDetailsPage />} />
        <Route path="/artisan/:artisanId" element={<CustomerArtisanPage />} />
        <Route path="/reviews" element={<CustomerReviewsPage />} />
      </Routes>
    </div>
  );
};
export default CustomerDashboardPage;
