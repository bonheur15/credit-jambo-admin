import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let token = localStorage.getItem("jwt");

  if (!token) {
    window.location.href = "/";
    throw new Error("No token found");
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(`${API_URL}${url}`, options);

  if (response.status === 401) {
    toast.error("Session expired. Please log in again.");
    localStorage.removeItem("jwt");
    window.location.href = "/";
    throw new Error("Session expired");
  }

  return response;
};