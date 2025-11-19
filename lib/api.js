import axios from "axios";

// Используем переменную окружения или fallback на localhost для разработки
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api";

export const fetchAPI = async (endpoint, params = "") => {
  const url = `${API_URL}/${endpoint}${params}`;
  const res = await axios.get(url);
  return res.data.data;
};