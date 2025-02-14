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
      </Routes>
      <FooterCard />
    </>
  );
}

export default App;
