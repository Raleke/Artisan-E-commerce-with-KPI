import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "@heroui/react";
import { useTheme } from "../../contexts/ThemeProvider";

const DarkMode = () => {
  const { theme, setTheme } = useTheme();

  const toggleMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button onPress={toggleMode} variant="ghost" isIconOnly size="sm">
      <FaMoon className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <FaSun className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default DarkMode;
