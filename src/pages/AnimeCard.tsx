import { useState, useRef, useEffect, type ChangeEvent } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AnimeCardForm from "../components/forms/AnimeCardForm";
import AnimeCardPreview from "../components/preview/AnimeCardPreview";
import { downloadImage } from "../utils/export";
import { shareImageNative } from "../utils/share";
import { searchTMDB, getTMDBPosterUrl } from "../services/tmdb";
import { searchAniListAnime, type AniListMedia } from "../services/anilist";

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

  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleSearchAnime = async () => {
    if (!searchQuery.trim()) return;

    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    if (!API_KEY) {
      setError("Falta la API Key en el archivo .env");
      return;
    }

    setIsSearching(true);
    setError("");

    let anilistData: AniListMedia | null = null;
    let foundInAnilist = false;

    // 1. INTENTO CON ANILIST (GraphQL)
    try {
      anilistData = await searchAniListAnime(searchQuery);
      foundInAnilist = !!anilistData;
    } catch (anilistError) {
      console.warn("Fallo al conectar con AniList:", anilistError);
    }

    // 2. INTENTO CON TMDB (Para la Sinopsis en Español y Póster)
    try {
      let tmdbResults = await searchTMDB(searchQuery, API_KEY);
      let tmdbResult = tmdbResults.find(
        (r) =>
          r.poster_path && (r.media_type === "tv" || r.media_type === "movie"),
      );

      // Si TMDB no lo encuentra, buscar usando el título en inglés que nos dio AniList
      if (!tmdbResult && foundInAnilist && anilistData?.title?.english) {
        tmdbResults = await searchTMDB(anilistData.title.english, API_KEY);
        tmdbResult = tmdbResults.find((r) => r.poster_path);
      }

      // 3. CONSOLIDAR DATOS EN LA INTERFAZ
      if (foundInAnilist && anilistData) {
        // --- LLENADO EXACTO CON ANILIST ---
        setName(anilistData.title?.romaji || "");

        // Mapear el formato oficial a los valores del <select>
        const formatMap: Record<string, string> = {
          TV: "TV",
          TV_SHORT: "TV",
          MOVIE: "Movie",
          SPECIAL: "Special",
          OVA: "OVA",
          ONA: "ONA",
        };
        setType((anilistData.format && formatMap[anilistData.format]) || "TV");

        setEpisodes(
          anilistData.episodes ? anilistData.episodes.toString() : "En emisión",
        );
        setYear(
          anilistData.seasonYear?.toString() ||
            anilistData.startDate?.year?.toString() ||
            "",
        );
        const studioNodes = anilistData.studios?.nodes ?? [];
        setStudio(
          studioNodes.length > 0 ? studioNodes[0].name : "Desconocido",
        );
        if (anilistData.averageScore)
          setScore((anilistData.averageScore / 10).toString());

        // Procesar Géneros y Demografías
        const demographics = [
          "Shounen",
          "Seinen",
          "Shoujo",
          "Josei",
          "Isekai",
          "Mecha",
        ];
        const mediaTags = (anilistData.tags ?? []).map((t) => t.name);
        const foundDemographics = mediaTags.filter((t) =>
          demographics.includes(t),
        );

        const rawGenres = [...(anilistData.genres ?? []), ...foundDemographics];
        const translatedGenres = rawGenres
          .map((g) => genreTranslations[g] || g)
          .join(", ");
        setGenres(translatedGenres);

        // Sinopsis y Póster
        if (tmdbResult) {
          setSynopsis(
            tmdbResult.overview || "Sinopsis no disponible en español.",
          );
          setImage(getTMDBPosterUrl(tmdbResult.poster_path!));
        } else {
          setSynopsis("Sinopsis no disponible en español.");
          setImage(anilistData.coverImage?.extraLarge || null);
        }
      } else if (tmdbResult) {
        // --- SOLO TMDB (Plan B muy básico) ---
        setName(
          tmdbResult.title ||
            tmdbResult.name ||
            tmdbResult.original_name ||
            "",
        );
        setType(tmdbResult.media_type === "movie" ? "Movie" : "TV");
        setEpisodes(tmdbResult.media_type === "movie" ? "1" : "--");
        const date = tmdbResult.release_date || tmdbResult.first_air_date;
        if (date) setYear(date.substring(0, 4));
        setStudio("--");
        setGenres("--");
        if (tmdbResult.vote_average)
          setScore(tmdbResult.vote_average.toFixed(1));
        setSynopsis(tmdbResult.overview || "");
        setImage(getTMDBPosterUrl(tmdbResult.poster_path!));

        setError(
          "⚠️ El anime no se encontró en la base de datos principal, se usó información básica.",
        );
      } else {
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

      <main className="flex-grow flex justify-center items-start p-8 overflow-x-hidden">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4">
          <AnimeCardForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchAnime={handleSearchAnime}
            name={name}
            setName={setName}
            episodes={episodes}
            setEpisodes={setEpisodes}
            year={year}
            setYear={setYear}
            type={type}
            setType={setType}
            studio={studio}
            setStudio={setStudio}
            genres={genres}
            setGenres={setGenres}
            score={score}
            setScore={setScore}
            synopsis={synopsis}
            setSynopsis={setSynopsis}
            image={image}
            handleImageUpload={handleImageUpload}
            showScore={showScore}
            setShowScore={setShowScore}
            format={format}
            setFormat={setFormat}
            handleDownload={handleDownload}
            handleClear={handleClear}
            handleShare={handleShare}
            isSearching={isSearching}
            isProcessing={isProcessing}
            error={error}
          />

          <AnimeCardPreview
            ref={previewRef}
            name={name}
            image={image}
            episodes={episodes}
            year={year}
            type={type}
            studio={studio}
            genres={genres}
            score={score}
            synopsis={synopsis}
            showScore={showScore}
          />
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

      <Footer />
    </div>
  );
}
