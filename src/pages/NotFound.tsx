import { Link } from "react-router-dom";
import { Home, FileQuestion } from "lucide-react";
import Header from "../components/layout/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-8 text-center transition-colors duration-300">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-50 dark:bg-orange-500/10 border-2 border-orange-500 flex items-center justify-center text-orange-500 dark:text-[#FFD8C9]">
            <FileQuestion size={40} />
          </div>

          <h1 className="text-6xl font-bold text-orange-500 mb-2">404</h1>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#FFD8C9] mb-3 transition-colors duration-300">
            Página no encontrada
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-8 leading-relaxed">
            La ruta que intentas visitar no existe o fue movida. Puedes volver
            al inicio para seguir creando imágenes.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#FF5722] text-white font-bold py-3 px-6 rounded hover:bg-orange-600 transition-colors shadow-lg"
          >
            <Home size={20} />
            Volver al inicio
          </Link>
        </div>
      </main>

      <footer className="text-gray-500 dark:text-gray-400 text-sm py-6 text-center">
        PandaAsia@ copyright 2024
      </footer>
    </div>
  );
}
