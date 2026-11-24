import type { ChangeEvent } from "react";
import { Search, Download, Share2, Loader2 } from "lucide-react";

interface KpopFolderFormProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleSearchITunes: () => void;
  name: string;
  setName: (val: string) => void;
  image: string | null;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  tabColor: string;
  setTabColor: (val: string) => void;
  textColor: string;
  setTextColor: (val: string) => void;
  format: string;
  setFormat: (val: string) => void;
  handleDownload: () => void;
  handleClear: () => void;
  handleShare: () => void;
  isSearching: boolean;
  isProcessing: boolean;
  error: string;
}

export default function KpopFolderForm({
  searchQuery,
  setSearchQuery,
  handleSearchITunes,
  name,
  setName,
  image,
  handleImageUpload,
  tabColor,
  setTabColor,
  textColor,
  setTextColor,
  format,
  setFormat,
  handleDownload,
  handleClear,
  handleShare,
  isSearching,
  isProcessing,
  error,
}: KpopFolderFormProps) {
  return (
    <div className="bg-[#FF5722] p-8 rounded-xl shadow-xl text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Carpeta K-pop</h2>

      <div className="space-y-5">
        {/* Buscador iTunes */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar grupo o álbum K-pop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !isSearching && handleSearchITunes()
            }
            disabled={isSearching}
            className="flex-grow px-3 py-2 text-gray-900 rounded bg-white outline-none disabled:bg-gray-200"
          />
          <button
            onClick={handleSearchITunes}
            disabled={isSearching}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center disabled:bg-gray-700 min-w-[50px]"
          >
            {isSearching ? (
              <Loader2 size={20} className="animate-spin text-orange-400" />
            ) : (
              <Search size={20} />
            )}
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
            placeholder="Nombre de la carpeta"
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

        {/* Selectores de Color */}
        <div className="flex flex-col gap-3 bg-white/10 p-3 rounded">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">Color de la pestaña:</span>
            <input
              type="color"
              value={tabColor}
              onChange={(e) => setTabColor(e.target.value)}
              className="w-16 h-8 cursor-pointer border-0 p-0 rounded bg-transparent"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">Color del texto:</span>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-16 h-8 cursor-pointer border-0 p-0 rounded bg-transparent"
            />
          </div>
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
            disabled={isProcessing || isSearching}
            className="flex-1 bg-white text-black font-bold py-3 rounded border-2 border-transparent hover:bg-gray-100 transition-colors flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Download size={20} />
            {isProcessing ? "Procesando..." : "Descargar"}
          </button>
          <button
            onClick={handleClear}
            disabled={isSearching}
            className="flex-1 bg-[#FF5722] text-white font-bold py-3 rounded border-2 border-white/30 hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            Limpiar
          </button>
        </div>

        <button
          onClick={handleShare}
          disabled={isProcessing || isSearching}
          className="w-full bg-[#111827] text-white font-bold py-3 rounded mt-2 hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
        >
          <Share2 size={20} />
          Compartir en Redes
        </button>
      </div>
    </div>
  );
}
