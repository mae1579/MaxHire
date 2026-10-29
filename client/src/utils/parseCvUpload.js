import api from "../api/client";
import { assertPdfFile } from "./fileUpload";

export const parseCvUpload = async (file) => {
  const invalid = assertPdfFile(file);
  if (invalid) {
    const error = new Error(invalid);
    throw error;
  }
  const data = new FormData();
  data.append("cvFile", file);
  const response = await api.post("/register/registerAi/cv", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data;
};
