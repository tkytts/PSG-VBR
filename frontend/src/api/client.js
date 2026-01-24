import config from "../config";

async function request(path, options = {}) {
  const url = `${config.serverUrl}${path}`;
  const resp = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status} ${resp.statusText}${text ? `: ${text}` : ""}`);
  }
  const contentType = resp.headers.get("content-type") || "";
  return contentType.includes("application/json") ? resp.json() : resp.text();
}

const client = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" })
};

export default client;