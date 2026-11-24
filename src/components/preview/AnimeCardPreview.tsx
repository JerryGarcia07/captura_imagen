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
    {
      name,
      image,
      episodes,
      year,
      type,
      studio,
      genres,
      score,
      synopsis,
      showScore,
    },
    ref,
  ) => {
    return (
      <>
        <div className="flex justify-center items-start p-4 md:p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner overflow-x-auto min-h-[600px]">
          <section
            ref={ref}
            className="relative w-[512px] flex-shrink-0 flex flex-col bg-gradient-to-b from-[#5c6e64] to-[#2c3d33] drop-shadow-2xl font-sans"
          >
            <div
              className="bg-[#29422F] w-full h-auto border-none"
              // id={idCapture}
            >
              <div className="w-full border-none relative">
                {image ? (
                  <img
                    src={image}
                    alt="Poster"
                    className="w-full max-h-[500px] object-cover border-none"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-[400px] bg-gray-400 rounded-md border-8 border-gray-600 flex justify-center items-center">
                    <ImageIcon size={80} className="text-gray-500" />
                  </div>
                )}

                <div className="w-full h-full bg-gradient-to-t from-[#29422F] absolute top-0 border-none"></div>
                {showScore && score && (
                  <div className="absolute text-white text-8xl font-bold bottom-0 right-2 border-none">
                    {score}
                  </div>
                )}
              </div>
              <div className="text-white p-4 font-bold border-none">
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

                <p className="border-none">Géneros: {genres || "--"}</p>
                <div className="border-b-2 mb-3 mt-1"></div>
                <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
                  {synopsis || "Sipnopsis... Aquí aparecerá la descripción."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  },
);

export default AnimeCardPreview;
