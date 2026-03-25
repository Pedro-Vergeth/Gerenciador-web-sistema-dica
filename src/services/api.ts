import axios from "axios";

export function getAuthToken() {
  return localStorage.getItem('@dica-api:token') ?? localStorage.getItem('@Dica API:token');
}

export const api = axios.create({
  baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});