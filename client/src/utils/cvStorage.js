export const cvSavedKey = (userId) => `cv-saved-${userId}`;

export const getSavedCvMeta = (userId) => {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(cvSavedKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setSavedCvMeta = (userId, meta) => {
  if (!userId) return;
  localStorage.setItem(cvSavedKey(userId), JSON.stringify(meta));
};

export const pickCvUrl = (source) => {
  if (!source) return "";
  if (typeof source === "string" && source.startsWith("http")) return source;
  if (typeof source !== "object") return "";
  const nested = source.message && !Array.isArray(source.message) ? source.message : source;
  return (
    nested.cvUrl ||
    nested.cv ||
    nested.cvFile ||
    nested.cv_url ||
    nested.url ||
    ""
  );
};
