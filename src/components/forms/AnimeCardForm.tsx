import type { ChangeEvent } from "react";
import { Download, Share2, Search, Loader2 } from "lucide-react";

interface AnimeCardFormProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleSearchAnime: () => void;
  name: string;
  setName: (val: string) => void;
  episodes: string;
  setEpisodes: (val: string) => void;
  year: string;
  setYear: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  studio: string;
  setStudio: (val: string) => void;
  genres: string;
  setGenres: (val: string) => void;
  score: string;
  setScore: (val: string) => void;
  synopsis: string;
  setSynopsis: (val: string) => void;
  image: string | null;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  showScore: boolean;
  setShowScore: (val: boolean) => void;
  format: string;
  setFormat: (val: string) => void;
  handleDownload: () => void;
  handleClear: () => void;
  handleShare: () => void;
  isSearching: boolean;
  isProcessing: boolean;
  error: string;
}

export default function AnimeCardForm({
  searchQuery,
  setSearchQuery,
  handleSearchAnime,
  name,
  setName,
  episodes,
  setEpisodes,
  year,
  setYear,
  type,
  setType,
  studio,
  setStudio,
  genres,
  setGenres,
  score,
  setScore,
  synopsis,
  setSynopsis,
  image,
  handleImageUpload,
  showScore,
  setShowScore,
  format,
  setFormat,
  handleDownload,
  handleClear,
  handleShare,
  isSearching,
  isProcessing,
  error,
}: AnimeCardFormProps) {
  return (
    <div className="bg-[#FF5722] p-8 rounded-xl shadow-xl text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Tarjeta Anime</h2>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar anime (Ej. Kusuriya no Hitorigoto)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !isSearching && handleSearchAnime()
            }
            disabled={isSearching}
            className="flex-grow px-3 py-2 text-gray-900 rounded bg-white outline-none disabled:bg-gray-200"
          />

          {/* BOTÓN CON ESTADO DE CARGA */}
          <button
            onClick={handleSearchAnime}
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

        <hr className="border-orange-400 my-4" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-2 px-3 py-2 text-gray-900 rounded bg-white outline-none font-medium"
          />

          <input
            type="text"
            placeholder="Episodios"
            value={episodes}
            onChange={(e) => setEpisodes(e.target.value)}
            className="px-3 py-2 text-gray-900 rounded bg-white outline-none"
          />
          <input
            type="text"
            placeholder="Año"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-3 py-2 text-gray-900 rounded bg-white outline-none"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 text-gray-900 rounded bg-white outline-none appearance-none cursor-pointer"
          >
            <option value="TV">TV</option>
            <option value="Movie">Película</option>
            <option value="OVA">OVA</option>
            <option value="ONA">ONA</option>
            <option value="Special">Especial</option>
          </select>
          <input
            type="text"
            placeholder="Studio"
            value={studio}
            onChange={(e) => setStudio(e.target.value)}
            className="px-3 py-2 text-gray-900 rounded bg-white outline-none"
          />

          <input
            type="text"
            placeholder="Géneros"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            className="px-3 py-2 text-gray-900 rounded bg-white outline-none"
          />
          <input
            type="text"
            placeholder="Puntaje (Ej. 8.5)"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="px-3 py-2 text-gray-900 rounded bg-orange-100 outline-none"
          />

          <textarea
            placeholder="Sinopsis"
            rows={4}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="col-span-2 px-3 py-2 text-gray-900 rounded bg-white outline-none resize-none"
          />
        </div>

        <div className="mt-6 space-y-4">
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

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showScore}
              onChange={(e) => setShowScore(e.target.checked)}
              className="w-4 h-4 rounded-full appearance-none bg-gray-800 checked:bg-black ring-2 ring-transparent checked:ring-white transition-all cursor-pointer"
            />
            Mostrar Puntuación en la tarjeta
          </label>

          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 text-gray-900 rounded bg-white outline-none appearance-none cursor-pointer"
          >
            <option value="png">Formato PNG</option>
            <option value="jpg">Formato JPG</option>
            <option value="webp">Formato WEBP</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-400 text-red-100 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-2">
          <button
            onClick={handleDownload}
            disabled={isProcessing || isSearching}
            className="flex-1 bg-white text-black font-bold py-3 rounded hover:bg-gray-100 transition-colors flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
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
          <Share2 size={20} /> Compartir en Redes
        </button>
      </div>
    </div>
  );
}
