import axios from "axios";

const API_URL = "http://localhost:1337/api";

export const fetchAPI = async (endpoint, params = "") => {
  const url = `${API_URL}/${endpoint}${params}`;
  const res = await axios.get(url);
  return res.data.data;
};