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
import EmployerCreateJobPage from "./pages/EmployerCreateJobPage";
import EmployerJobApplicantsPage from "./pages/EmployerJobApplicantsPage";
import EmployerDashboard from "./pages/EmployerDashboardPage";

function App() {
  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <LandingPageNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/*" element={<Onboarding />} />
        <Route path="/signup/*" element={<SignupOnbaording />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/jobs" element={<JobOffersPage />} />
        <Route path="/artisan/*" element={<ArtisanDashboardPage />} />
        <Route path="job/:id" element={<JobDetailsPage />} />
        <Route path="/employer/*" element={<EmployerDashboard />} />
        <Route
          path="/employer/job/:id/applicants"
          element={<EmployerJobApplicantsPage />}
        />
      </Routes>
      <FooterCard />
    </>
  );
}

export default App;
