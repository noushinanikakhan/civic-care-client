// utils/authFetch.js
import { auth } from "../firebase/firebase.init";

export const authFetch = async (url, options = {}) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.warn("No current user, auth not ready");
      throw new Error("Authentication required");
    }

    const token = await user.getIdToken(true);
    
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    const isFormData = options.body instanceof FormData;
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      // Token expired or invalid
      console.warn("Auth token expired, forcing refresh");
      const refreshedToken = await user.getIdToken(true);
      headers.Authorization = `Bearer ${refreshedToken}`;
      
      // Retry once with new token
      const retryResponse = await fetch(url, { ...options, headers });
      return retryResponse;
    }
    
    return response;
  } catch (error) {
    console.error("Auth fetch error:", error);
    throw error;
  }
};