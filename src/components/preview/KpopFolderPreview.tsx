import { forwardRef } from "react";
import { Image as ImageIcon } from "lucide-react";

interface KpopFolderPreviewProps {
  name: string;
  image: string | null;
  tabColor: string;
  textColor: string;
}

const KpopFolderPreview = forwardRef<HTMLDivElement, KpopFolderPreviewProps>(
  ({ name, image, tabColor, textColor }, ref) => {
    return (
      <div className="flex justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner min-h-[500px]">
        <div ref={ref} className="relative w-[420px] h-[360px] bg-transparent">
          {/* Pestaña superior izquierda */}
          <div
            className="absolute top-0 left-0 w-[190px] h-[64px] rounded-t-2xl overflow-hidden shadow-md z-0"
            style={{ backgroundColor: tabColor }}
          >
            {/* Degradado oscuro hacia abajo para dar profundidad */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/40 pointer-events-none" />
            <span
              className="absolute inset-x-0 top-0 flex h-[48px] items-center px-5 font-bold italic tracking-wide text-lg truncate"
              style={{ color: textColor }}
            >
              {name || "Nombre"}
            </span>
          </div>

          {/* Cuerpo frontal de la carpeta */}
          <div className="absolute top-[52px] left-0 right-0 bottom-0 rounded-2xl rounded-tl-md overflow-hidden bg-slate-300 dark:bg-slate-600 drop-shadow-xl z-10">
            {image ? (
              <img
                src={image}
                alt="Cover"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <ImageIcon size={72} className="text-gray-400" />
              </div>
            )}

            {/* Brillo/borde superior para simular el relieve de la carpeta */}
            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
            <div className="absolute inset-0 rounded-2xl rounded-tl-md ring-1 ring-inset ring-white/20 pointer-events-none" />
          </div>
        </div>
      </div>
    );
  },
);

export default KpopFolderPreview;
