import { useEffect } from "react";
import "./App.css";
import LandingPageNav from "./components/navbars/LandingPageNav";
import Aos from "aos";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";

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
      </Routes>
    </>
  );
}

export default App;
