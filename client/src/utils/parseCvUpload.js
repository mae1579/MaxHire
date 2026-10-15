import api from "../api/client";

export const parseCvUpload = async (file) => {
  const data = new FormData();
  data.append("cvFile", file);
  const response = await api.post("/register/registerAi/cv", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data;
};
