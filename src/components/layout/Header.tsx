import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Camera, Sun, Moon } from "lucide-react";

export default function Header() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="w-full flex justify-center px-8 py-4 border-b dark:border-gray-800 border-gray-200 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Contenedor interno alineado con el contenido principal */}
      <div className="w-full max-w-5xl flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
        >
          <Camera size={28} />
          <span className="text-xl font-bold dark:text-white text-gray-900">
            CaptureImg
          </span>
        </Link>

        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </header>
  );
}
