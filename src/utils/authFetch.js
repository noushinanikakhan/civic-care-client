import { auth } from "../firebase/firebase.init";

export const authFetch = async (url, options = {}) => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(url, { ...options, headers });
};
