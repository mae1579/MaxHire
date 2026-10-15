export const parseJsonField = (value, fallback = null) => {
  try {
    if (value == null || value === "") return fallback;
    let out = typeof value === "string" ? JSON.parse(value) : value;
    if (typeof out === "string") out = JSON.parse(out);
    return out;
  } catch {
    return fallback;
  }
};

export const parseTechTags = (tech) => {
  const parsed = parseJsonField(tech, []);
  return Array.isArray(parsed) ? parsed : [];
};

export const parseLinks = (links) => {
  const parsed = parseJsonField(links, {});
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? parsed
    : {};
};
