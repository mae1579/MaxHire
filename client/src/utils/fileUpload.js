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
