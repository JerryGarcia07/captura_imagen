import { forwardRef } from "react";
import { Image as ImageIcon } from "lucide-react";

interface AnimeCardPreviewProps {
  name: string;
  image: string | null;
  episodes: string;
  year: string;
  type: string;
  studio: string;
  genres: string;
  score: string;
  synopsis: string;
  showScore: boolean;
}

const AnimeCardPreview = forwardRef<HTMLDivElement, AnimeCardPreviewProps>(
  (
    { name, image, episodes, year, type, studio, genres, score, synopsis, showScore },
    ref,
  ) => {
    return (
      <div className="flex justify-center items-start p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner overflow-x-auto min-h-[600px]">
        <div
          ref={ref}
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
              <span>
                {type === "Movie"
                  ? "Película"
                  : type === "Special"
                    ? "Especial"
                    : type}
              </span>
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
    );
  },
);

export default AnimeCardPreview;
