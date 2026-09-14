

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

export const cartAPI = {
  get: () => request("/api/user/cart"),

  add: (productId, qty = 1) =>
    request("/api/user/cart", {
      method: "POST",
      body: JSON.stringify({ productId, qty }),
    }),

  setQty: (productId, qty) =>
    request("/api/user/cart", {
      method: "PATCH",
      body: JSON.stringify({ productId, qty }),
    }),

  remove: (productId) =>
    request("/api/user/cart", {
      method: "DELETE",
      body: JSON.stringify({ productId }),
    }),

  merge: (items) =>
    request("/api/user/cart/merge", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),
};

export const ordersAPI = {
  create: (data) =>
    request("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: () => request("/api/orders"),
};

export const categoriesAPI = {
  list: () => request("/api/categories"),
};

export const productsAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
    ).toString();
    return request(`/api/products${qs ? "?" + qs : ""}`);
  },

  get: (slug) => request(`/api/products/${slug}`),
};

export const adminAPI = {
  getStats: () => request("/api/admin/stats"),

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

  getInventory: (id) => request(`/api/admin/products/${id}/inventory`),

  updateInventory: (id, data) =>
    request(`/api/admin/products/${id}/inventory`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  listUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/admin/users${qs ? "?" + qs : ""}`);
  },

  seed: () => request("/api/admin/seed", { method: "POST" }),
};