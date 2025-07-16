import React, { use } from "react";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "../ThemeProvider/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = use(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="transition-all duration-300 w-10 h-10 cursor-pointer"
      
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-gray-700" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggle;
