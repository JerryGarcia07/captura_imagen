import { useState, useRef, ChangeEvent } from "react";
import Header from "../components/layout/Header";
import { Download, Share2, Image as ImageIcon } from "lucide-react";

export default function IconCreator() {
  // Estados para controlar los datos del formulario
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [color, setColor] = useState("#000000");
  const [showSticker, setShowSticker] = useState(false);

  // Referencia al elemento que vamos a convertir en imagen más adelante
  const previewRef = useRef<HTMLDivElement>(null);

  // Manejar la subida de imagen local
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Limpiar el formulario
  const handleClear = () => {
    setName("");
    setImage(null);
    setColor("#000000");
    setShowSticker(false);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 bg-gray-50 transition-colors duration-300">
      <Header />

      <main className="flex-grow flex justify-center items-center p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Panel Izquierdo: Formulario Naranja */}
          <div className="bg-[#FF5722] p-8 rounded-md shadow-xl text-white">
            <h2 className="text-2xl font-bold text-center mb-6">
              Creacion de Icon
            </h2>

            <div className="space-y-4">
              {/* Input Nombre */}
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 rounded bg-white outline-none"
              />

              {/* Input Archivo */}
              <div className="flex items-center gap-2 text-sm bg-white rounded overflow-hidden">
                <label className="bg-gray-800 text-gray-200 px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors">
                  Seleccionar archivo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <span className="text-gray-500 px-2 truncate">
                  {image ? "Imagen cargada" : "Ningún archivo seleccionado"}
                </span>
              </div>

              {/* Selector de Color */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  Selecciona el color:
                </span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-24 h-8 cursor-pointer border-0 p-0"
                />
              </div>

              {/* Checkbox */}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSticker}
                  onChange={(e) => setShowSticker(e.target.checked)}
                  className="w-4 h-4 rounded-full appearance-none bg-gray-800 checked:bg-black ring-2 ring-transparent checked:ring-white transition-all cursor-pointer"
                />
                Mostrar el sticker oculto
              </label>

              {/* Select Option */}
              <select className="w-full px-3 py-2 text-gray-900 rounded bg-white outline-none appearance-none">
                <option>Select</option>
                <option value="op1">Opción 1</option>
                <option value="op2">Opción 2</option>
              </select>

              {/* Botones de Acción */}
              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-white text-black font-semibold py-2 rounded border-2 border-transparent hover:bg-gray-100 transition-colors flex justify-center items-center gap-2">
                  <Download size={18} />
                  Descargar
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 bg-[#FF5722] text-black font-semibold py-2 rounded border-2 border-black hover:bg-orange-600 transition-colors"
                >
                  Limpiar
                </button>
              </div>

              {/* Botón Compartir */}
              <button className="w-full bg-[#111827] text-white font-semibold py-2 rounded mt-2 hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">
                <Share2 size={18} />
                Compartir
              </button>
            </div>
          </div>

          {/* Panel Derecho: Previsualización de la Caja (Efecto 2D) */}
          <div className="flex justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner min-h-[400px]">
            {/* Contenedor principal a exportar */}
            <div
              ref={previewRef}
              className="relative flex items-end drop-shadow-2xl bg-white p-8"
            >
              {/* Lomo de la caja (Lado izquierdo) */}
              <div className="w-16 h-80 bg-gray-300 border-2 border-black flex items-center justify-center transform -skew-y-12 translate-y-[1.1rem] translate-x-[2px] z-0">
                <span
                  className="-rotate-90 whitespace-nowrap text-xl font-bold text-gray-500 tracking-widest origin-center"
                  style={{ color: color !== "#000000" ? color : undefined }}
                >
                  {name || "Nombre"}
                </span>
              </div>

              {/* Portada de la caja (Frente) */}
              <div className="w-64 h-80 bg-white border-2 border-black flex items-center justify-center p-4 relative z-10">
                <div className="w-full h-full border-4 border-gray-600 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100 relative">
                  {image ? (
                    <img
                      src={image}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={64} className="text-gray-400" />
                  )}

                  {/* Sticker Oculto condicional */}
                  {showSticker && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow flex items-center justify-center text-white text-xs font-bold rotate-12">
                      NEW
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-gray-500 dark:text-gray-400 text-sm py-6 text-center">
        PandaAsia@ copyright 2024
      </footer>
    </div>
  );
}
