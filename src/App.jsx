import { useEffect } from "react";
import "./App.css";
import LandingPageNav from "./components/navbars/LandingPageNav";
import Aos from "aos";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";
import FooterCard from "./components/navbars/FooterCard";
import AboutUsPage from "./pages/AboutUsPage";
import JobOffersPage from "./pages/JobOffersPage";
import SignupOnbaording from "./pages/SingupOnboarding";
import JobDetailsPage from "./pages/JobDetailsPage";
import ArtisanDashboardPage from "./pages/ArtsianDashboardPage";
import EmployerDashboard from "./pages/EmployerDashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";

function App() {
  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <LandingPageNav />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/*" element={<Onboarding />} />
          <Route path="/signup/*" element={<SignupOnbaording />} />
          <Route
            path="/forgot-password/employer"
            element={<ForgotPasswordPage isEmployer={true} />}
          />
          <Route
            path="/forgot-password/artisan"
            element={<ForgotPasswordPage isEmployer={false} />}
          />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/jobs" element={<JobOffersPage />} />
          <Route path="/artisan/*" element={<ArtisanDashboardPage />} />
          <Route path="job/:id" element={<JobDetailsPage />} />
          <Route path="/employer/*" element={<EmployerDashboard />} />
        </Routes>
      </div>
      <FooterCard />
    </>
  );
}

export default App;
