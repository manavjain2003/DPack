/**
 * Lightweight API client — all calls go to /api/*
 * Token is stored in localStorage under "dpack_token"
 */

const TOKEN_KEY = "dpack_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(path, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

// ── Auth ─────────────────────────────────────────────────
export const authAPI = {
  sendOtp: (mobile) =>
    request("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ mobile }),
    }),

  verifyOtp: (mobile, otp) =>
    request("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ mobile, otp }),
    }),

  me: () => request("/api/auth/me"),
};

// ── User ─────────────────────────────────────────────────
export const userAPI = {
  updateProfile: (data) =>
    request("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getWishlist: () => request("/api/user/wishlist"),

  addToWishlist: (productId) =>
    request("/api/user/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),

  removeFromWishlist: (productId) =>
    request("/api/user/wishlist", {
      method: "DELETE",
      body: JSON.stringify({ productId }),
    }),
};

// ── Products (public) ────────────────────────────────────
export const productsAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
    ).toString();
    return request(`/api/products${qs ? "?" + qs : ""}`);
  },

  get: (slug) => request(`/api/products/${slug}`),
};

// ── Admin ────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => request("/api/admin/stats"),

  // Products
  listProducts: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
    ).toString();
    return request(`/api/admin/products${qs ? "?" + qs : ""}`);
  },

  getProduct: (id) => request(`/api/admin/products/${id}`),

  createProduct: (formData) =>
    request("/api/admin/products", { method: "POST", body: formData }),

  updateProduct: (id, body) =>
    request(`/api/admin/products/${id}`, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  deleteProduct: (id) =>
    request(`/api/admin/products/${id}`, { method: "DELETE" }),

  // Inventory
  getInventory: (id) => request(`/api/admin/products/${id}/inventory`),

  updateInventory: (id, data) =>
    request(`/api/admin/products/${id}/inventory`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Users
  listUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/admin/users${qs ? "?" + qs : ""}`);
  },

  // Seed
  seed: () => request("/api/admin/seed", { method: "POST" }),
};
