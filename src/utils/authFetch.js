import { auth } from "../firebase/firebase.init";

export const authFetch = async (url, options = {}) => {
  const user = auth.currentUser;

  // ✅ stop sending requests that will 401
  if (!user) {
    throw new Error("Auth not ready: no currentUser");
  }

  const token = await user.getIdToken(true); // force refresh

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  // ✅ only set JSON header if body is not FormData
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, { ...options, headers });
};
