// ─────────────────────────────────────────────────────────────
//  src/hooks/useFetch.js
//
//  A simple reusable hook. You give it a URL, it gives back:
//    - data    → the response from the API (null while loading)
//    - loading → true while the request is in progress
//    - error   → any error that happened
//
//  Usage example:
//    const { data, loading, error } = useFetch("/hotel?city=Delhi");
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const useFetch = (url) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // This function runs every time the URL changes
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(url);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // re-runs if URL changes (e.g. new search filters)

  return { data, loading, error };
};

export default useFetch;
