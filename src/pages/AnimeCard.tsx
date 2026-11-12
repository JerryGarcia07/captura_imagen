import { useState, useRef, ChangeEvent } from "react";
import Header from "../components/layout/Header";
// IMPORTANTE: Hemos añadido Loader2 a las importaciones
import {
  Download,
  Share2,
  Image as ImageIcon,
  Search,
  Loader2,
} from "lucide-react";
import { downloadImage } from "../utils/export";
import { shareImageNative } from "../utils/share";

const genreTranslations: Record<string, string> = {
  Action: "Acción",
  Adventure: "Aventura",
  Comedy: "Comedia",
  Fantasy: "Fantasía",
  Mystery: "Misterio",
  Horror: "Terror",
  Romance: "Romance",
  "Sci-Fi": "Ciencia Ficción",
  "Slice of Life": "Recuentos de la vida",
  Sports: "Deportes",
  Supernatural: "Sobrenatural",
  "Martial Arts": "Artes Marciales",
  "Super Power": "Superpoderes",
  School: "Escolar",
  Historical: "Histórico",
  Psychological: "Psicológico",
  Thriller: "Suspenso",
};

export default function AnimeCard() {
  const [searchQuery, setSearchQuery] = useState("");

  const [name, setName] = useState("");
  const [episodes, setEpisodes] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("TV");
  const [studio, setStudio] = useState("");
  const [genres, setGenres] = useState("");
  const [score, setScore] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [showScore, setShowScore] = useState(false);
  const [format, setFormat] = useState("png");

  // NUEVO: Estado para saber si las APIs están buscando
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleSearchAnime = async () => {
    if (!searchQuery.trim()) return;

    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    if (!API_KEY) {
      setError("Falta la API Key en el archivo .env");
      return;
    }

    setIsSearching(true);
    setError("");

    let jikanAnime = null;
    let foundInJikan = false;

    // 1. INTENTO aislando JIKAN API (Si el navegador lo bloquea, no rompe el código)
    try {
      const jikanUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}`;
      const jikanRes = await fetch(jikanUrl);

      if (jikanRes.status === 429) {
        console.warn("Jikan API saturada (Rate Limit)");
      } else if (jikanRes.ok) {
        const jikanData = await jikanRes.json();
        jikanAnime = jikanData.data?.[0];
        if (jikanAnime) foundInJikan = true;
      }
    } catch (jikanError) {
      console.warn(
        "Tu navegador o red bloqueó la conexión a Jikan (MyAnimeList):",
        jikanError,
      );
    }

    // 2. INTENTO aislando TMDB (Siempre se ejecuta)
    try {
      let tmdbResult = null;

      let tmdbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=es-ES`;
      let tmdbRes = await fetch(tmdbUrl);
      let tmdbData = await tmdbRes.json();
      tmdbResult = tmdbData.results?.find(
        (r: any) =>
          r.poster_path && (r.media_type === "tv" || r.media_type === "movie"),
      );

      // Si TMDB falla, probar con el nombre en inglés de Jikan
      if (!tmdbResult && foundInJikan && jikanAnime.title_english) {
        tmdbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(jikanAnime.title_english)}&language=es-ES`;
        tmdbRes = await fetch(tmdbUrl);
        tmdbData = await tmdbRes.json();
        tmdbResult = tmdbData.results?.find((r: any) => r.poster_path);
      }

      // 3. CONSOLIDAR LOS DATOS EN LA UI
      if (foundInJikan) {
        // --- ÉXITO TOTAL: Usamos la información exacta de Anime (Jikan) ---
        setName(jikanAnime.title || "");
        setType(jikanAnime.type || "TV");
        setEpisodes(
          jikanAnime.episodes ? jikanAnime.episodes.toString() : "En emisión",
        );
        setYear(
          jikanAnime.year
            ? jikanAnime.year.toString()
            : jikanAnime.aired?.prop?.from?.year?.toString() || "",
        );
        setStudio(
          jikanAnime.studios?.length > 0
            ? jikanAnime.studios[0].name
            : "Desconocido",
        );
        if (jikanAnime.score) setScore(jikanAnime.score.toString());

        // Extraer géneros y demografías (Ej: Shounen, Seinen)
        const rawTags = [
          ...(jikanAnime.genres || []),
          ...(jikanAnime.themes || []),
          ...(jikanAnime.demographics || []),
        ].map((tag: any) => tag.name);

        const translatedGenres = rawTags
          .map((tag: string) => genreTranslations[tag] || tag)
          .join(", ");
        setGenres(translatedGenres);

        // Sinopsis y Póster
        if (tmdbResult) {
          setSynopsis(tmdbResult.overview || jikanAnime.synopsis || "");
          setImage(`https://image.tmdb.org/t/p/w500${tmdbResult.poster_path}`);
        } else {
          setSynopsis(jikanAnime.synopsis || "");
          setImage(jikanAnime.images?.webp?.large_image_url || null);
        }
      } else if (tmdbResult) {
        // --- RESCATE TMDB: Jikan fue bloqueado pero TMDB lo salvó ---
        setName(
          tmdbResult.title || tmdbResult.name || tmdbResult.original_name,
        );
        setType(tmdbResult.media_type === "movie" ? "Película" : "TV");
        setEpisodes(tmdbResult.media_type === "movie" ? "1" : "--");

        const date = tmdbResult.release_date || tmdbResult.first_air_date;
        if (date) setYear(date.substring(0, 4));

        setStudio("--"); // TMDB no sabe el estudio
        setGenres("--"); // TMDB no tiene géneros japoneses
        if (tmdbResult.vote_average)
          setScore(tmdbResult.vote_average.toFixed(1));

        setSynopsis(tmdbResult.overview || "");
        setImage(`https://image.tmdb.org/t/p/w500${tmdbResult.poster_path}`);

        setError(
          "⚠️ Se usó información básica de TMDB porque la API de anime fue bloqueada por tu navegador o red.",
        );
      } else {
        // Ninguna API lo encontró
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error procesando las APIs:", error);
      setShowModal(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleClear = () => {
    setSearchQuery("");
    setName("");
    setEpisodes("");
    setYear("");
    setType("TV");
    setStudio("");
    setGenres("");
    setScore("");
    setSynopsis("");
    setImage(null);
    setShowScore(false);
    setFormat("png");
    setError("");
  };

  const validateFields = () => {
    if (!name.trim() || !image) {
      setError("⚠️ El nombre y la imagen son obligatorios.");
      return false;
    }
    setError("");
    return true;
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

      <main className="flex-grow flex justify-center items-start p-8 overflow-x-hidden">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4">
          {/* PANEL IZQUIERDO: Formulario */}
          <div className="bg-[#FF5722] p-8 rounded-xl shadow-xl text-white">
            <h2 className="text-2xl font-bold text-center mb-6">
              Tarjeta Anime
            </h2>

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
                    <Loader2
                      size={20}
                      className="animate-spin text-orange-400"
                    />
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

          {/* PANEL DERECHO: Previsualización */}
          <div className="flex justify-center items-start p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner overflow-x-auto min-h-[600px]">
            <div
              ref={previewRef}
              className="relative w-[512px] flex-shrink-0 flex flex-col bg-gradient-to-b from-[#5c6e64] to-[#2c3d33] drop-shadow-2xl font-sans"
            >
              <div className="w-full bg-gray-300 flex items-center justify-center p-8 relative">
                {image ? (
                  <img
                    src={image}
                    alt="Poster"
                    className="w-full h-auto max-h-[500px] object-contain rounded-md shadow-2xl border-4 border-gray-700"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-[400px] bg-gray-400 rounded-md border-8 border-gray-600 flex justify-center items-center">
                    <ImageIcon size={80} className="text-gray-500" />
                  </div>
                )}

                {showScore && score && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white font-bold text-xl w-14 h-14 flex items-center justify-center rounded-full shadow-lg border-2 border-white">
                    {score}
                  </div>
                )}
              </div>

              <div className="p-8 text-white">
                <h3 className="text-3xl font-bold mb-4 tracking-wide leading-tight">
                  {name || "Name Anime"}
                </h3>

                <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-sm font-semibold mb-4 text-gray-100">
                  <span>Caps: {episodes || "--"}</span>
                  <span className="text-white/40">|</span>
                  <span>{year || "Año"}</span>
                  <span className="text-white/40">|</span>
                  <span>{type === "Movie" ? "Película" : type}</span>
                  <span className="text-white/40">|</span>
                  <span>{studio || "Studio"}</span>
                </div>

                <div className="text-sm font-semibold mb-4 text-gray-200">
                  Géneros: {genres || "--"}
                </div>

                <hr className="border-white/30 mb-4" />

                <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
                  {synopsis || "Sipnopsis... Aquí aparecerá la descripción."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No hay resultados
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              No pudimos encontrar el nombre. Intenta con su nombre oficial.
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
    </div>
  );
}
