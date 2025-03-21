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
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import RequireAuth from "./pages/RequireAuth.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

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
          <Route
            path="/artisan/*"
            element={
              <RequireAuth type={"artisan"}>
                <ArtisanDashboardPage />
              </RequireAuth>
            }
          />
          <Route path="job/:id" element={<JobDetailsPage />} />
          <Route
            path="/employer/*"
            element={
              <RequireAuth type={"employer"}>
                <EmployerDashboard />
              </RequireAuth>
            }
          />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth type={"admin"}>
                <AdminDashboardPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <FooterCard />
    </>
  );
}

export default App;
