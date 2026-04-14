const buildErrorMessage = (payload, fallbackMessage) => {
  if (!payload) return fallbackMessage;
  return payload.msg || payload.message || fallbackMessage;
};

export const request = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const hasJson = contentType.includes("application/json");
  const payload = hasJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new Error(buildErrorMessage(payload, `Request failed (${response.status})`));
  }

  return payload;
};
