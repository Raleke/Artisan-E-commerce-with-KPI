import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "aos/dist/aos.css";
import "swiper/swiper-bundle.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { HeroUIProvider } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./adapters/api.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <HeroUIProvider>
            <App />
          </HeroUIProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
