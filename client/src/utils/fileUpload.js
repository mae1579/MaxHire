export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const assertPdfFile = (file) => {
  if (!file) return "Wybierz plik PDF";
  const name = file.name?.toLowerCase() || "";
  const isPdf = file.type === "application/pdf" || name.endsWith(".pdf");
  if (!isPdf) return "Wybierz plik PDF";
  if (file.size > MAX_UPLOAD_BYTES) return "Plik może mieć maksymalnie 10 MB";
  return null;
};

export const assertImageFile = (file) => {
  if (!file) return "Wybierz plik graficzny";
  if (!file.type.startsWith("image/")) return "Wybierz plik graficzny";
  if (file.size > MAX_UPLOAD_BYTES) return "Plik może mieć maksymalnie 10 MB";
  return null;
};

export const compressImageFile = (file, maxSize = 480, quality = 0.82) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Nie udało się wczytać zdjęcia"));
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.onerror = () => resolve(String(reader.result || ""));
      image.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });
