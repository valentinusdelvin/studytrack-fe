import axios from "axios";

/** Kunci localStorage tempat token login disimpan. */
export const TOKEN_KEY = "studytrack_token";

/**
 * Instance axios untuk seluruh pemanggilan API backend.
 * Base URL diambil dari env `VITE_API_URL` agar bisa dikonfigurasi
 * baik di local maupun di Vercel tanpa hardcode.
 */
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
});

// Menyisipkan token login ke setiap request jika tersedia.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
