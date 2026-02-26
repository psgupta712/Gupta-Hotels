// src/api/axios.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://gupta-hotels-backend.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;
