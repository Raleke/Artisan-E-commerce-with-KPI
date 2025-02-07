import { useEffect } from "react";
import "./App.css";
import { Button } from "@heroui/react";
import LandingPageNav from "./components/navbars/LandingPageNav";
import Aos from "aos";
import LandingHeroCard from "./components/cards/LandingHeroCard";

function App() {
  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <LandingPageNav />
      <LandingHeroCard />
      <p className="text-white"> deomo dkgond </p>
    </>
  );
}

export default App;
