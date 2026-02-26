// src/api/axios.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // ← matches your backend PORT 8000
  withCredentials: true,                // ← needed to send JWT cookies
});

export default axiosInstance;