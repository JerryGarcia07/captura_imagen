import { useState, useRef, ChangeEvent } from "react";
import Header from "../components/layout/Header";
import IconForm from "../components/forms/IconForm";
import IconPreview from "../components/preview/IconPreview";
import { downloadImage } from "../utils/export";
import { shareImageNative } from "../utils/share";

export default function IconCreator() {
  // Estados centralizados
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [color, setColor] = useState("#d1d5db");
  const [format, setFormat] = useState("ico");
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Referencia para la captura
  const previewRef = useRef<HTMLDivElement>(null);

  // Lógica de validación
  const validateFields = () => {
    if (!name.trim()) {
      setError("⚠️ El nombre es obligatorio.");
      return false;
    }
    if (!image) {
      setError("⚠️ Debes seleccionar o buscar una imagen.");
      return false;
    }
    if (!format) {
      setError("⚠️ Debes seleccionar un formato de descarga.");
      return false;
    }
    setError("");
    return true;
  };

  // Lógica de funciones (API, subida, limpieza y exportación)
  const handleSearchTMDB = async () => {
    if (!searchQuery.trim()) return;
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

    if (!API_KEY) {
      console.error("Falta la API Key");
      return;
    }

    try {
      const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=es-ES`;
      const response = await fetch(url);
      const data = await response.json();
      const validResult = data.results?.find((r: any) => r.poster_path);

      if (validResult) {
        setName(
          validResult.title || validResult.name || validResult.original_name,
        );
        setImage(`https://image.tmdb.org/t/p/w500${validResult.poster_path}`);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error consultando TMDB:", error);
      setShowModal(true);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleClear = () => {
    setSearchQuery("");
    setName("");
    setImage(null);
    setColor("#d1d5db");
    setFormat("ico");
    setError("");
  };

  const handleDownload = async () => {
    if (!validateFields() || !previewRef.current) return;
    setIsProcessing(true);
    await downloadImage(previewRef.current, format, name.trim());
    setIsProcessing(false);
  };

  const handleShare = async () => {
    if (!validateFields() || !previewRef.current) return;
    setIsProcessing(true);
    await shareImageNative(previewRef.current, name.trim());
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 bg-gray-50 transition-colors duration-300 relative">
      <Header />

      <main className="flex-grow flex justify-center items-center p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-8">
          {/* Panel Izquierdo: Formulario */}
          <IconForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchTMDB={handleSearchTMDB}
            name={name}
            setName={setName}
            image={image}
            handleImageUpload={handleImageUpload}
            color={color}
            setColor={setColor}
            format={format}
            setFormat={setFormat}
            handleDownload={handleDownload}
            handleClear={handleClear}
            handleShare={handleShare}
            isProcessing={isProcessing}
            error={error}
          />

          {/* Panel Derecho: Previsualización */}
          <IconPreview
            ref={previewRef}
            name={name}
            image={image}
            color={color}
          />
        </div>
      </main>

      {/* Modal de Error */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No hay resultados
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              No pudimos encontrar el nombre o la imagen en TMDB. Intenta con
              otro término.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-[#FF5722] text-white font-bold py-2 px-8 rounded-md hover:bg-orange-600 w-full"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <footer className="text-gray-500 dark:text-gray-400 text-sm py-6 text-center">
        PandaAsia@ copyright 2024
      </footer>
    </div>
  );
}
