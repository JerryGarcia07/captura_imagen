import { useState, useRef, useEffect, type ChangeEvent } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import KpopFolderForm from "../components/forms/KpopFolderForm";
import KpopFolderPreview from "../components/preview/KpopFolderPreview";
import { downloadImage } from "../utils/export";
import { shareImageNative } from "../utils/share";

interface ITunesAlbumResult {
  artistName?: string;
  collectionName?: string;
  artworkUrl100?: string;
}

export default function KpopFolder() {
  // Estados centralizados
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [tabColor, setTabColor] = useState("#FF5722");
  const [textColor, setTextColor] = useState("#FF5FA2");
  const [format, setFormat] = useState("ico");
  const [showModal, setShowModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Referencia para la captura
  const previewRef = useRef<HTMLDivElement>(null);

  // Liberar ObjectURLs previos al cambiar de imagen o desmontar
  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

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

  // Búsqueda en la iTunes Search API
  const handleSearchITunes = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError("");

    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
        searchQuery,
      )}&entity=album&limit=5`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`iTunes respondió con estado ${response.status}`);
      }

      const data: { results?: ITunesAlbumResult[] } = await response.json();
      const validResult = data.results?.find((r) => r.artworkUrl100);

      if (validResult) {
        setName(validResult.collectionName || validResult.artistName || "");
        setImage(
          validResult.artworkUrl100!.replace("100x100bb", "600x600bb"),
        );
        setError("");
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error consultando iTunes:", error);
      setShowModal(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("⚠️ El archivo seleccionado debe ser una imagen válida.");
      return;
    }
    setError("");
    setImage(URL.createObjectURL(file));
  };

  const handleClear = () => {
    setSearchQuery("");
    setName("");
    setImage(null);
    setTabColor("#FF5722");
    setTextColor("#FF5FA2");
    setFormat("ico");
    setError("");
  };

  const handleDownload = async () => {
    if (!validateFields() || !previewRef.current) return;
    setIsProcessing(true);
    try {
      await downloadImage(previewRef.current, format, name.trim());
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!validateFields() || !previewRef.current) return;
    setIsProcessing(true);
    try {
      await shareImageNative(previewRef.current, name.trim());
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 bg-gray-50 transition-colors duration-300 relative">
      <Header />

      <main className="flex-grow flex justify-center items-center p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-8">
          {/* Panel Izquierdo: Formulario */}
          <KpopFolderForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchITunes={handleSearchITunes}
            name={name}
            setName={setName}
            image={image}
            handleImageUpload={handleImageUpload}
            tabColor={tabColor}
            setTabColor={setTabColor}
            textColor={textColor}
            setTextColor={setTextColor}
            format={format}
            setFormat={setFormat}
            handleDownload={handleDownload}
            handleClear={handleClear}
            handleShare={handleShare}
            isSearching={isSearching}
            isProcessing={isProcessing}
            error={error}
          />

          {/* Panel Derecho: Previsualización */}
          <KpopFolderPreview
            ref={previewRef}
            name={name}
            image={image}
            tabColor={tabColor}
            textColor={textColor}
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
              No pudimos encontrar el grupo o álbum en iTunes. Intenta con otro
              término.
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

      <Footer />
    </div>
  );
}
