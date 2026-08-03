const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

export function getResource(resource, signal) {
  return request(`/${resource}`, { signal });
}

export function createResource(resource, item) {
  return request(`/${resource}`, {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export function updateResource(resource, id, item) {
  return request(`/${resource}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(item),
  });
}

export function deleteResource(resource, id) {
  return request(`/${resource}/${id}`, {
    method: "DELETE",
  });
}
