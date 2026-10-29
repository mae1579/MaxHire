import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "";

const api = axios.create({
  baseURL: `${API_URL}/backend`,
  withCredentials: true,
});

let onUnauthorized = null;

export const setOnUnauthorized = (fn) => {
  onUnauthorized = fn;
};

const SKIP_AUTH_PATHS = [
  "/login",
  "/register",
  "/edit/user/forgetPassword",
  "/edit/user/changePassword",
];

const isSkippedAuthCall = (url = "") =>
  SKIP_AUTH_PATHS.some((path) => url.includes(path));

const isSessionError = (error) => {
  const status = error.response?.status;
  if (status === 401) return true;
  if (status !== 403) return false;
  const payload = error.response?.data;
  const message =
    typeof payload === "string"
      ? payload
      : payload?.message || "";
  return /zalogowan/i.test(String(message));
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    if (!isSkippedAuthCall(url) && isSessionError(error)) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export default api;
