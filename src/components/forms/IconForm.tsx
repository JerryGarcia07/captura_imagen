import type { ChangeEvent } from "react";
import { Search, Download, Share2 } from "lucide-react";

interface IconFormProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleSearchTMDB: () => void;
  name: string;
  setName: (val: string) => void;
  image: string | null;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  color: string;
  setColor: (val: string) => void;
  format: string;
  setFormat: (val: string) => void;
  handleDownload: () => void;
  handleClear: () => void;
  handleShare: () => void;
  isProcessing: boolean;
  error: string;
}

export default function IconForm({
  searchQuery,
  setSearchQuery,
  handleSearchTMDB,
  name,
  setName,
  image,
  handleImageUpload,
  color,
  setColor,
  format,
  setFormat,
  handleDownload,
  handleClear,
  handleShare,
  isProcessing,
  error,
}: IconFormProps) {
  return (
    <div className="bg-[#FF5722] p-8 rounded-xl shadow-xl text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Creacion de Icon</h2>

      <div className="space-y-5">
        {/* Buscador TMDB */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar en TMDB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchTMDB()}
            className="flex-grow px-3 py-2 text-gray-900 rounded bg-white outline-none"
          />
          <button
            onClick={handleSearchTMDB}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            <Search size={20} />
          </button>
        </div>

        <hr className="border-orange-400" />

        {/* Input Nombre */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre (Editable)
          </label>
          <input
            type="text"
            placeholder="Nombre de la caja"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-gray-900 rounded bg-white outline-none"
          />
        </div>

        {/* Input Archivo */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Imagen (Sobrescribir manual)
          </label>
          <div className="flex items-center gap-2 text-sm bg-white rounded overflow-hidden">
            <label className="bg-gray-800 text-gray-200 px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors whitespace-nowrap">
              Seleccionar archivo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <span className="text-gray-500 px-2 truncate">
              {image ? "Imagen cargada" : "Ningún archivo"}
            </span>
          </div>
        </div>

        {/* Selector de Color */}
        <div className="flex items-center gap-4 bg-white/10 p-3 rounded">
          <span className="text-sm font-medium">Color de fondo:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-8 cursor-pointer border-0 p-0 rounded bg-transparent"
          />
        </div>

        {/* Select de Formatos */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Formato de descarga
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 text-gray-900 rounded bg-white outline-none appearance-none cursor-pointer"
          >
            <option value="ico">Formato ICO (Windows Icon)</option>
            <option value="png">Formato PNG (Transparente)</option>
            <option value="jpg">Formato JPG (Fondo blanco)</option>
            <option value="webp">Formato WEBP (Web)</option>
          </select>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-900/50 border border-red-400 text-red-100 px-4 py-2 rounded text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="flex-1 bg-white text-black font-bold py-3 rounded border-2 border-transparent hover:bg-gray-100 transition-colors flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Download size={20} />
            {isProcessing ? "Procesando..." : "Descargar"}
          </button>
          <button
            onClick={handleClear}
            className="flex-1 bg-[#FF5722] text-white font-bold py-3 rounded border-2 border-white/30 hover:bg-orange-600 transition-colors"
          >
            Limpiar
          </button>
        </div>

        <button
          onClick={handleShare}
          disabled={isProcessing}
          className="w-full bg-[#111827] text-white font-bold py-3 rounded mt-2 hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
        >
          <Share2 size={20} />
          Compartir en Redes
        </button>
      </div>
    </div>
  );
}
