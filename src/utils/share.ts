import { toPng } from "html-to-image";

export const shareImageNative = async (
  element: HTMLElement,
  fileName: string,
) => {
  try {
    const cleanName = fileName.trim() || "CaptureImg";

    // Generar la imagen temporal
    const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2 });
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Crear un archivo virtual
    const file = new File([blob], `${cleanName}.png`, { type: "image/png" });

    // Verificar si el navegador soporta compartir archivos nativamente
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: cleanName,
        text: "¡Mira este icono que he generado en CaptureImg!",
        files: [file],
      });
    } else {
      alert(
        "Tu navegador o dispositivo actual no soporta compartir imágenes directamente.",
      );
    }
  } catch (error) {
    // El usuario canceló la acción de compartir o hubo un error
    console.log("Acción de compartir cancelada o fallida:", error);
  }
};
