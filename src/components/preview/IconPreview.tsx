import { forwardRef } from "react";
import { Image as ImageIcon } from "lucide-react";

interface IconPreviewProps {
  name: string;
  image: string | null;
  color: string;
}

const IconPreview = forwardRef<HTMLDivElement, IconPreviewProps>(
  ({ name, image, color }, ref) => {
    return (
      <>
        <div className="flex justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner min-h-[500px]">
          <div
            ref={ref}
            className="relative flex items-end drop-shadow-2xl bg-transparent p-8"
          >
            <section className="w-full h-full flex justify-center items-center">
              <div className={`w-[324px] h-[512px] relative border-none`}>
                <div className="bg-slate-950 w-[281.5px] h-[497.5px] absolute top-0 bottom-0 right-0 left-0 m-auto img-fondo01 border-none"></div>
                <div className="absolute w-[35px] h-[480px] img-etiqueta-container left-[1.35rem] bottom-0 top-0 my-auto border-none">
                  <div className="w-full h-full origin-right img-etiqueta01 img-etiqueta-background border-none"></div>
                </div>
                <div className="absolute w-[35px] h-[480px] img-etiqueta-container left-[1.35rem] bottom-0 top-0 my-auto border-none">
                  <div
                    className={`w-full h-full origin-right img-etiqueta01 opacity-50 border-none`}
                    style={{ backgroundColor: color }}
                  ></div>
                </div>
                <div className="absolute w-[35px] h-[480px] img-etiqueta-container left-[1.35rem] bottom-0 top-0 my-auto border-none">
                  <div className="w-auto h-full origin-right img-etiqueta01 flex items-center justify-center relative border-none">
                    <span className="absolute whitespace-nowrap rotate-90 font-bold text-2xl text-white border-none">
                      {name || "Nombre"}
                    </span>
                  </div>
                </div>
                <div className="w-[258px] h-[481.5px] ChangePertive left-16 top-0 bottom-0 my-auto border-none">
                  {image ? (
                    <img
                      src={image}
                      alt="Cover"
                      className="w-full h-full object-cover origin-left ChangePertiveImg border-none"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <ImageIcon
                      size={64}
                      className="text-gray-400 w-full h-full object-cover origin-left ChangePertiveImg border-none"
                    />
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  },
);

export default IconPreview;
