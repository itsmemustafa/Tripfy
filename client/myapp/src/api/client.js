const buildErrorMessage = (payload, fallbackMessage) => {
  if (!payload) return fallbackMessage;
  return payload.msg || payload.message || fallbackMessage;
};

const ACCESS_TOKEN_KEY = "tripfy_access_token";

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token) => {
  if (typeof window === "undefined") return;
  if (!token) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const request = async (url, options = {}) => {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const hasJson = contentType.includes("application/json");
  const payload = hasJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new Error(buildErrorMessage(payload, `Request failed (${response.status})`));
  }

  return payload;
};
