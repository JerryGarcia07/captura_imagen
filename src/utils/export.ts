import { toPng, toJpeg, toCanvas } from "html-to-image";

// Función auxiliar para forzar la descarga en el navegador
const triggerDownload = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
};

export const downloadImage = async (
  element: HTMLElement,
  format: string,
  fileName: string,
) => {
  try {
    const cleanName = fileName.trim() || "CaptureImg";

    if (format === "ico") {
      const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2 });

      // 1. Redimensionar a 128x128 usando un Canvas
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = dataUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(new Error("No se pudo cargar la imagen para convertir a ICO."));
      });
      ctx?.drawImage(img, 0, 0, 128, 128);

      // 2. Convertir el Canvas a binario y crear la cabecera real de .ico
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("No se pudo generar el blob PNG.");

      const arrayBuffer = await blob.arrayBuffer();
      const pngUint8Array = new Uint8Array(arrayBuffer);

      // Estructura binaria de un archivo .ico
      const icoBuffer = new ArrayBuffer(22 + pngUint8Array.length);
      const view = new DataView(icoBuffer);

      view.setUint16(0, 0, true); // Reservado
      view.setUint16(2, 1, true); // Tipo (1 = ICO)
      view.setUint16(4, 1, true); // Cantidad de imágenes
      view.setUint8(6, 128); // Ancho
      view.setUint8(7, 128); // Alto
      view.setUint8(8, 0); // Paleta
      view.setUint8(9, 0); // Reservado
      view.setUint16(10, 1, true); // Planos de color
      view.setUint16(12, 32, true); // Bits por pixel
      view.setUint32(14, pngUint8Array.length, true); // Tamaño de la imagen
      view.setUint32(18, 22, true); // Offset de los datos

      const icoArray = new Uint8Array(icoBuffer);
      icoArray.set(pngUint8Array, 22); // Pegamos el PNG dentro del ICO

      const icoBlob = new Blob([icoBuffer], { type: "image/x-icon" });
      const icoUrl = URL.createObjectURL(icoBlob);
      triggerDownload(icoUrl, `${cleanName}.ico`);
      setTimeout(() => URL.revokeObjectURL(icoUrl), 1000);
    } else if (format === "jpg") {
      const jpegUrl = await toJpeg(element, {
        quality: 0.9,
        backgroundColor: "#ffffff",
      });
      triggerDownload(jpegUrl, `${cleanName}.jpg`);
    } else if (format === "webp") {
      const canvas = await toCanvas(element, { pixelRatio: 2 });
      const webpUrl = canvas.toDataURL("image/webp", 0.92);
      triggerDownload(webpUrl, `${cleanName}.webp`);
    } else {
      const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2 });
      triggerDownload(dataUrl, `${cleanName}.${format}`);
    }
  } catch (error) {
    console.error("Error al generar la imagen:", error);
    alert("Ocurrió un error al generar la imagen.");
  }
};
